import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from './CommentList';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Post({ token, user }) {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
    } else {
      axios.defaults.headers.common['x-auth-token'] = token;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
        setPost(res.data);

        // Check if the logged-in user is the owner of the post
        if (res.data.user && res.data.user._id === user?._id) {
          setIsOwner(true);
        }

        fetchLikes();
        if (token) {
          await checkIfLiked();
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLikes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/likes/${id}`);
        setLikesCount(res.data.likesCount);
      } catch (err) {
        console.error('Error fetching likes', err);
      }
    };

    const checkIfLiked = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/likes/${id}/isLiked`);
        setIsLiked(res.data.isLiked);
      } catch (err) {
        console.error('Error checking if liked', err.response?.data || err.message);
        setIsLiked(false);
      }
    };

    fetchPost();
  }, [id, user, token]);

  const handleLike = async () => {
    if (!post._id) {
      console.error("Post ID is undefined, cannot perform like action");
      return;
    }

    try {
      if (isLiked) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/likes/${id}`);
        setLikesCount(likesCount - 1);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/likes/${id}`);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error handling like/unlike:', err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <>
      <style>
        {`
          .post-container {
            margin: 0 auto;
            max-width: 800px;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            color: #29252C;
          }

          .post img {
            width: 100%;
            height: auto;
            max-height: 400px; /* Ensures standard size */
            object-fit: cover;
            margin-bottom: 20px;
          }

          .post h2 {
            font-size: 2rem;
            margin-bottom: 24px;
            color: #000;
          }

          .post p {
            color: black;
          }

          .post small {
            display: block;
            margin-top: 10px;
            font-size: 0.9rem;
            color: #000;
          }

          .like-section {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
          }

          .like-section button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            color: #f33535;
          }

          .post-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }

          .post-actions button {
            background-color: #F33535;
            color: #fff;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .post-actions button:hover {
            background-color: #D92525;
          }

          .post-markdown {
            margin-bottom: 20px;
            line-height: 1.8;
          }

          @media (max-width: 600px) {
            .post-container {
              padding: 10px;
            }

            .post img {
              max-height: 250px;
            }
          }
        `}
      </style>

      <div className="post-container">
        <div className="post">
          {/* Display the post image */}
          {post.titleImage && (
            <img
              src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}`}
              alt={post.title}
            />
          )}

          <h2>{post.title}</h2>

          {/* Use ReactMarkdown to render the post body */}
          <div className="post-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          <small>
            Posted by {post.user ? post.user.name : 'Unknown'} on{' '}
            {new Date(post.date).toLocaleDateString()}
          </small>

          {/* Likes Section */}
          <div className="like-section">
            <button onClick={handleLike} className={isLiked ? 'liked' : ''}>
              {isLiked ? '❤️ Unlike' : '🤍 Like'}
            </button>
            <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
          </div>

          {isOwner && (
            <div className="post-actions">
              <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <CommentList postId={post._id} token={token} userId={user ? user._id : null} />
      </div>
    </>
  );
}

export default Post;
