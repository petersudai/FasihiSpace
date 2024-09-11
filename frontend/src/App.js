import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import Post from './components/Post';
import PostForm from './components/PostForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UsersPage from './components/UsersPage';
import './styles/styles.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);  // Add state to store the user's name

  return (
    <Router>
      <Header isLoggedIn={!!token} setIsLoggedIn={setToken} user={user} setToken={setToken} />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} />} /> {/* Pass setUser to LoginForm */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/create" element={<PostForm token={token} />} />
        <Route path="/edit/:id" element={<PostForm token={token} />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
