import React, { createContext, useContext, useState, useEffect } from 'react';
import { Catch } from '../interfaces';

interface User {
  username: string;
  catches: Catch[];
  id: number;
}

interface IAuthContextType {
  user: User | null;
  setUser: Function;
  loading: boolean;
}

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContextType | null>(null);

function AuthProvider({ children }: Props) {
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