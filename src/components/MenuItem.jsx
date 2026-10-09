import { ChevronRight } from 'lucide-react';

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false, showArrow = true }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(14px, 3.5vw, 18px) clamp(16px, 4vw, 20px)',
        minHeight: '48px',
        background: 'white',
        border: 'none',
        borderBottom: '1px solid #E5E7EB',
        cursor: 'pointer',
        fontSize: 'clamp(14px, 3.8vw, 16px)',
        fontWeight: '500',
        color: isDanger ? '#EF4444' : '#1a1a1a',
        textAlign: 'left',
        transition: 'background 0.2s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = isDanger ? '#FEF2F2' : '#F9FAFB';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'white';
      }}
    >
      <Icon style={{ 
        width: 'clamp(20px, 5vw, 24px)', 
        height: 'clamp(20px, 5vw, 24px)',
        flexShrink: 0,
        color: isDanger ? '#EF4444' : '#666'
      }} />
      <span style={{
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {label}
      </span>
      {showArrow && (
        <ChevronRight style={{ 
          width: 'clamp(18px, 4.5vw, 20px)', 
          height: 'clamp(18px, 4.5vw, 20px)',
          flexShrink: 0,
          color: '#999'
        }} />
      )}
    </button>
  );
};

export default MenuItem;
