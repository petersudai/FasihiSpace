import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function PostForm({ token }) {
  const { id } = useParams();  // Get post ID if we're editing
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // If editing, fetch the post data
      const fetchPost = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
          setTitle(res.data.title);
          setBody(res.data.body);
        } catch (err) {
          console.error(err);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { title, body };

    try {
      if (id) {
        // If editing, send a PUT request
        await axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, postData, {
          headers: { 'x-auth-token': token },
        });
      } else {
        // If creating a new post, send a POST request
        await axios.post(`${process.env.REACT_APP_API_URL}/posts`, postData, {
          headers: { 'x-auth-token': token },
        });
      }
      navigate('/'); // Redirect to home after saving
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-form">
      <h2>{id ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
        <button type="submit">{id ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
}

export default PostForm;
