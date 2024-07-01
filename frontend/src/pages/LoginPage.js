import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../loginpage.css';

function LoginPage({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
      const endpoint = isSignUp ? '/api/register' : '/api/login';
      try {
          const response = await fetch(`https://blog-management-1.onrender.com${endpoint}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (response.ok) {
              localStorage.setItem('isLoggedIn', true);
              setIsLoggedIn(true);
              localStorage.setItem('username', username);
              navigate(-1); 
          } else {
              setMessage(data.error);
          }
      } catch (error) {
          setMessage('An error occurred while processing your request.');
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage('');
  };

  return (
    <div className="outer">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='messageOuter'>
          <div className='message'>{message}</div>
          </div>
          <button className="button_1" onClick={handleLogin} type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
          <p className="toggle-form">
            {isSignUp ? (
              <>
                Already have an account? <span onClick={toggleForm} className="login-link">Log in</span>
              </>
            ) : (
              <>
                Not a user yet? <span onClick={toggleForm} className="signup-link">Sign up</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
