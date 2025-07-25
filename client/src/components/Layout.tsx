import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.scss';

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="app-header">Final Project</header>

      <nav className="app-nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/profile">User Profile</NavLink>
        <NavLink to="/create-shop">Create Shop</NavLink>
        <NavLink to="/create-category">Create Category</NavLink>
        <NavLink to="/register">register</NavLink>
        <NavLink to="/login">Login</NavLink>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
