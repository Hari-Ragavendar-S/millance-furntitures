import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralInfo, setReferralInfo] = useState(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    const code = searchParams.get('code');
    if (ref && code) {
      setReferralInfo({ franchise_slug: ref, invite_code: code });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName || formData.fullName.length < 3) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to Terms & Privacy Policy');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (validateStep2()) {
      setLoading(true);
      try {
        let result;
        
        if (referralInfo) {
          // Register with referral
          result = await api.registerWithInvite({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            phone: formData.phone,
            franchise_slug: referralInfo.franchise_slug,
            invite_code: referralInfo.invite_code
          });
          
          // Set token and navigate
          if (result.access_token) {
            api.setToken(result.access_token);
            localStorage.setItem('token', result.access_token);
            localStorage.setItem('role', result.role);
            localStorage.setItem('user_data', JSON.stringify(result.user_data));
            navigate('/dashboard');
            return { success: true };
          }
        } else {
          // Normal registration
          result = await register({
            email: formData.email,
            password: formData.password,
            full_name: formData.fullName,
            phone: formData.phone
          });
        }
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <button className="back-button" onClick={() => step === 1 ? navigate('/') : setStep(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">MLD</div>
            </div>
            <h1 className="auth-title">Create Account</h1>
            {referralInfo ? (
              <p className="auth-subtitle">Complete registration to join the group</p>
            ) : (
              <p className="auth-subtitle">Join thousands of members today</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span className="step-label">Personal Info</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span className="step-label">Account Setup</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="form-step fade-in">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                <button type="button" onClick={handleNext} className="btn btn-primary btn-full">
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step fade-in">
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="input"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToTerms">
                    I agree to <a href="#" onClick={() => navigate('/terms')}>Terms & Conditions</a> and <a href="#" onClick={() => navigate('/privacy')}>Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            )}

            <div className="form-divider">
              <span>Already have an account?</span>
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="btn btn-outline btn-full"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
