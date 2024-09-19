import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

function Header({ isLoggedIn, setIsLoggedIn, setToken, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    setIsLoggedIn(false);
    setToken(null);
    
    navigate('/login');
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#29252C',
      padding: '10px 20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      color: '#fff',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#F33535',
      textDecoration: 'none',
      transition: 'color 0.3s ease, text-shadow 0.3s ease',
    },
    logoHover: {
      color: '#F33535',
      textShadow: '0 0 8px #F33535', // Soft glowing effect on hover
    },
    nav: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    link: {
      color: '#D8E9F0',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: '#F33535',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #F33535',
      color: '#F33535',
      padding: '5px 10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    logoutBtnHover: {
      backgroundColor: '#F33535',
      color: '#fff',
    },
    userInfo: {
      fontSize: '1rem',
      color: '#D8E9F0',
      marginRight: '20px',
    },
    writeLink: {
      display: 'flex',
      alignItems: 'center',
      color: '#D8E9F0',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'color 0.3s ease',
    },
    writeLinkHover: {
      color: '#F33535',
    },
  };

  return (
    <header style={styles.header}>
      <div className="header-left">
        {/* FasihiSpace logo without box */}
        <Link
          to="/"
          style={styles.logo}
          onMouseOver={(e) => {
            e.target.style.color = styles.logoHover.color;
            e.target.style.textShadow = styles.logoHover.textShadow;
          }}
          onMouseOut={(e) => {
            e.target.style.color = styles.logo.color;
            e.target.style.textShadow = 'none';
          }}
        >
          FasihiSpace
        </Link>
      </div>

      <div className="header-right">
        <nav style={styles.nav}>
          {isLoggedIn ? (
            <>
              <div style={styles.userInfo}>
                Welcome, {user ? user.name : 'Guest'}!
              </div>
              <Link
                to="/create"
                style={styles.writeLink}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = styles.writeLinkHover.color; // Apply hover to the entire link, including icon and text
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = styles.writeLink.color;
                }}
              >
                {/* Unified Write Link with Icon */}
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                Write
              </Link>
              <Link
                to="/profile"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                onMouseOut={(e) => (e.target.style.color = styles.link.color)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = styles.logoutBtnHover.backgroundColor) &&
                  (e.target.style.color = styles.logoutBtnHover.color)
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = styles.logoutBtn.backgroundColor) &&
                  (e.target.style.color = styles.logoutBtn.color)
                }
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                onMouseOut={(e) => (e.target.style.color = styles.link.color)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                onMouseOut={(e) => (e.target.style.color = styles.link.color)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
