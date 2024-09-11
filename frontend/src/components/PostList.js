import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="post-list">
      <h2>Blog Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
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