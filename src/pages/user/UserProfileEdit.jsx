import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import { 
  User, Mail, Phone, MapPin, Save, X, ArrowLeft, CheckCircle2 
} from 'lucide-react';

const UserProfileEdit = () => {
  const navigate = useNavigate();
  
  // Form state (initialized with current profile data)
  const [formData, setFormData] = useState({
    name: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123, Main Street, Chennai, Tamil Nadu - 600001'
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

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Invalid mobile number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validate()) {
      // TODO: Update profile data in global state/backend
      console.log('Saving profile:', formData);
      
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

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="user-card-compact"
        >
          <h3 className="user-section-title">Edit Profile</h3>
          
          <div className="user-profile-form">
            {/* Full Name */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <User size={16} />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`user-profile-form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <span className="user-profile-form-error">{errors.name}</span>
              )}
            </div>

            {/* Mobile */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <Phone size={16} />
                <span>Mobile</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`user-profile-form-input ${errors.mobile ? 'error' : ''}`}
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <span className="user-profile-form-error">{errors.mobile}</span>
              )}
            </div>

            {/* Email */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <Mail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`user-profile-form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="user-profile-form-error">{errors.email}</span>
              )}
            </div>

            {/* Address */}
            <div className="user-profile-form-group">
              <label className="user-profile-form-label">
                <MapPin size={16} />
                <span>Address</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`user-profile-form-textarea ${errors.address ? 'error' : ''}`}
                placeholder="Enter your address"
                rows="3"
              />
              {errors.address && (
                <span className="user-profile-form-error">{errors.address}</span>
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
            <span>Profile updated successfully</span>
          </motion.div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserProfileEdit;
