import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Auth.scss';

interface LoginResponse {
  token: string;
}

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/HomePage');
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      console.log('🔑 Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: unknown) {
      interface AxiosErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const axiosError = err as AxiosErrorResponse;
      if (
        typeof err === 'object' &&
        err !== null &&
        axiosError.response?.data?.message &&
        typeof axiosError.response.data.message === 'string'
      ) {
        setError(axiosError.response.data.message);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}