import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Auth.scss';

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>

      <div className="auth-alt-action">
        <span>Dont have an account?</span>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}
