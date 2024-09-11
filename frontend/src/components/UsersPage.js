import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users when the component mounts
    axios.get(`${process.env.REACT_APP_API_URL}/auth/users`)
      .then((res) => {
        setUsers(res.data);  // Store users in state
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="users-page">
      <h2>Registered Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> ({user.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No users registered yet.</p>
      )}
    </div>
  );
}

export default UsersPage;
