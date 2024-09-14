import React, { useState } from 'react';
import axios from 'axios';

function CommentItem({ comment, token, userId, setComments }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.body);
  const [showActions, setShowActions] = useState(false);  // Show/hide actions

  // Debugging logs to verify user IDs
  console.log("Comment User ID:", comment.user._id);  // Check this value is present and correct
  console.log("Logged-in User ID:", userId);  // Verify this matches the logged-in user
  
  // Handle editing a comment
  const handleEdit = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/comments/${comment._id}`,
        { body: editedComment },
        { headers: { 'x-auth-token': token } }
      );
      setIsEditing(false);
      setComments(prevComments => prevComments.map(c => (c._id === comment._id ? { ...c, body: editedComment } : c)));  // Re-fetch the comments after editing
    } catch (err) {
      console.error('Error updating comment', err);
    }
  };

  // Handle deleting a comment
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${comment._id}`, {
          headers: { 'x-auth-token': token },
        });
        setComments(prevComments => prevComments.filter(c => c._id !== comment._id));  // Re-fetch comments after deletion
      } catch (err) {
        console.error('Error deleting comment', err);
      }
    }
  };

  // Toggle to show edit/delete actions
  const toggleActions = () => {
    setShowActions(!showActions);  // Toggle showing actions (edit/delete)
  };

  return (
    <div className="comment-item" style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      {/* Clickable comment to toggle the action buttons */}
      <div onClick={toggleActions}>
        {isEditing ? (
          <div>
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              style={{ width: '100%', minHeight: '60px' }}
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>{comment.body}</p>
            <small>By {comment.user.name} on {new Date(comment.date).toLocaleDateString()}</small>
          </div>
        )}
      </div>

      {/* Show actions (edit/delete) only when the comment is clicked and the user owns the comment */}
      {showActions && comment.user._id === userId && (
        <div className="comment-actions" style={{ marginTop: '10px' }}>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default CommentItem;
