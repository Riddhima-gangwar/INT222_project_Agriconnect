import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User, AuthResponse } from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getCurrentUser } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user", error);
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = (data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  const updateUser = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
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
