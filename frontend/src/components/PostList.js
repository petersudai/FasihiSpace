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
    <>
      <style>
        {`
          .post-list {
            margin: 0 auto;
            max-width: 800px;
          }

          .search-bar {
            width: 100%;
            margin-bottom: 20px;
            max-width: 775px;
          }

          .search-input {
            width: 100%;
            padding: 10px;
            font-size: 14px;
            margin-bottom: 20px;
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
            font-size: 12px;
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

      <div className="post-list">
        <h2>Blog Posts</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blog posts by title, content or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post._id} to={`/posts/${post._id}`} className="post">
              {/* Image on the left */}
              {post.titleImage && (
                <img 
                  src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`} 
                  alt={post.title}
                />
              )}

              {/* Post content on the right */}
              <div className="post-content">
                <div className="post-title">{post.title}</div>
                <p className="post-body">
                  {post.body.substring(0, 100)}...
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
}

export default PostList;
