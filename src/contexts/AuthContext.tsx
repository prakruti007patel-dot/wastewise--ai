import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: Record<UserRole, User> = {
  officer: {
    id: 'officer-001',
    name: 'Rajesh Kumar Sharma',
    email: 'rajesh.sharma@gmcorp.gov',
    role: 'officer',
    designation: 'Ward Health Officer',
    phone: '9876500001',
    wardId: undefined,
  },
  citizen: {
    id: 'citizen-001',
    name: 'Meena Patel',
    email: 'meena.patel@example.com',
    role: 'citizen',
    wardId: 12,
    phone: '9876500002',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('wastewise_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (role: UserRole) => {
    const u = DEMO_USERS[role];
    setUser(u);
    sessionStorage.setItem('wastewise_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('wastewise_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
