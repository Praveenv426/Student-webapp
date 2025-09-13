import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { setApiBaseUrl } from '@/utils/config';

export const StudentLoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('API_BASE_URL') || 'http://127.0.0.1:8000/api');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (apiUrl && apiUrl.trim()) {
        setApiBaseUrl(apiUrl);
      }
      const res: any = await login(username, password);
      if (res?.success === false) {
        toast({
          title: "Login failed",
          description: res?.message || "Invalid username or password",
          variant: "destructive",
        });
        return;
      }
      if (res?.otpRequired) {
        navigate('/auth/otp'); // student OTP page
        return;
      }
      toast({
        title: "Login successful",
        description: "Welcome to AMC Student Portal!",
      });
      navigate('/student/dashboard'); // 👈 student dashboard
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      </div>

      <motion.div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        {/* Logo and Header */}
        <motion.div className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo size="xl" className="h-20 sm:h-24 drop-shadow-lg" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">AMC College</h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary">Student Dashboard</h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">Sign in to access your dashboard</p>
          </div>
        </motion.div>

        {/* Login Card */}
        <Card className="premium-card border-0 shadow-premium backdrop-blur-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl sm:text-3xl text-center font-bold bg-gradient-primary bg-clip-text text-transparent">Welcome Back</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base text-muted-foreground">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="student" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="•••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiUrl">Backend URL</Label>
                <Input id="apiUrl" type="url" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
