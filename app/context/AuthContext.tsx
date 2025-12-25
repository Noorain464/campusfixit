import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken, removeToken } from '../../utils/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const token = await getToken();
      if (token) {
        const res = await authApi.getCurrentUser();
        setUser(res.user || res);
      }
    } catch (err) {
      await removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkUser(); }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout: removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);