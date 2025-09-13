import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext'; // student context
import { useNavigate } from 'react-router-dom';

const StudentOTPPage: React.FC = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('pending_user_id') || '';

  const onVerify = async () => {
    if (!userId) return;
    setLoading(true);
    const ok = await verifyOtp(userId, otp);
    setLoading(false);
    if (ok) {
      navigate('/student-dashboard'); // redirect to student dashboard
    }
  };

  const onResend = async () => {
    if (!userId) return;
    await resendOtp(userId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>Please enter the 6-digit code sent to your email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, idx) => (
                <InputOTPSlot key={idx} index={idx} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={onVerify} disabled={loading || otp.length !== 6}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant="outline" onClick={onResend}>Resend OTP</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOTPPage;
