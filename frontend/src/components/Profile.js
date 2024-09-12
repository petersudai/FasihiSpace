import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile({ token }) {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
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

    fetchProfile();
    fetchUserPosts();
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

      <h3>My Posts</h3>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>
              <strong>{post.title}</strong> {/* Clicking this will take the user to the post */}
            </Link>
            <p>{post.body.slice(0, 100)}... <Link to={`/posts/${post._id}`}>Read more</Link></p>
            <small>Posted on: {new Date(post.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
