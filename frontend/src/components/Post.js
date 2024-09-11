import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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

        // Debugging: Log post data and logged-in user data
        console.log("Post data:", res.data);
        console.log("Logged-in user data:", user);

        console.log("Post Owner ID:", res.data.user?._id);
        console.log("Logged-in User ID:", user?._id);

        // Check if the logged-in user is the owner of the post
        if (res.data.user && res.data.user._id === user?._id) {
          const postOwnerId = String(res.data.user._id);
          const loggedInUserId = String(user._id);

          console.log(`Comparing Post Owner ID (${postOwnerId}) with Logged-in User ID (${loggedInUserId})`);

          if (postOwnerId === loggedInUserId) {
            console.log("User is the owner of the post.");
            setIsOwner(true);
          } else {
            console.log("User is NOT the owner of the posty.");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleDelete = async () => {
    // Ask the user for confirmation before deleting
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
      console.log('Delete operation cancelled by user.');
    }
  };
  

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>Posted by {post.user ? post.user.name : 'Unknown'}</small>

      {isOwner && (
        <div>
          <button onClick={() => navigate(`/edit/${id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Post;
