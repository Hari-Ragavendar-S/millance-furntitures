import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { Lock, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: null
  });

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleSave = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirm password do not match.'
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Invalid Password',
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    setModal({
      isOpen: true,
      type: 'loading',
      title: 'Updating...',
      message: 'Please wait while we update your password.'
    });
    
    // TODO: Implement password change API
    setTimeout(() => {
      closeModal();
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: 'Your password has been updated successfully.',
        onConfirm: () => {
          closeModal();
          navigate('/profile');
        }
      });
    }, 1500);
  };

  return (
    <>
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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(20px, 5vw, 28px)'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px',
              background: 'white',
              border: '1.5px solid #E5E7EB',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: '#666' }} />
          </button>
          <h1 style={{
            fontSize: 'clamp(20px, 5.5vw, 24px)',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0
          }}>
            Change Password
          </h1>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          padding: 'clamp(16px, 4vw, 24px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 20px)' }}>
            {/* Current Password */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                fontWeight: '600',
                color: '#666',
                marginBottom: '8px'
              }}>
                <Lock style={{ width: '16px', height: '16px' }} />
                Current Password
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                placeholder="Enter current password"
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* New Password */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                fontWeight: '600',
                color: '#666',
                marginBottom: '8px'
              }}>
                <Lock style={{ width: '16px', height: '16px' }} />
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                placeholder="Enter new password"
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #3B82F6',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                fontWeight: '600',
                color: '#666',
                marginBottom: '8px'
              }}>
                <Lock style={{ width: '16px', height: '16px' }} />
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Re-enter new password"
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #3B82F6',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* Info Message */}
            <div style={{
              padding: 'clamp(10px, 3vw, 12px)',
              background: '#EFF6FF',
              borderRadius: '8px',
              fontSize: 'clamp(12px, 3.2vw, 13px)',
              color: '#1E40AF',
              lineHeight: 1.5
            }}>
              Password must be at least 6 characters long.
            </div>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            marginTop: 'clamp(20px, 5vw, 24px)',
            padding: 'clamp(14px, 4vw, 16px)',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: 'white',
            border: 'none',
            borderRadius: 'clamp(10px, 2.5vw, 12px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: 'clamp(15px, 4vw, 17px)',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Lock style={{ width: '20px', height: '20px' }} />
          Update Password
        </button>
      </div>
    </>
  );
};

export default ChangePassword;
