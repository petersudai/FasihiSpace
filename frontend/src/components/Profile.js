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

    const fetchReadPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/read-posts`, {
          headers: { 'x-auth-token': token }
        });
        setReadPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    fetchUserPosts();
    fetchReadPosts();
  }, [token]);

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
    <>
      <style>
        {`
          .profile-page {
            margin: 0 auto;
            max-width: 800px;
          }

          .profile-form {
            margin-bottom: 20px;
          }

          .input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 14px;
          }

          .button {
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
          }

          .post {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.5s ease-in-out;
            cursor: pointer;
            text-decoration: none;
            color: inherit;
          }

          .post p {
            color: black;
          }

          .post:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .post img {
            width: 150px;
            height: 100px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 20px;
            transition: transform 0.3s ease;
          }

          .post:hover img {
            transform: scale(1.1);
          }

          .post-content {
            flex: 1;
          }

          .post-title {
            font-size: 22px;
            font-weight: bold;
            color: #000;
            text-decoration: none;
            margin-bottom: 10px;
            transition: color 0.3s ease;
          }

          .post-body {
            font-size: 6px;
            color: #000;
          }

          .post:hover .post-title {
            color: #000;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="profile-page">
        <h2>User Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
          />
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
          />
          <label>Profile Picture URL:</label>
          <input
            type="text"
            value={formData.profilePicture}
            onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            className="input"
          />
          <button type="submit" className="button">Update Profile</button>
        </form>

        <h3>My Posts</h3>
        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post._id} to={`/posts/${post._id}`} className="post">
                {post.titleImage && (
                  <img
                    src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`}
                    alt={post.title}
                  />
                )}
                <div className="post-content">
                  <div className="post-title">{post.title}</div>
                  <p className="post-body">
                    {post.body.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>You haven't created any posts yet.</p>
          )}
        </div>

        <h3>Posts You've Read</h3>
        <div className="post-list">
          {readPosts.length > 0 ? (
            readPosts.map((post) => (
              <Link key={post._id} to={`/posts/${post._id}`} className="post">
                {post.titleImage && (
                  <img
                    src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`}
                    alt={post.title}
                  />
                )}
                <div className="post-content">
                  <div className="post-title">{post.title}</div>
                  <p className="post-body">
                    {post.body.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>You haven't read any posts yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
