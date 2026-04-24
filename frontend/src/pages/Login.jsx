import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Volunteer' });
  const [error, setError] = useState('');
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData);
    }
    
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <h2 className="login-title">{isLogin ? 'Login to RescueSync' : 'Create an Account'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className="form-control" required onChange={handleChange} />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" required onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" required onChange={handleChange} />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-control" onChange={handleChange}>
                <option value="Volunteer">Volunteer</option>
                <option value="NGO">NGO Representative</option>
                <option value="Admin">Government Admin</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="btn-primary w-100">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        
        <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default Login;
