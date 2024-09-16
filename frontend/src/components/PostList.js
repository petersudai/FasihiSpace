import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Track search input
  const [filteredPosts, setFilteredPosts] = useState([]); // Store filtered results

  useEffect(() => {
    // Fetch all posts initially
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(res.data);
        setFilteredPosts(res.data); // Set both posts and filteredPosts initially
      } catch (err) {
        console.error('Error fetching posts', err);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter posts when searchQuery changes
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.user && post.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  return (
    <div className="post-list">
      <h2>Blog Posts</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blog posts by title, content or author..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '36%', padding: '10px', fontSize: '14px', marginBottom: '20px' }}
        />
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post._id} className="post">
            <Link to={`/posts/${post._id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>{post.body.substring(0, 100)}...</p>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default PostList;
