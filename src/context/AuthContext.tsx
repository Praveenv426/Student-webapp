import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, verifyOTP, logoutUser } from '@/utils/authService';

type Role = 'student';

interface UserProfile {
  user_id?: string;
  username?: string;
  email?: string;
  role?: string;
  department?: string | null;
  profile_image?: string | null;
  branch?: string;
  semester?: number;
  section?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  profilePic?: string;
  branch?: string;
  semester?: number;
  section?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (storedProfile && role === 'student') {
      const profile: UserProfile = JSON.parse(storedProfile);
      setUser({
        id: profile.user_id || '0',
        email: profile.email || '',
        name: profile.username || 'Student',
        role: 'student',
        department: profile.department || undefined,
        branch: profile.branch || undefined,
        semester: profile.semester || undefined,
        section: profile.section || undefined,
        profilePic: profile.profile_image || undefined,
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser({ username: email, password });
      if (!result.success) {
        setError(result.message || 'Login failed');
        return { success: false, message: result.message || 'Login failed' };
      }

      const storedProfile = localStorage.getItem('user');
      const role = localStorage.getItem('role');

      if (storedProfile && role === 'student') {
        const profile: UserProfile = JSON.parse(storedProfile);
        setUser({
          id: profile.user_id || '0',
          email: profile.email || '',
          name: profile.username || 'Student',
          role: 'student',
          department: profile.department || undefined,
          branch: profile.branch || undefined,
          semester: profile.semester || undefined,
          section: profile.section || undefined,
          profilePic: profile.profile_image || undefined,
        });
        return { success: true };
      } else {
        setError('You do not have student access');
        return { success: false, message: 'You do not have student access' };
      }

    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred');
      return { success: false, message: err?.message || 'An unknown error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
