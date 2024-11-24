import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle regular form submission for login or signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? 'http://localhost:4000/api/users/login'
      : 'http://localhost:4000/api/users/register';
    const body = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status === 200) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');

        if (isLogin) {
          // Save token and role to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          // Save last logged-in user to localStorage
          const lastLoggedInUser = {
            email,
            role: data.role,
          };
          localStorage.setItem('lastLoggedInUser', JSON.stringify(lastLoggedInUser));

          // Redirect based on role
          if (data.role === 'admin') {
            navigate('/productform');
          } else {
            navigate('/');
          }
        } else {
          setIsLogin(true); // Switch to login form after registration
        }
      } else {
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response; // Get the Google token

      // Send the Google token to your backend for verification
      const res = await axios.post('http://localhost:4000/api/users/google-login', {
        token: credential,  // Send the Google token to the backend
      });

      const data = res.data;

      if (res.status === 200) {
        setMessage('Google Login successful!');
        // Handle successful login
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Save the last logged-in user in localStorage
        const lastLoggedInUser = {
          email: data.user.email,
          role: data.user.role,
        };
        localStorage.setItem('lastLoggedInUser', JSON.stringify(lastLoggedInUser));

        navigate('/');  // Redirect to home page or any other page
      }
    } catch (error) {
      console.error('Google Login Error:', error.response ? error.response.data : error.message);
      setMessage('Google Login failed. Please try again.');
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="loginsignup-fields">
            {!isLogin && (
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Continue'}</button>
        </form>

        {/* Google Login Button wrapped inside GoogleOAuthProvider */}
        <div className="google-login">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin 
              onSuccess={handleGoogleLogin} 
              onError={() => console.log('Login Failed')} 
            />
          </GoogleOAuthProvider>
        </div>

        <p className="loginsignup-login">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up Here' : 'Login Here'}
          </span>
        </p>
       
      </div>
    </div>
  );
};

export default LoginSignup;
