import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
        setPosts(res.data);
        setFilteredPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.user && post.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="post-list" style={styles.postList}>
      <h2>Blog Posts</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blog posts by title, content or author..."
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchBar}
        />
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post._id} className="post" style={styles.postContainer}>
            
            {/* Image on the left */}
            {post.titleImage && (
              <img 
                src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`} 
                alt={post.title} 
                style={styles.postImage}
              />
            )}

            {/* Post content on the right */}
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
        <p>No posts available.</p>
      )}
    </div>
  );
}

const styles = {
  postList: {
    margin: '0 auto',
    maxWidth: '800px',
  },
  searchBar: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    marginBottom: '20px',
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
  }
};

export default PostList;
