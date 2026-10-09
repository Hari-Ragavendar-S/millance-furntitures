const QuickActionTile = ({ icon: Icon, label, onClick, gradient }) => {
  return (
    <button
      onClick={onClick}
      style={{
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(6px, 2vw, 8px)',
        padding: 'clamp(12px, 3vw, 16px)',
        background: gradient || 'white',
        border: gradient ? 'none' : '1.5px solid #E5E7EB',
        borderRadius: 'clamp(10px, 2.5vw, 14px)',
        cursor: 'pointer',
        fontSize: 'clamp(12px, 3.2vw, 14px)',
        fontWeight: '600',
        color: gradient ? 'white' : '#1a1a1a',
        boxShadow: gradient ? '0 4px 12px rgba(139, 92, 246, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        wordWrap: 'break-word',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = gradient 
          ? '0 6px 16px rgba(139, 92, 246, 0.3)' 
          : '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = gradient 
          ? '0 4px 12px rgba(139, 92, 246, 0.2)' 
          : '0 2px 4px rgba(0, 0, 0, 0.05)';
      }}
    >
      <Icon style={{ 
        width: 'clamp(22px, 6vw, 28px)', 
        height: 'clamp(22px, 6vw, 28px)',
        flexShrink: 0
      }} />
      <span style={{
        lineHeight: 1.2,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {label}
      </span>
    </button>
  );
};

export default QuickActionTile;
