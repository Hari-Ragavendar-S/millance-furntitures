import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, Trophy, Tv, Sofa, Coins, X } from 'lucide-react';

const Login = () => {
  const [activeRole, setActiveRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  // ESC key handler to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showTermsModal) {
        setShowTermsModal(false);
      }
    };

    if (showTermsModal) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showTermsModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Terms validation for USER only
    if (activeRole === 'USER' && !termsAccepted) {
      setValidationError('Please accept the Terms & Conditions to continue.');
      return;
    }
    
    // Demo credentials - Accept any email/password for now
    // In production, add proper authentication
    
    if (activeRole === 'USER') {
      navigate('/user/dashboard');
    } else {
      navigate('/franchise/dashboard');
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setValidationError('');
    if (role === 'FRANCHISE') {
      setTermsAccepted(false);
    }
  };

  const termsContent = [
    "Members joining the Prize Scheme must pay ₹1,000 per month regularly without fail.",
    "The payment period is for a total of 11 months.",
    "The lucky draw will be conducted on the 15th of every month.",
    "The lucky draw will be conducted every month. Payment must be made on or before the 10th of every month.",
    "Only the token numbers of members who have paid within the specified due date will be included in the lucky draw.",
    "Members who win a prize do not need to continue making payments.",
    "Prize winners are eligible for the applicable commission/benefit as specified by the scheme.",
    "Jewellery prizes will be provided in 22 Karat (916) gold.",
    "The lucky draw will be announced/communicated through an online process.",
    "If payment is not made during the scheme period, at the end of the 12th month, the amount paid will be provided in the form of products.",
    "Payments must be made only through the online payment method.",
    "At the end of 11 months, the amount paid will not be returned as cash. In the 12th month, the accumulated amount can be used only for purchasing products. For 11 months, ₹11,000 will have been paid, and an additional ₹2,000 in the 12th month will be added, making a total value of ₹13,000, which can be used to purchase products."
  ];

  const floatingPrizes = [
    { icon: Tv, label: '32" LED TV', delay: 0 },
    { icon: Sofa, label: 'Premium Sofa', delay: 0.3 },
    { icon: Coins, label: 'Gold Coin', delay: 0.6 },
  ];

  return (
    <div className="premium-login-container">
      {/* LEFT SIDE - COMPACT LOGIN */}
      <div className="premium-login-left">
        <div className="premium-login-content">
          {/* Compact Logo */}
          <motion.div
            className="premium-logo"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="premium-logo-icon" />
            <h1>MILLANCE</h1>
          </motion.div>

          {/* Compact Login Card */}
          <motion.div
            className="premium-login-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Compact Header */}
            <div className="premium-login-header">
              <h2>Welcome Back</h2>
              <p>Please login to continue</p>
            </div>

            {/* Compact Role Selector */}
            <div className="premium-role-selector">
              <button
                type="button"
                className={`premium-role-btn ${activeRole === 'USER' ? 'active' : ''}`}
                onClick={() => handleRoleChange('USER')}
              >
                USER
              </button>
              <button
                type="button"
                className={`premium-role-btn ${activeRole === 'FRANCHISE' ? 'active' : ''}`}
                onClick={() => handleRoleChange('FRANCHISE')}
              >
                FRANCHISE
              </button>
            </div>

            {/* Compact Login Form */}
            <form onSubmit={handleSubmit} className="premium-login-form">
              {/* Email Input */}
              <div className="premium-input-group">
                <Mail className="premium-input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="premium-input-group">
                <Lock className="premium-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="premium-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Compact Remember & Forgot */}
              <div className="premium-form-options">
                <label className="premium-remember">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="premium-forgot">Forgot Password?</a>
              </div>

              {/* Terms & Conditions - USER ONLY */}
              {activeRole === 'USER' && (
                <div className="premium-terms-section">
                  <label className="premium-terms-label">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="premium-terms-link"
                      >
                        Terms & Conditions
                      </button>
                    </span>
                  </label>
                </div>
              )}

              {/* Validation Error */}
              {validationError && (
                <motion.div
                  className="premium-validation-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {validationError}
                </motion.div>
              )}

              {/* Compact Login Button */}
              <motion.button
                type="submit"
                className="premium-login-btn"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>

              {/* Compact Join Now */}
              <p className="premium-signup">
                Don't have an account? <a href="/teams">Join Now</a>
              </p>
            </form>
          </motion.div>

          {/* Compact Admin Link */}
          <motion.a
            href="/admin/login"
            className="premium-admin-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Admin Login →
          </motion.a>
        </div>
      </div>

      {/* RIGHT SIDE - CLEAN LUCKY DRAW SHOWCASE */}
      <div className="premium-login-right">
        {/* Subtle Background Decoration */}
        <div className="premium-bg-decoration">
          <motion.div
            className="premium-circle premium-circle-1"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="premium-circle premium-circle-2"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        {/* Main Central Visual */}
        <motion.div
          className="premium-main-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Animated Rings */}
          <motion.div
            className="premium-ring premium-ring-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="premium-ring premium-ring-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />

          {/* Central Content Card */}
          <div className="premium-central-card">
            <div className="premium-trophy-icon">
              <Trophy className="w-12 h-12" />
            </div>
            <h2>MILLANCE</h2>
            <h3>LUCKY DRAW</h3>
            <p className="premium-tamil">ஆரம்பமான அனுமுகம் – அதிர்ஷ்ட பரிசுகள்</p>
          </div>

          {/* 3 Floating Prize Cards Only */}
          <AnimatePresence>
            {floatingPrizes.map((prize, index) => (
              <motion.div
                key={index}
                className={`premium-floating-prize premium-prize-${index + 1}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + prize.delay }}
              >
                <motion.div
                  className="premium-prize-card"
                  animate={{
                    y: index === 0 ? [-8, 8, -8] : index === 1 ? [8, -8, 8] : [-5, 5, -5],
                    rotate: index === 2 ? [-3, 3, -3] : 0,
                  }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <prize.icon className="premium-prize-icon" />
                  <span>{prize.label}</span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Compact Statistics */}
        <motion.div
          className="premium-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="premium-stat">
            <div className="premium-stat-number">200+</div>
            <div className="premium-stat-label">Winners</div>
          </div>
          <div className="premium-stat-divider" />
          <div className="premium-stat">
            <div className="premium-stat-number">₹50L+</div>
            <div className="premium-stat-label">Distributed</div>
          </div>
          <div className="premium-stat-divider" />
          <div className="premium-stat">
            <div className="premium-stat-number">11</div>
            <div className="premium-stat-label">Monthly Draws</div>
          </div>
        </motion.div>

        {/* Subtle Particles */}
        <div className="premium-particles">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="premium-particle"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            className="terms-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTermsModal(false)}
          >
            {/* Modal Content */}
            <motion.div
              className="terms-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="terms-modal-header">
                <div>
                  <h2 className="terms-modal-title">Terms & Conditions</h2>
                  <p className="terms-modal-subtitle">Millance Lucky Draw – User Terms & Conditions</p>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="terms-modal-close"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="terms-modal-body">
                {termsContent.map((term, index) => (
                  <div key={index} className="terms-item">
                    <div className="terms-number">{String(index + 1).padStart(2, '0')}</div>
                    <p className="terms-text">{term}</p>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="terms-modal-footer">
                <motion.button
                  type="button"
                  onClick={handleTermsAccept}
                  className="terms-accept-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
