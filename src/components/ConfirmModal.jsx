import { CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import '../styles/ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', // 'confirm', 'success', 'error', 'loading'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && type !== 'loading') {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="confirm-modal-icon success" />;
      case 'error':
        return <AlertCircle className="confirm-modal-icon error" />;
      case 'loading':
        return <Loader className="confirm-modal-icon loading" />;
      default:
        return <AlertCircle className="confirm-modal-icon confirm" />;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 20px)'
    }}>
      <div className="confirm-modal-container" style={{
        maxWidth: '420px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {type !== 'loading' && (
          <button 
            className="confirm-modal-close" 
            onClick={onClose}
            aria-label="Close"
            style={{
              minWidth: '36px',
              minHeight: '36px'
            }}
          >
            <X size={20} />
          </button>
        )}
        
        <div className="confirm-modal-content">
          <div className="confirm-modal-icon-wrapper">
            {getIcon()}
          </div>
          
          <h2 className="confirm-modal-title" style={{
            fontSize: 'clamp(20px, 5.5vw, 24px)',
            wordBreak: 'break-word'
          }}>{title}</h2>
          <p className="confirm-modal-message" style={{
            fontSize: 'clamp(14px, 3.8vw, 15px)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line'
          }}>{message}</p>
          
          <div className="confirm-modal-actions">
            {type === 'confirm' && (
              <>
                {showCancel && (
                  <button 
                    className="confirm-modal-btn cancel" 
                    onClick={onClose}
                    style={{
                      minHeight: '48px',
                      fontSize: 'clamp(14px, 3.8vw, 15px)'
                    }}
                  >
                    {cancelText}
                  </button>
                )}
                <button 
                  className="confirm-modal-btn confirm" 
                  onClick={onConfirm}
                  style={{
                    minHeight: '48px',
                    fontSize: 'clamp(14px, 3.8vw, 15px)'
                  }}
                >
                  {confirmText}
                </button>
              </>
            )}
            
            {type === 'success' && (
              <button 
                className="confirm-modal-btn confirm" 
                onClick={onClose}
                style={{
                  minHeight: '48px',
                  fontSize: 'clamp(14px, 3.8vw, 15px)'
                }}
              >
                OK
              </button>
            )}
            
            {type === 'error' && (
              <button 
                className="confirm-modal-btn error" 
                onClick={onClose}
                style={{
                  minHeight: '48px',
                  fontSize: 'clamp(14px, 3.8vw, 15px)'
                }}
              >
                Close
              </button>
            )}
            
            {type === 'loading' && (
              <div className="confirm-modal-loading-text">
                Please wait...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
