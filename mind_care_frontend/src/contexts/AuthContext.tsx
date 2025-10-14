import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

// ------------------------------
// ENV TYPE DEFINITION
// ------------------------------
interface ImportMetaEnv {
  readonly VITE_ENCRYPTION_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ------------------------------
// CONTEXT INTERFACE
// ------------------------------
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// ------------------------------
// ENCRYPTION UTILITIES
// ------------------------------
const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

const encryptData = (data: string): string =>
  CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();

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

// ------------------------------
// SECURE STORAGE (For Non-Sensitive Data)
// ------------------------------
const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const encrypted = encryptData(JSON.stringify(value));
      sessionStorage.setItem(key, encrypted);
    } catch (err) {
      console.error('Failed to encrypt & store data:', err);
    }
  },

  getItem: (key: string): any | null => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = decryptData(encrypted);
    if (!decrypted) return null;

    try {
      return JSON.parse(decrypted);
    } catch (err) {
      console.error('Failed to parse decrypted data:', err);
      return null;
    }
  },

  removeItem: (key: string): void => {
    sessionStorage.removeItem(key);
  },
};

// ------------------------------
// AUTH PROVIDER
// ------------------------------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user session from localStorage
    const storedUser = localStorage.getItem('mindbuddy_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  // ------------------------------
  // LOGIN FUNCTION
  // ------------------------------
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailKey = credentials.email?.toLowerCase();
    const mockUser = emailKey ? mockUsers[emailKey] : null;

    console.debug('[Auth] Login Attempt:', {
      email: emailKey,
      foundUser: !!mockUser,
      expectedRole: mockUser?.user.role,
      providedRole: credentials.role,
    });

    const passwordMatch = mockUser
      ? bcrypt.compareSync(credentials.password, mockUser.password)
      : false;

    if (mockUser && passwordMatch && mockUser.user.role === credentials.role) {
      setUser(mockUser.user);
      localStorage.setItem('mindbuddy_user', JSON.stringify(mockUser.user));

      setIsLoading(false);
      window.location.href = '/select-institution'; // Redirect
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // ------------------------------
  // LOGOUT FUNCTION
  // ------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindbuddy_user');
    localStorage.removeItem('selected_institution');
    localStorage.removeItem('recent_institutions');
    localStorage.removeItem('institution_favorites');
    window.location.href = '/';
  };

  // ------------------------------
  // UPDATE USER FUNCTION
  // ------------------------------
  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('mindbuddy_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
