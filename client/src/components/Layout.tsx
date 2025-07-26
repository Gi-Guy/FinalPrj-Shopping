import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import axios from 'axios';
import './Layout.scss';

interface UserResponse {
  username: string;
  [key: string]: unknown;
}

export default function Layout() {
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
    <div className="layout-container">
      <header className="app-header">
        <h1>Final Project</h1>
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

      <nav className="app-nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/profile">User Profile</NavLink>
        <NavLink to="/create-shop">Create Shop</NavLink>
        <NavLink to="/create-category">Create Category</NavLink>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
