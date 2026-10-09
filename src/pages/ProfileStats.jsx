import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, IdCard, Building, Award, Calendar, TrendingUp } from 'lucide-react';

const ProfileStats = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  const daysActive = user?.created_at 
    ? Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)) 
    : 0;

  const stats = [
    {
      icon: IdCard,
      label: 'Member ID',
      value: user?.mld_id || 'N/A',
      color: '#F472B6'
    },
    {
      icon: Building,
      label: 'Franchise',
      value: user?.franchise_id || 'N/A',
      color: '#60A5FA'
    },
    {
      icon: Award,
      label: 'Account Type',
      value: (user?.role || 'User').charAt(0).toUpperCase() + (user?.role || 'User').slice(1),
      color: '#FBBF24'
    },
    {
      icon: Calendar,
      label: 'Days Active',
      value: daysActive,
      color: '#34D399'
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) : 'N/A',
      color: '#8B5CF6'
    }
  ];

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
          Account Statistics
        </h1>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(12px, 3vw, 16px)'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: 'clamp(12px, 3vw, 14px)',
              padding: 'clamp(16px, 4vw, 20px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(14px, 3.5vw, 18px)'
            }}
          >
            <div style={{
              width: 'clamp(48px, 12vw, 56px)',
              height: 'clamp(48px, 12vw, 56px)',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <stat.icon style={{ 
                width: 'clamp(24px, 6vw, 28px)', 
                height: 'clamp(24px, 6vw, 28px)',
                color: stat.color
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'clamp(12px, 3.2vw, 13px)',
                color: '#666',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: 'clamp(18px, 4.5vw, 22px)',
                fontWeight: '700',
                color: '#1a1a1a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Summary Card */}
      <div style={{
        marginTop: 'clamp(20px, 5vw, 24px)',
        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(20px, 5vw, 28px)',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
      }}>
        <TrendingUp style={{ 
          width: 'clamp(32px, 8vw, 40px)', 
          height: 'clamp(32px, 8vw, 40px)',
          margin: '0 auto clamp(12px, 3vw, 16px)'
        }} />
        <h3 style={{
          fontSize: 'clamp(16px, 4.2vw, 18px)',
          fontWeight: '600',
          marginBottom: 'clamp(8px, 2vw, 10px)'
        }}>
          Welcome, {user?.full_name || 'User'}!
        </h3>
        <p style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          opacity: 0.9,
          lineHeight: 1.5,
          margin: 0
        }}>
          You've been an active member for {daysActive} days. Keep participating in draws and check your rewards!
        </p>
      </div>
    </div>
  );
};

export default ProfileStats;
