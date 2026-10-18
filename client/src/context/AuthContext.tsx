import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { TOKEN_STORAGE_KEY } from '../api/client.js';
import { loginApi, getMeApi } from '../api/auth.js';
import { AuthContext } from './AuthContextDefinition.js';
import type { Admin } from '../types/index.js';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
  });
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAdmin(null);
    setToken(null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        return;
      }

      try {
        const response = await getMeApi();
        if (isMounted) {
          setAdmin(response.admin);
          setToken(storedToken);
        }
      } catch {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();
    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setAdmin({
      id: data.admin.id,
      email: data.admin.email,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <AuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

