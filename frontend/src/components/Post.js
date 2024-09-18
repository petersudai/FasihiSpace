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
      // Add the token to axios default headers for all requests
      axios.defaults.headers.common['x-auth-token'] = token;
    }
    
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
        setPost(res.data);

        // Check if the logged-in user is the owner of the post
        if (res.data.user && res.data.user._id === user?._id) {
          const postOwnerId = String(res.data.user._id);
          const loggedInUserId = String(user._id);

          if (postOwnerId === loggedInUserId) {
            setIsOwner(true);
          }
        }

        // Fetch likes and check if the post is liked by the user
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/likes/${id}/isLiked`, {
          headers: { 'x-auth-token': token },
        });
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/likes/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setLikesCount(likesCount - 1);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/likes/${id}`, {}, {
          headers: { 'x-auth-token': token },
        });
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error handling like/unlike:', err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          headers: { 'x-auth-token': token },
        });
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('Delete operation cancelled.');
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="post-container">
      <div className="post">

        {/* Display the post image */}
        {post.titleImage && (
          <img 
            src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${post.titleImage}` }
            alt={post.title} 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
        
        <h2>{post.title}</h2>

        {/* Use ReactMarkdown to render the post body */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>

        <small>Posted by {post.user ? post.user.name : 'Unknown'} on {new Date(post.date).toLocaleDateString()}</small>

        {/* Likes Section */}
        <div className="like-section" style={{ marginTop: '10px' }}>
          <button 
            onClick={handleLike} 
            className={isLiked ? 'liked' : ''} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isLiked ? '❤️ Unlike' : '🤍 Like'}
          </button>
          <span style={{ marginLeft: '10px' }}>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
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
  );
}

export default Post;
