import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Auth.scss';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    username: '',
    userType: 'customer',
    password: '',
  });

  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return 'Weak';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 'Strong';
    return 'Medium';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <select name="userType" value={form.userType} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <div className={`password-strength ${strength.toLowerCase()}`}>Strength: {strength}</div>

        <button type="submit">Register</button>
      </form>

      <div className="auth-alt-action">
        <span>Already have an account?</span>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
}
