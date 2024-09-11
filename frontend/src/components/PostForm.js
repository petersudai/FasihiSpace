import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function PostForm({ token }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch the post data for editing
      axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setBody(res.data.body);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { title, body };

    try {
      if (id) {
        // Update an existing post
        await axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, postData, {
          headers: { 'x-auth-token': token }
        });
      } else {
        // Create a new post
        await axios.post(`${process.env.REACT_APP_API_URL}/posts`, postData, {
          headers: { 'x-auth-token': token }
        });
      }
      navigate('/');
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
