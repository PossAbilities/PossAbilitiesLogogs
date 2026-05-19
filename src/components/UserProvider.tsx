"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/lib/data";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin] = useState(false);

  useEffect(() => {
    // Mock the auth flow
    const timer = setTimeout(() => {
      const today = new Date();
      setUser({
        id: "1",
        name: "Alex",
        role: "user",
        dateOfBirth: today.toISOString(),
      });
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
