import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  ArrowLeft, Wallet, CreditCard, CheckCircle, 
  AlertCircle, DollarSign, TrendingUp 
} from 'lucide-react';

const AddMoney = () => {
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
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick select amounts
  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleQuickSelect = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount < 1) {
      setError('Minimum amount is ₹1');
      return false;
    }
    
    if (numAmount > 10000) {
      setError('Maximum amount is ₹10,000');
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateAmount()) return;

    setLoading(true);
    setError('');

    try {
      const numAmount = parseFloat(amount);
      console.log('💰 Creating payment order for:', numAmount);

      // Create payment order
      const orderData = await api.createPaymentOrder(numAmount);
      console.log('✅ Order created:', orderData);

      if (!orderData.success || !orderData.payment_session_id) {
        throw new Error('Failed to create payment order');
      }

      // Store order ID in localStorage for callback verification
      localStorage.setItem('pending_payment_order', orderData.order_id);
      localStorage.setItem('pending_payment_amount', numAmount.toString());

      // Initialize Cashfree and redirect to payment page
      initiateCashfreePayment(orderData);

    } catch (err) {
      console.error('❌ Payment order error:', err);
      setError(err.message || 'Failed to create payment order');
      setLoading(false);
    }
  };

  const initiateCashfreePayment = (orderData) => {
    const { payment_session_id, order_id } = orderData;

    // Load Cashfree SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Cashfree SDK loaded');
      
      try {
        // Initialize Cashfree with proper configuration
        const cashfree = window.Cashfree({
          mode: 'production' // 'production' or 'sandbox'
        });

        // Redirect to Cashfree payment page
        const redirectUrl = `${window.location.origin}/payment-callback?order_id=${order_id}`;
        
        cashfree.checkout({
          paymentSessionId: payment_session_id,
          returnUrl: redirectUrl,
        }).then(() => {
          console.log('✅ Redirecting to Cashfree...');
        }).catch((error) => {
          console.error('❌ Cashfree checkout error:', error);
          setError('Payment gateway error. Please try again.');
          setLoading(false);
        });
      } catch (err) {
        console.error('❌ Cashfree initialization error:', err);
        setError('Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    };

    script.onerror = () => {
      setError('Failed to load payment gateway. Please try again.');
      setLoading(false);
    };

    document.body.appendChild(script);
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

      <div className="user-dashboard-compact">
        {/* Header */}
        <div className="user-welcome-compact">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </button>
            <div>
              <h1 className="user-welcome-title">Add Money</h1>
              <p className="user-welcome-subtitle">Recharge your wallet instantly</p>
            </div>
          </div>
          <div className="user-next-draw-badge">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Current Balance */}
        <div className="user-card-compact" style={{ 
          borderColor: '#34D399',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.05), rgba(16, 185, 129, 0.05))'
        }}>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#666', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Current Balance
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #34D399, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ₹ {(user?.millance_rewards_wallet || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="user-card-compact" style={{ borderColor: '#8B5CF6' }}>
          <div className="user-vault-section-header" style={{ marginBottom: '16px' }}>
            <DollarSign className="user-vault-section-icon" style={{ color: '#8B5CF6' }} />
            <h2 className="user-vault-section-title">Enter Amount</h2>
          </div>

          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
              fontWeight: '700',
              color: '#8B5CF6'
            }}>
              ₹
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="500"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 16px 16px 42px',
                border: `2px solid ${error ? '#EF4444' : '#8B5CF6'}`,
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                background: 'white',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Min: ₹1</span>
            <span>Max: ₹10,000</span>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Quick Select */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#666',
              marginBottom: '12px'
            }}>
              Quick Select
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '10px' 
            }}>
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickSelect(value)}
                  disabled={loading}
                  style={{
                    padding: '12px',
                    border: amount === value.toString() 
                      ? '2px solid #8B5CF6' 
                      : '2px solid #E5E7EB',
                    background: amount === value.toString()
                      ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))'
                      : 'white',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: amount === value.toString() ? '#8B5CF6' : '#666',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading && amount !== value.toString()) {
                      e.currentTarget.style.borderColor = '#8B5CF6';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (amount !== value.toString()) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  ₹{value.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Credits Display */}
          {amount && !error && (
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    You will receive
                  </div>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {parseFloat(amount).toLocaleString('en-IN')} Credits
                  </div>
                </div>
                <TrendingUp style={{ color: '#34D399' }} className="w-8 h-8" />
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                1 INR = 1 Millance Credit
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={!amount || loading || !!error}
            style={{
              width: '100%',
              padding: '16px',
              background: (!amount || loading || error)
                ? '#E5E7EB'
                : 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              color: (!amount || loading || error) ? '#999' : 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: (!amount || loading || error) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: (!amount || loading || error) 
                ? 'none' 
                : '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading && amount && !error) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && amount && !error) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </>
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="user-card-compact" style={{ 
          borderColor: '#60A5FA',
          background: 'rgba(96, 165, 250, 0.05)'
        }}>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px',
              fontWeight: '600',
              color: '#60A5FA'
            }}>
              <CheckCircle className="w-4 h-4" />
              Safe & Secure Payment
            </div>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <li>Powered by Cashfree Payment Gateway</li>
              <li>Instant credit after successful payment</li>
              <li>Multiple payment options: UPI, Cards, Net Banking</li>
              <li>Secure encrypted transactions</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AddMoney;
