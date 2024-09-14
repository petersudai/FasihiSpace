import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem';

function CommentList({ postId, token, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { postId, body: newComment },
        { headers: { 'x-auth-token': token } }
      );

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      setError('Error adding comment.');
      console.error(err);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map(comment => (
          <CommentItem
            key={comment._id}
            comment={comment}
            token={token}
            userId={userId}
            setComments={setComments}
          />
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}

      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Add Comment</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CommentList;
