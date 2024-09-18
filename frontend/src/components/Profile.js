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
    <div className="profile-page" style={styles.profilePage}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} style={styles.profileForm}>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={styles.input}
        />
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
        />
        <label>Profile Picture URL:</label>
        <input
          type="text"
          value={formData.profilePicture}
          onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Update Profile</button>
      </form>

      {/* Section for User's Own Posts */}
      <h3>My Posts</h3>
      <div className="user-posts" style={styles.postList}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post" style={styles.postContainer}>
              {post.titleImage && (
                <img 
                  src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`} 
                  alt={post.title} 
                  style={styles.postImage}
                />
              )}
              <div style={styles.postContent}>
                <Link to={`/posts/${post._id}`} style={styles.postTitle}>
                  {post.title}
                </Link>
                <p style={styles.postBody}>
                  {post.body.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>You haven't created any posts yet.</p>
        )}
      </div>

      {/* Section for Read Posts */}
      <h3>Posts You've Read</h3>
      <div className="read-posts" style={styles.postList}>
        {readPosts.length > 0 ? (
          readPosts.map((post) => (
            <div key={post._id} className="post" style={styles.postContainer}>
              {post.titleImage && (
                <img 
                  src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`} 
                  alt={post.title} 
                  style={styles.postImage}
                />
              )}
              <div style={styles.postContent}>
                <Link to={`/posts/${post._id}`} style={styles.postTitle}>
                  {post.title}
                </Link>
                <p style={styles.postBody}>
                  {post.body.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>You haven't read any posts yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  profilePage: {
    margin: '0 auto',
    maxWidth: '800px',
  },
  profileForm: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  button: {
    padding: '10px 15px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  postList: {
    margin: '0 auto',
    maxWidth: '800px',
  },
  postContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '20px',
  },
  postImage: {
    width: '150px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginRight: '20px',
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000',
    textDecoration: 'none',
    marginBottom: '10px',
  },
  postBody: {
    fontSize: '14px',
    color: '#000',
  },
};

export default Profile;
