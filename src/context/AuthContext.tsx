import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, verifyOTP, resendOTP as resendOtpApi, forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi, logoutUser } from '@/utils/authService';

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
  login: (email: string, password: string) => Promise<{ success: boolean; otpRequired?: boolean; user_id?: string; message?: string }>;
  verifyOtp: (user_id: string, otp: string) => Promise<boolean>;
  resendOtp: (user_id: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (params: { user_id: string; otp: string; new_password: string; confirm_password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
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
      const studentUser: User = {
        id: profile.user_id || '0',
        email: profile.email || '',
        name: profile.username || 'Student',
        role: 'student',
        department: profile.department || undefined,
        branch: profile.branch || undefined,
        semester: profile.semester || undefined,
        section: profile.section || undefined,
        profilePic: profile.profile_image || undefined,
      };
      setUser(studentUser);
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
      if (result.message === 'OTP sent' && result.user_id) {
        sessionStorage.setItem('pending_user_id', result.user_id);
        return { success: true, otpRequired: true, user_id: result.user_id };
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

  const verifyOtp = async (user_id: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyOTP({ user_id, otp });
      if (!res.success) {
        setError(res.message || 'Invalid OTP');
        return false;
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
        sessionStorage.removeItem('pending_user_id');
        return true;
      }
      setError('You do not have student access');
      return false;
    } catch (err: any) {
      setError(err?.message || 'OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (user_id: string) => {
    const res = await resendOtpApi({ user_id });
    return !!res.success;
  };

  const forgotPassword = async (email: string) => {
    const res = await forgotPasswordApi({ email });
    return !!res.success;
  };

  const resetPassword = async (params: { user_id: string; otp: string; new_password: string; confirm_password: string }) => {
    const res = await resetPasswordApi(params);
    return !!res.success;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, verifyOtp, resendOtp, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
