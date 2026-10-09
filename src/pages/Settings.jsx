import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Globe, Moon } from 'lucide-react';
import MenuItem from '../components/MenuItem';

const Settings = () => {
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  return (
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
          Settings
        </h1>
      </div>

      {/* Settings Menu */}
      <div style={{
        background: 'white',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E5E7EB'
      }}>
        <MenuItem
          icon={Bell}
          label="Notifications"
          onClick={() => alert('Notification settings coming soon!')}
        />
        <MenuItem
          icon={Shield}
          label="Privacy & Security"
          onClick={() => alert('Privacy settings coming soon!')}
        />
        <MenuItem
          icon={Globe}
          label="Language"
          onClick={() => alert('Language settings coming soon!')}
        />
        <MenuItem
          icon={Moon}
          label="Theme"
          onClick={() => alert('Theme settings coming soon!')}
        />
      </div>

      {/* Coming Soon Message */}
      <div style={{
        marginTop: 'clamp(20px, 5vw, 24px)',
        padding: 'clamp(16px, 4vw, 20px)',
        background: '#EFF6FF',
        borderRadius: 'clamp(10px, 2.5vw, 12px)',
        textAlign: 'center',
        fontSize: 'clamp(13px, 3.5vw, 15px)',
        color: '#1E40AF',
        lineHeight: 1.6
      }}>
        More settings options will be available soon. Stay tuned for updates!
      </div>
    </div>
  );
};

export default Settings;
