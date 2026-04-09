// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { pb } from "../lib/pocketbase";
import type { AuthRecord } from "pocketbase";

export interface AuthContextType {
  user: AuthRecord;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(pb.authStore.record);
  const [token, setToken] = useState(pb.authStore.token);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!pb.authStore.isValid) {
        pb.authStore.clear();
        return;
      }

      try {
        await pb.collection("users").authRefresh(); // hits the server
      } catch {
        pb.authStore.clear(); // token rejected → log out
      }
    };

    verifyAuth();
    // Listen for auth state changes
    const unsub = pb.authStore.onChange((token, model) => {
      setUser(model);
      setToken(token);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await pb.collection("users").authWithPassword(email, password);
  };

  const logout = () => pb.authStore.clear();

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
