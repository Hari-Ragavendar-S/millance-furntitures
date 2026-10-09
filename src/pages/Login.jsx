import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Building2, User, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginType = location.pathname === '/franchise' ? 'franchise' 
                  : location.pathname === '/admin' ? 'admin' 
                  : 'user';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.identifier, formData.password, loginType);
      
      if (result.success) {
        if (loginType === 'user') {
          navigate('/dashboard');
        } else if (loginType === 'franchise') {
          navigate('/franchise-dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getConfig = () => {
    if (loginType === 'admin') {
      return {
        title: 'Admin Login',
        subtitle: 'Secure access to admin panel',
        icon: Shield,
        gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        bgGradient: 'linear-gradient(135deg, #0f0c1d 0%, #1a1333 50%, #0f0c1d 100%)',
        placeholder: 'admin@millancefurniture.com',
        iconBg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
      };
    }
    if (loginType === 'franchise') {
      return {
        title: 'Franchise Login',
        subtitle: 'Access franchise dashboard',
        icon: Building2,
        gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)',
        placeholder: 'franchise@millancefurniture.com',
        iconBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        lightMode: true
      };
    }
    return {
      title: 'User Login',
      subtitle: 'Access your dashboard',
      icon: User,
      gradient: 'linear-gradient(135deg, #ec4899, #ef4444)',
      bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)',
      placeholder: 'Email, Phone, or MLD ID',
      iconBg: 'linear-gradient(135deg, #ec4899, #ef4444)',
      lightMode: true
    };
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className="srimathi-login-page" style={{ background: config.bgGradient }}>
      <div className="srimathi-login-container">
        <div className={`srimathi-login-card ${config.lightMode ? 'light-mode' : 'dark-mode'}`}>
          {/* Back Button */}
          <button className="srimathi-back-button" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>

          {/* Header */}
          <div className="srimathi-login-header">
            <div className="srimathi-icon-container" style={{ background: config.iconBg }}>
              <IconComponent size={32} />
            </div>
            <h1 className="srimathi-login-title">{config.title}</h1>
            <p className="srimathi-login-subtitle">{config.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="srimathi-login-form">
            {/* Error Message */}
            {error && (
              <div className="srimathi-error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Email/Identifier Input */}
            <div className="srimathi-input-group">
              <label className="srimathi-label">
                {loginType === 'user' ? 'Email, Phone, or MLD ID' : 'Email'}
              </label>
              <div className="srimathi-input-wrapper">
                <Mail className="srimathi-input-icon" size={20} />
                <input
                  type="text"
                  name="identifier"
                  className="srimathi-input"
                  placeholder={config.placeholder}
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="srimathi-input-group">
              <label className="srimathi-label">Password</label>
              <div className="srimathi-input-wrapper">
                <Lock className="srimathi-input-icon" size={20} />
                <input
                  type="password"
                  name="password"
                  className="srimathi-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="srimathi-form-footer">
              <a href="#" className="srimathi-link">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="srimathi-submit-btn" 
              style={{ background: config.gradient }}
              disabled={loading}
            >
              {loading ? (
                <div className="srimathi-spinner"></div>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Register for User */}
            {loginType === 'user' && (
              <div className="srimathi-divider">
                <span>Don't have an account?</span>
                <button 
                  type="button"
                  onClick={() => navigate('/register')} 
                  className="srimathi-secondary-btn"
                >
                  Register Now
                </button>
              </div>
            )}
          </form>

          {/* Test Credentials */}
          {(loginType === 'franchise' || loginType === 'admin') && (
            <div className="srimathi-credentials-info">
              <p className="credentials-title">Default Credentials:</p>
              <p className="credentials-value">
                {loginType === 'franchise' && 'franchise@millancefurniture.com / millance'}
                {loginType === 'admin' && 'admin@millancefurniture.com / millance'}
              </p>
            </div>
          )}
        </div>

        {/* Alternative Login Links */}
        {loginType === 'user' && (
          <div className="srimathi-alt-links">
            <p>Looking for different access?</p>
            <div className="srimathi-link-buttons">
              <button onClick={() => navigate('/franchise')} className="srimathi-link-btn">
                Franchise Login
              </button>
              <span>|</span>
              <button onClick={() => navigate('/admin')} className="srimathi-link-btn">
                Admin Login
              </button>
            </div>
          </div>
        )}

        {(loginType === 'franchise' || loginType === 'admin') && (
          <div className="srimathi-alt-links">
            <button onClick={() => navigate('/login')} className="srimathi-link-btn">
              ← Back to User Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
