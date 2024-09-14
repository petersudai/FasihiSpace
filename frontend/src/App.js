import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import Post from './components/Post';
import PostForm from './components/PostForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UsersPage from './components/UsersPage';
import Profile from './components/Profile';
import './styles/styles.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load token and user data from localStorage when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle login, saving token and user data to localStorage
  const handleLogin = (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle logout, clearing token and user data from state and localStorage
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Header 
        isLoggedIn={!!token} 
        setIsLoggedIn={setToken} 
        user={user} 
        setToken={setToken} 
        handleLogout={handleLogout}  // Pass logout handler to Header
      />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/create" element={token ? <PostForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={token ? <PostForm token={token} /> : <Navigate to="/login" />} />
        <Route path="/posts/:id" element={<Post token={token} user={user} />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={token ? <Profile token={token} user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
