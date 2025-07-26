"use client"; // Ensure this is the very first line

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of AuthContext
type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void; // Add logout function
};

// Create the context with null default
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Add logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Reset authentication state
    setIsAuthenticated(false);
    // Optional: Clear any other user-related data
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated,
      logout // Add to context provider
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};