import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, setIsLoggedIn, setToken, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and set the login state to false
    setToken(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">FasihiSpace</Link> {/* Clickable logo */}
        <nav>
          {isLoggedIn ? (
            <>
              <Link to="/create">New Post</Link>
              <Link to="/users">Users</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>

      {isLoggedIn && (
        <div className="user-info"> {/* User info positioned at the top right */}
          <span>Welcome, {user ? user.name : 'Guest'}!</span>
        </div>
      )}
    </header>
  );
}

export default Header;
