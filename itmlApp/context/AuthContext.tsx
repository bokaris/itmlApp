import React, { createContext, useContext, useState } from "react";

export type Role = "employee" | "manager" | "hr" | null;

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
} | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
};

const AuthCtx = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthCtx.Provider value={{ user, setUser }}>{children}</AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
