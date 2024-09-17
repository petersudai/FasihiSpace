import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TurndownService from 'turndown';

// Custom toolbar options for ReactQuill
const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }]
  ],
};

function PostForm({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const quillRef = useRef(null);

  const turndownService = new TurndownService();

  useEffect(() => {
    if (id) {
      // Fetch post if editing
      axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setBody(res.data.body);
          setIsEditing(true);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);

    // Convert the HTML from ReactQuill to Markdown using Turndown
    const markdownBody = turndownService.turndown(body);
    formData.append('body', markdownBody);

    console.log('Title:', title);
    console.log('Body (Markdown):', markdownBody);

    // Check if the image is selected
    if (image) {
      formData.append('image', image);
      console.log('Image:', image);
    } else {
      console.log('No image provided');
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      };

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, formData, config);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, config);
      }

      navigate('/');
    } catch (err) {
      console.error('Error submitting form', err);
    }
  };

  return (
    <div className="post-form-container">
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>

        {/* Title Input */}
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title"
          required
        />

        {/* React Quill Editor */}
        <ReactQuill 
          ref={quillRef}
          value={body}
          onChange={setBody}
          modules={modules}
          placeholder="Write your blog content here..."
        />

        {/* Image Input */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />

        <button type="submit">{isEditing ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
}

export default PostForm;
