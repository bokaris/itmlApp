import React, { createContext, useContext, useState } from "react";

type Role = "employee" | "manager" | "hr" | null;
type User = { id: number; name: string; role: Role } | null;

const AuthCtx = createContext<{ user: User; setUser: (u: User) => void }>({
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
