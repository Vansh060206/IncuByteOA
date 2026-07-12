import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="brand">
            <div className="brand-icon" />
            AutoVault
          </Link>

          <div className="nav-user">
            {user ? (
              <>
                <span className="user-badge">{user.name} ({user.role})</span>
                <ul className="nav-links">
                  <li>
                    <Link to="/" className="nav-link">
                      Vehicles
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="nav-links">
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </>
  );
};
