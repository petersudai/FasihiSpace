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
      axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
        headers: {
          'x-auth-token': token,
        }
      })
        .then((res) => {
          setTitle(res.data.title);
          setBody(res.data.body);
          setIsEditing(true);
        })
        .catch((err) => console.error(err));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the token being sent in headers
    console.log('Token being sent in headers:', token);

    const formData = new FormData();
    formData.append('title', title);

    // Convert the HTML from ReactQuill to Markdown using Turndown
    const markdownBody = turndownService.turndown(body);
    formData.append('body', markdownBody);

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
          'x-auth-token': token,
        },
      };

      console.log('Form Data:', formData);
      console.log('Config:', config);

      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, formData, config);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, config);
      }

      navigate('/');
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <>
      <style>
        {`
          .post-form-container {
            margin: 0 auto;
            max-width: 800px;
            background-color: #7e8c8d;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #000;
          }

          .post-form-container h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 2rem;
            color: #000;
          }

          .post-form-container input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            color: #000;
          }

          .post-form-container input[type="text"]:focus {
            border-color: #F33535;
            outline: none;
          }

          .post-form-container input[type="file"] {
            margin-bottom: 20px;
          }

          .post-form-container button {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #F33535;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .post-form-container button:hover {
            background-color: #D92525;
          }
        `}
      </style>

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
    </>
  );
}

export default PostForm;
