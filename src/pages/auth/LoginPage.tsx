import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-24 p-4 border rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center">Student Login</h1>
      <input type="email" name="email" placeholder="Email" required className="p-2 border rounded" />
      <input type="password" name="password" placeholder="Password" required className="p-2 border rounded" />
      <button type="submit" disabled={loading} className="p-2 bg-primary text-white rounded">
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default LoginPage;
