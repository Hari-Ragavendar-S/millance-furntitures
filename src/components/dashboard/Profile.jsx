import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import ProfileHeader from '../ProfileHeader';
import QuickActionTile from '../QuickActionTile';
import MenuItem from '../MenuItem';
import { 
  Wallet, Gem, Lock, BarChart3, User, 
  Receipt, Gift, Phone, Settings, LogOut
} from 'lucide-react';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: null
  });

  const handlePhotoUpdate = async (photoUrl) => {
    // Refresh user data to get updated photo
    await refreshUser();
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleLogout = () => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      onConfirm: () => {
        closeModal();
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <>
      {/* Floating Bubble Background */}
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: 'clamp(12px, 4vw, 20px)',
        paddingBottom: 'clamp(80px, 20vw, 100px)',
        overflowX: 'hidden'
      }}>
        {/* Profile Header */}
        <ProfileHeader user={user} onPhotoUpdate={handlePhotoUpdate} />

        {/* Quick Actions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: 'clamp(16px, 4vw, 20px)'
        }}>
          <QuickActionTile
            icon={Wallet}
            label="Top Up"
            onClick={() => navigate('/add-money')}
            gradient="linear-gradient(135deg, #EC4899, #F472B6)"
          />
          <QuickActionTile
            icon={Gem}
            label="Savings"
            onClick={() => navigate('/savings-wallet')}
            gradient="linear-gradient(135deg, #8B5CF6, #A78BFA)"
          />
          <QuickActionTile
            icon={Lock}
            label="Password"
            onClick={() => navigate('/change-password')}
            gradient="linear-gradient(135deg, #3B82F6, #60A5FA)"
          />
          <QuickActionTile
            icon={BarChart3}
            label="Stats"
            onClick={() => navigate('/profile/stats')}
            gradient="linear-gradient(135deg, #FBBF24, #FCD34D)"
          />
        </div>

        {/* Menu Section */}
        <div style={{
          background: 'white',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <MenuItem
            icon={Wallet}
            label="Millance Wallet"
            onClick={() => navigate('/millance-wallet')}
          />
          <MenuItem
            icon={Gem}
            label="Savings Wallet"
            onClick={() => navigate('/savings-wallet')}
          />
          <MenuItem
            icon={User}
            label="Personal Information"
            onClick={() => navigate('/profile/edit')}
          />
          <MenuItem
            icon={Lock}
            label="Change Password"
            onClick={() => navigate('/change-password')}
          />
          <MenuItem
            icon={Receipt}
            label="Transaction History"
            onClick={() => navigate('/transaction-history')}
          />
          <MenuItem
            icon={Gift}
            label="My Rewards"
            onClick={() => navigate('/dashboard?tab=rewards')}
          />
          <MenuItem
            icon={Phone}
            label="Support"
            onClick={() => window.location.href = 'mailto:info@millance.gold'}
          />
          <MenuItem
            icon={Settings}
            label="Settings"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={LogOut}
            label="Logout"
            onClick={handleLogout}
            isDanger={true}
            showArrow={false}
          />
        </div>

        {/* Legal Links Footer */}
        <div style={{
          marginTop: 'clamp(24px, 6vw, 32px)',
          paddingTop: 'clamp(20px, 5vw, 24px)',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 16px)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/privacy-policy')}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: 'clamp(12px, 3.2vw, 14px)',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3B82F6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#666'}
          >
            Privacy Policy
          </button>
          <span style={{ color: '#E5E7EB', fontSize: 'clamp(12px, 3vw, 14px)' }}>|</span>
          <button
            onClick={() => navigate('/terms-conditions')}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: 'clamp(12px, 3.2vw, 14px)',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#8B5CF6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#666'}
          >
            Terms & Conditions
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
