import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../interfaces';

interface IAuthContextType {
  user: User | null;
  setUser: Function;
  loading: boolean;
}

const AuthContext = createContext<IAuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/check_session');
        if (!res.ok) {
          throw new Error('Session check failed');
        }
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth: Function = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };