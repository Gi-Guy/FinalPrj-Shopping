import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Auth.scss';

interface RegisterResponse {
  token: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    gender: '',
    phone: '',
    userType: 'customer'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 'Strong';
    return 'Medium';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        username: form.username,
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        password_hash: form.password,
        gender: form.gender,
        phone: form.phone,
        is_seller: form.userType === 'seller'
      };

      const res = await axios.post<RegisterResponse>(`${import.meta.env.VITE_API_URL}/api/users`, payload);
      console.log('📝 Register response:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: unknown) {
      interface AxiosError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as AxiosError).response?.data?.message === 'string'
      ) {
        setError((err as AxiosError).response!.data!.message!);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <select name="userType" value={form.userType} onChange={handleChange}>
          <option value="customer">Customer (default)</option>
          <option value="seller">Seller</option>
        </select>
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <p>Password Strength: {strength}</p>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
