"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/data";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Mock current user - let's make it their birthday today for testing!
  const today = new Date();
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Alex",
    role: "user",
    dateOfBirth: today.toISOString(), // Today's date means it's their birthday
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
