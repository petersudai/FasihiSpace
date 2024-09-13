import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentList({ postId, token }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      const fetchComments = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${postId}`);
          setComments(res.data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { postId, body: newComment },
        { headers: { 'x-auth-token': token } }
      );
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      setError('Error adding comment.');
      console.error(err);
    }
  };

  if (!postId) return <p>Loading comments...</p>;  // Show loading if postId is not available

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment._id} className="comment">
            <strong>{comment.user.name}</strong>
            <p>{comment.body}</p>
            <small>{new Date(comment.date).toLocaleDateString()}</small>
          </div>
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
