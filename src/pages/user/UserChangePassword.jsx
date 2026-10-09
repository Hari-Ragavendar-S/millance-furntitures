import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import { 
  Lock, Eye, EyeOff, Save, X, ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';

const UserChangePassword = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Visibility state for password fields
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle password visibility
  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validate()) {
      // TODO: Call backend API to change password
      console.log('Changing password...');
      
      // Show success message
      setShowSuccess(true);
      
      // Navigate back after 1.5 seconds
      setTimeout(() => {
        navigate('/user/profile');
      }, 1500);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/user/profile');
  };

  return (
    <UserLayout>
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      <div className="user-dashboard-compact">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/user/profile')}
          className="user-profile-back-btn"
        >
          <ArrowLeft size={18} />
          <span>Profile</span>
        </motion.button>

        {/* Change Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="user-card-compact"
        >
          <h3 className="user-section-title">Change Password</h3>
          
          <div className="user-profile-form">
            {/* Current Password */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <Lock size={16} />
                <span>Current Password</span>
              </label>
              <div className="user-profile-password-wrapper">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`user-profile-form-input ${errors.currentPassword ? 'error' : ''}`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePassword('current')}
                  className="user-profile-password-toggle"
                >
                  {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="user-profile-form-error">{errors.currentPassword}</span>
              )}
            </div>

            {/* New Password */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <Lock size={16} />
                <span>New Password</span>
              </label>
              <div className="user-profile-password-wrapper">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`user-profile-form-input ${errors.newPassword ? 'error' : ''}`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePassword('new')}
                  className="user-profile-password-toggle"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="user-profile-form-error">{errors.newPassword}</span>
              )}
              <span className="user-profile-form-hint">
                <AlertCircle size={12} />
                <span>Password must be at least 8 characters</span>
              </span>
            </div>

            {/* Confirm Password */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <Lock size={16} />
                <span>Confirm New Password</span>
              </label>
              <div className="user-profile-password-wrapper">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`user-profile-form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePassword('confirm')}
                  className="user-profile-password-toggle"
                >
                  {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="user-profile-form-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="user-profile-form-actions">
              <button
                onClick={handleSave}
                className="user-profile-form-btn user-profile-btn-save"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
              
              <button
                onClick={handleCancel}
                className="user-profile-form-btn user-profile-btn-cancel"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success Notification */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="user-profile-success-notification"
          >
            <CheckCircle2 size={20} />
            <span>Password changed successfully</span>
          </motion.div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserChangePassword;
