import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import { 
  User, Mail, Phone, MapPin, Users, Building2, Calendar, 
  Shield, Edit, IdCard, CheckCircle 
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // User Profile Data (should be synced with global state/context)
  const profileData = {
    name: 'Rajesh Kumar',
    memberId: 'ML001',
    mobile: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123, Main Street, Chennai, Tamil Nadu - 600001',
    team: 'Team 1',
    group: 'Group A',
    franchise: 'Chennai Central Franchise',
    registrationDate: 'Nov 22, 2023',
    status: 'ACTIVE'
  };

  const handleEditProfile = () => {
    navigate('/user/profile/edit');
  };

  const handleChangePassword = () => {
    navigate('/user/profile/change-password');
  };

  // Get status color
  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'user-profile-status-active';
      case 'INACTIVE': return 'user-profile-status-inactive';
      case 'SUSPENDED': return 'user-profile-status-suspended';
      default: return 'user-profile-status-default';
    }
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
        {/* Compact Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-profile-header-card"
        >
          <div className="user-profile-avatar">
            <User size={32} />
          </div>
          <div className="user-profile-header-info">
            <h1 className="user-profile-name">{profileData.name}</h1>
            <div className="user-profile-meta">
              <span className="user-profile-member-id">
                <IdCard size={14} />
                <span>{profileData.memberId}</span>
              </span>
              <span className={`user-profile-status ${getStatusClass(profileData.status)}`}>
                <CheckCircle size={14} />
                <span>{profileData.status}</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="user-card-compact"
        >
          <h3 className="user-section-title">Profile Information</h3>
          
          <div className="user-profile-info-grid">
            <div className="user-profile-info-item">
              <User className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Full Name</span>
                <span className="user-profile-info-value">{profileData.name}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item">
              <Phone className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Mobile</span>
                <span className="user-profile-info-value">{profileData.mobile}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item">
              <Mail className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Email</span>
                <span className="user-profile-info-value">{profileData.email}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item user-profile-info-full">
              <MapPin className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Address</span>
                <span className="user-profile-info-value">{profileData.address}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item">
              <Users className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Team & Group</span>
                <span className="user-profile-info-value">{profileData.team} - {profileData.group}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item">
              <Building2 className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Franchise</span>
                <span className="user-profile-info-value">{profileData.franchise}</span>
              </div>
            </div>
            
            <div className="user-profile-info-item">
              <Calendar className="user-profile-info-icon" />
              <div>
                <span className="user-profile-info-label">Registration Date</span>
                <span className="user-profile-info-value">{profileData.registrationDate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="user-card-compact"
        >
          <h3 className="user-section-title">Account Actions</h3>
          
          <div className="user-profile-actions-grid">
            <button
              onClick={handleEditProfile}
              className="user-profile-action-btn user-profile-btn-edit"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
            
            <button
              onClick={handleChangePassword}
              className="user-profile-action-btn user-profile-btn-password"
            >
              <Shield size={18} />
              <span>Change Password</span>
            </button>
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
