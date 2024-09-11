import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Post() {
  const [post, setPost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>Posted by {post.user && post.user.name}</small>
    </div>
  );
}

export default Post;
