import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import axios from 'axios';

interface UserResponse {
  username: string;
  [key: string]: unknown;
}

export default function Header() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get<UserResponse>(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <header className="header">
      <h1>MyShop</h1>
      <nav>
        {isLoggedIn ? (
          <>
            {user && <span style={{ marginRight: '1rem' }}>Welcome, {user.username}</span>}
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: '1rem' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}