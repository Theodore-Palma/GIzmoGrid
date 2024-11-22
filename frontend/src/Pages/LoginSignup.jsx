import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
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
              localStorage.setItem('token', data.token);  // Save token in localStorage
              localStorage.setItem('role', data.role);    // Save role in localStorage
              console.log('Logged role:', data.role);     // Debugging log to confirm role is saved
      
              if (data.role === 'admin') {
                navigate('/productform');  // Redirect to admin page
              } else {
                navigate('/');  // Redirect to home page for regular users
              }
            } else {
              setIsLogin(true);  // Switch to login form after registration
            }
          } else {
            setMessage(data.error || 'An error occurred');
          }
        } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
          setMessage('An error occurred. Please try again.');
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
                <p className="loginsignup-login">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up Here' : 'Login Here'}
                    </span>
                </p>
                {!isLogin && (
                    <div className="loginsignup-agree">
                        <input type="checkbox" />
                        <p>By continuing, I agree to the terms of use & privacy policy</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;
