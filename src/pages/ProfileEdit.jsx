import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

const ProfileEdit = () => {
  const { user, refreshUser } = useAuth();
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
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleSave = async () => {
    setModal({
      isOpen: true,
      type: 'loading',
      title: 'Updating...',
      message: 'Please wait while we update your profile.'
    });
    
    try {
      await api.updateProfile(formData);
      await refreshUser();
      
      closeModal();
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: 'Your profile has been updated successfully.',
        onConfirm: () => {
          closeModal();
          navigate('/profile');
        }
      });
    } catch (error) {
      closeModal();
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile. Please try again.'
      });
    }
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
            Edit Personal Information
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
            {/* Full Name */}
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
                <User style={{ width: '16px', height: '16px' }} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #F472B6',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* Email */}
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
                <Mail style={{ width: '16px', height: '16px' }} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #60A5FA',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* Phone */}
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
                <Phone style={{ width: '16px', height: '16px' }} />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #22D3EE',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  outline: 'none'
                }}
              />
            </div>

            {/* Address */}
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
                <MapPin style={{ width: '16px', height: '16px' }} />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 12px)',
                  border: '1.5px solid #A78BFA',
                  borderRadius: '10px',
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  background: 'white',
                  color: '#1a1a1a',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  wordWrap: 'break-word'
                }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            marginTop: 'clamp(20px, 5vw, 24px)',
            padding: 'clamp(14px, 4vw, 16px)',
            background: 'linear-gradient(135deg, #34D399, #10B981)',
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
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Save style={{ width: '20px', height: '20px' }} />
          Save Changes
        </button>
      </div>
    </>
  );
};

export default ProfileEdit;
