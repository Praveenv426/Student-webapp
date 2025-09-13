import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext'; // student context

const StudentResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await resetPassword({
      user_id: userId,
      otp,
      new_password: password,
      confirm_password: confirm
    });
    if (ok) setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter OTP and new password</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-sm">Password reset successful. You can now login.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user">User ID</Label>
                <Input id="user" value={userId} onChange={(e) => setUserId(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">New Password</Label>
                <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Reset</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResetPasswordPage;
