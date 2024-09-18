import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile({ token }) {
  const [posts, setPosts] = useState([]);
  const [readPosts, setReadPosts] = useState([]); // User's read posts
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/basic-info`, {
          headers: { 'x-auth-token': token }
        });
        setFormData({
          name: res.data.name,
          email: res.data.email,
          profilePicture: res.data.profilePicture || ''
        });
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch user's posts
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/posts`, {
          headers: { 'x-auth-token': token }
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch user's read posts
    const fetchReadPosts = async () => {
      try {
        console.log('Fetching read posts...');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/read-posts`, {
          headers: { 'x-auth-token': token }
        });
        console.log('Read posts response:', res.data);
        setReadPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchUserPosts();
    fetchReadPosts();
  }, [token]);

  // Handle form submit for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/profile`, formData, {
        headers: { 'x-auth-token': token }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <label>Profile Picture URL:</label>
        <input
          type="text"
          value={formData.profilePicture}
          onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
        />
        <button type="submit">Update Profile</button>
      </form>

      {/* Section for User's Own Posts */}
      <h3>My Posts</h3>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>
                <strong>{post.title}</strong>
              </Link>
              <p>{post.body.slice(0, 100)}... <Link to={`/posts/${post._id}`}>Read more</Link></p>
              <small>Posted on: {new Date(post.date).toLocaleDateString()}</small>
            </li>
          ))
        ) : (
          <p>You haven't created any posts yet.</p>
        )}
      </ul>

      {/* Section for Read Posts */}
      <h3>Posts You've Read</h3>
      <ul>
        {readPosts.length > 0 ? (
          readPosts.map((post) => (
            <li key={post._id}>
              <Link to={`/posts/${post._id}`}>
                <strong>{post.title}</strong>
              </Link>
              <p>{post.body.slice(0, 100)}... <Link to={`/posts/${post._id}`}>Read more</Link></p>
              <small>Posted on: {new Date(post.date).toLocaleDateString()}</small>
            </li>
          ))
        ) : (
          <p>You haven't read any posts yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Profile;
