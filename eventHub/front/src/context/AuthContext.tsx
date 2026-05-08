import { createContext, useState, useEffect } from "react";
import getRole from "../utils/auth";

interface AuthContextType {
  role: string | null;
  loading: boolean;
  setRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRole()
      .then((r) => {
        setRole(r);
        setLoading(false);
      })
      .catch(() => {
        setRole(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ role, loading, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}
