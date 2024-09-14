import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from './CommentList';

function Post({ token, user }) {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
        setPost(res.data);

        // Log post and user data for debugging
        console.log("Post data:", res.data);
        console.log("Logged-in user data:", user);

        // Check if the logged-in user is the owner of the post
        if (res.data.user && res.data.user._id === user?._id) {
          const postOwnerId = String(res.data.user._id);
          const loggedInUserId = String(user._id);

          if (postOwnerId === loggedInUserId) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleDelete = async () => {
    // Ask for confirmation before deleting
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
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <small>Posted by {post.user ? post.user.name : 'Unknown'} on {new Date(post.date).toLocaleDateString()}</small>

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
