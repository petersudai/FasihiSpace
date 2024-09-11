import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, setIsLoggedIn, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and set the login state to false
    setToken(null);
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>FasihiSpace</h1>
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link to="/create">New Post</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
