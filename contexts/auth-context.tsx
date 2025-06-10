"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getUserDetails } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  title: string;
  username: string | null;
  // Add other user properties as needed
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Use a ref to track if login is in progress
  const loginInProgressRef = useRef(false);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserDetails(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch user details with token
  const fetchUserDetails = async (authToken: string) => {
    setIsLoading(true);
    try {
      const userData = await getUserDetails(authToken);
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      logout();
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
    }
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Login function with protection against multiple calls
  const login = async (authToken: string) => {
    // If login is already in progress, return early
    if (loginInProgressRef.current) {
      console.log("Login already in progress, ignoring duplicate call");
      return;
    }

    try {
      // Set flag to prevent multiple simultaneous logins
      loginInProgressRef.current = true;

      setToken(authToken);
      localStorage.setItem("auth_token", authToken);
      await fetchUserDetails(authToken);

      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/profile");
      }
    } finally {
      // Reset flag after login completes (success or failure)
      loginInProgressRef.current = false;
    }
  };

  // Enhanced logout function
  const logout = () => {
    // Clear user data
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("auth_token");

    // Reset loading state
    setIsLoading(false);

    // Show toast notification
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
