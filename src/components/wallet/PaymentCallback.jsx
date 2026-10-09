import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  CheckCircle, XCircle, Loader, Wallet, 
  ArrowRight, RotateCcw, Home 
} from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      setStatus('failed');
      setError('Order ID not found');
      return;
    }

    try {
      console.log('🔍 Verifying payment for order:', orderId);

      // Call backend to verify payment
      const result = await api.verifyPayment(orderId);
      console.log('✅ Verification result:', result);

      if (result.success && result.wallet_credited) {
        // Payment successful and wallet credited
        setStatus('success');
        setPaymentData({
          amount: result.amount,
          newBalance: result.new_balance,
          transactionId: result.transaction_id,
          orderId: orderId
        });

        // Refresh user data to update wallet balance
        await refreshUser();

        // Clear pending payment from localStorage
        localStorage.removeItem('pending_payment_order');
        localStorage.removeItem('pending_payment_amount');

      } else {
        // Payment failed or not completed
        setStatus('failed');
        setError(result.error || 'Payment verification failed');
      }

    } catch (err) {
      console.error('❌ Payment verification error:', err);
      setStatus('failed');
      setError(err.message || 'Failed to verify payment');
    }
  };

  const renderProcessing = () => (
    <div className="user-card-compact" style={{ 
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 24px',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: '4px solid rgba(139, 92, 246, 0.2)',
          borderTop: '4px solid #8B5CF6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>

      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Processing Payment...
      </h2>

      <p style={{
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.6'
      }}>
        Please wait while we verify your payment.<br />
        This will only take a moment.
      </p>
    </div>
  );

  const renderSuccess = () => (
    <>
      {/* Success Animation */}
      <div className="user-card-compact" style={{ 
        textAlign: 'center',
        padding: '40px 20px',
        borderColor: '#10B981',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05))'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #10B981, #34D399)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <CheckCircle style={{ color: 'white' }} className="w-12 h-12" />
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #10B981, #34D399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Payment Successful! 🎉
        </h2>

        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '32px'
        }}>
          Your wallet has been credited successfully
        </p>

        {/* Payment Details */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Amount Paid</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#10B981' }}>
              ₹{paymentData?.amount?.toFixed(2)}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Credits Added</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6' }}>
              {paymentData?.amount?.toFixed(2)}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>New Balance</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
              ₹{paymentData?.newBalance?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Transaction ID */}
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginBottom: '24px'
        }}>
          Transaction ID: {paymentData?.transactionId || paymentData?.orderId}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#8B5CF6';
              e.currentTarget.style.color = '#8B5CF6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#666';
            }}
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate('/add-money')}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
            }}
          >
            Add More
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  const renderFailed = () => (
    <div className="user-card-compact" style={{ 
      textAlign: 'center',
      padding: '40px 20px',
      borderColor: '#EF4444',
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(248, 113, 113, 0.05))'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        margin: '0 auto 24px',
        background: 'linear-gradient(135deg, #EF4444, #F87171)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <XCircle style={{ color: 'white' }} className="w-12 h-12" />
      </div>

      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#EF4444'
      }}>
        Payment Failed
      </h2>

      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px'
      }}>
        {error || 'Payment was not completed'}
      </p>

      <p style={{
        fontSize: '13px',
        color: '#999',
        marginBottom: '32px',
        lineHeight: '1.5'
      }}>
        Your money is safe.<br />
        No amount was deducted from your account.
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            flex: 1,
            padding: '14px',
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#8B5CF6';
            e.currentTarget.style.color = '#8B5CF6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.color = '#666';
          }}
        >
          <Home className="w-5 h-5" />
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate('/add-money')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Bubble Background */}
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      <div className="user-dashboard-compact">
        {/* Header */}
        <div className="user-welcome-compact">
          <div>
            <h1 className="user-welcome-title">Payment Status</h1>
            <p className="user-welcome-subtitle">
              {status === 'processing' && 'Verifying your payment...'}
              {status === 'success' && 'Payment completed successfully'}
              {status === 'failed' && 'Payment was not completed'}
            </p>
          </div>
          <div className="user-next-draw-badge">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Status Display */}
        {status === 'processing' && renderProcessing()}
        {status === 'success' && renderSuccess()}
        {status === 'failed' && renderFailed()}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scaleIn {
          0% { 
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default PaymentCallback;
