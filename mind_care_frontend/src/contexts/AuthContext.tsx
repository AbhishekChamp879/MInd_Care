import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Encryption utilities for NON-SENSITIVE data storage
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Secure storage for user profile data ONLY (never contains passwords)
const secureStorage = {
  setItem: (key: string, value: any): void => {
    const stringValue = JSON.stringify(value);
    const encrypted = encryptData(stringValue);
    sessionStorage.setItem(key, encrypted);
  },
  
  getItem: (key: string): any | null => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    
    const decrypted = decryptData(encrypted);
    if (!decrypted) return null;
    
    try {
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Parse failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  }
};

// SEPARATE storage for password database (uses sessionStorage directly, no encryption)
// This is acceptable because passwords are already hashed with bcrypt
const passwordStorage = {
  setItem: (key: string, value: any): void => {
    // Store password database directly without AES encryption
    // Passwords are already protected by bcrypt hashing
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  
  getItem: (key: string): any | null => {
    const data = sessionStorage.getItem(key);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Parse failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mindbuddy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = mockUsers[credentials.email?.toLowerCase()];
    // Debugging information for failed demo logins
    console.debug('[Auth] login attempt', {
      emailLookup: credentials.email?.toLowerCase(),
      hasMockUser: !!mockUser,
      expectedRole: mockUser?.user.role,
      providedRole: credentials.role,
    });

    const passwordMatch = mockUser ? bcrypt.compareSync(credentials.password, mockUser.password) : false;
    console.debug('[Auth] passwordMatch:', passwordMatch);

    if (
      mockUser &&
      passwordMatch &&
      mockUser.user.role === credentials.role
    ) {
      setUser(mockUser.user);
      localStorage.setItem('mindbuddy_user', JSON.stringify(mockUser.user));
      setIsLoading(false);
      // Redirect to institution selection instead of directly to dashboard
      window.location.href = '/select-institution';
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindbuddy_user');
    // Clear institution-related data for privacy
    localStorage.removeItem('selected_institution');
    localStorage.removeItem('recent_institutions');
    localStorage.removeItem('institution_favorites');
    // Redirect to the main landing page
    window.location.href = '/';
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };

      // 1. Update React state in context
      setUser(updatedUser);

      // 2. WRITE TO PERSISTENCE (FIXED)
      localStorage.setItem('mindbuddy_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};