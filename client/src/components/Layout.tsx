import { Link, Outlet } from 'react-router-dom';
import './Layout.scss';

export default function Layout() {
  return (
    <div className="layout-container">
      <header className="app-header">Final Project</header>
      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/profile">User Profile</Link>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
