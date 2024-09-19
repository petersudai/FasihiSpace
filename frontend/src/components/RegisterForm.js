import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      console.log('Registration successful', res.data);
      setError(null);  // Clear error
      navigate('/login');  // Redirect to login page after successful registration
    } catch (err) {
      setError('Registration failed, please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <style>
        {`
          .register-form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--black);
          }

          .register-form h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            color: var(--light-grey);
          }

          .register-form form {
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

          .register-form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
          }

          .register-form input:focus {
            border-color: var(--primary-red);
            outline: none;
          }

          .register-form button {
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

          .register-form button:hover {
            background-color: #D92525;
          }

          .register-form p {
            color: var(--primary-red);
            margin-top: 10px;
          }
        `}
      </style>

      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default RegisterForm;
