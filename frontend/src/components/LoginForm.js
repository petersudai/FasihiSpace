import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Login data:', { email, password });
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      // Call handleLogin to update the state in App.js
      handleLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials, please try again.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <>
      <style>
        {`
          .login-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--black);
          }

          .login-form h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--light-grey);
          }

          .login-form form {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
          }

          .login-form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .login-form input:focus {
            border-color: var(--primary-red);
            outline: none;
          }

          .login-form button {
            width: 100%;
            padding: 10px;
            font-size: 1rem;
            background-color: var(--primary-red);
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .login-form button:hover {
            background-color: #D92525;
          }

          .login-form p {
            color: var(--primary-red);
            margin-top: 10px;
          }
        `}
      </style>

      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default LoginForm;
