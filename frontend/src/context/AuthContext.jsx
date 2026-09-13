import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', fullName: 'Amit Deshmukh' },
  accountant: { username: 'accountant', password: 'accountant123', role: 'accountant', fullName: 'Priya Kulkarni' },
  superadmin: { username: 'superadmin', password: 'superadmin123', role: 'superadmin', fullName: 'Ramesh Patil' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ganesh-auth-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ganesh-auth-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ganesh-auth-user');
    }
  }, [user]);

  const login = (username, password) => {
    const found = Object.values(DEMO_USERS).find((candidate) => candidate.username === username && candidate.password === password);
    if (!found) return false;
    setUser({ username: found.username, role: found.role, fullName: found.fullName });
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout, demoUsers: DEMO_USERS }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
