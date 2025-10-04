import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, mockUsers } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

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

    const mockUser = mockUsers[credentials.email];

    if (
      mockUser &&
      mockUser.password === credentials.password &&
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

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
