import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState('amount'); // amount, pin, processing, success, error
  const [formData, setFormData] = useState({
    amount: '',
    pin: '',
    walletType: 'millance_rewards_wallet'
  });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [hasPIN, setHasPIN] = useState(false);
  const [isSettingPIN, setIsSettingPIN] = useState(false);
  const [confirmPIN, setConfirmPIN] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setError('Please login to make payments');
      navigate('/login');
      return;
    }
    checkPINStatus();
  }, [isAuthenticated, user, navigate]);

  const checkPINStatus = async () => {
    try {
      const status = await api.getPINStatus();
      setHasPIN(status.has_pin);
    } catch (err) {
      console.error('Failed to check PIN status:', err);
      setHasPIN(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePINChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, pin: value }));
    setError('');
  };

  const handleConfirmPINChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setConfirmPIN(value);
    setError('');
  };

  const handleAmountNext = () => {
    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if user has PIN set
    if (hasPIN) {
      setIsSettingPIN(false);
    } else {
      setIsSettingPIN(true);
    }
    setStep('pin');
  };

  const handleSetPIN = async () => {
    if (!formData.pin || formData.pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    if (formData.pin !== confirmPIN) {
      setError('PINs do not match');
      return;
    }

    setStep('processing');

    try {
      // Set PIN for authenticated user
      await api.setPINAuthenticated(formData.pin);
      // After setting PIN, process payment
      processPayment();
    } catch (err) {
      setError(err.message || 'Failed to set PIN');
      setStep('pin');
    }
  };

  const handleVerifyPIN = async () => {
    if (!formData.pin || formData.pin.length !== 4) {
      setError('Please enter your 4-digit PIN');
      return;
    }

    setStep('processing');

    try {
      // Verify PIN for authenticated user
      await api.verifyPINAuthenticated(formData.pin);
      // PIN verified, process payment
      processPayment();
    } catch (err) {
      setError(err.message || 'Invalid PIN');
      setStep('pin');
    }
  };

  const processPayment = async () => {
    try {
      const response = await api.walletPaymentAuthenticated(
        formData.amount,
        formData.pin,
        formData.walletType
      );

      setResult(response);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  const handleDone = () => {
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    setStep('amount');
    setError('');
    setFormData({ ...formData, pin: '' });
    setConfirmPIN('');
  };

  const handleBack = () => {
    if (step === 'pin') {
      setStep('amount');
      setError('');
      setFormData({ ...formData, pin: '' });
      setConfirmPIN('');
    } else {
      navigate('/dashboard');
    }
  };

  if (step === 'processing') {
    return (
      <div className="payment-page">
        <div className="payment-container processing">
          <div className="processing-animation">
            <div className="spinner-large"></div>
          </div>
          <h2>Processing Payment...</h2>
          <p>Please wait while we process your transaction</p>
        </div>
      </div>
    );
  }

  if (step === 'success' && result) {
    return (
      <div className="payment-page">
        <div className="payment-container success">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Payment Successful!</h2>
          
          <div className="payment-details">
            <div className="detail-row">
              <span>Amount Paid</span>
              <strong className="amount-paid">₹{result.amount_paid?.toFixed(2)}</strong>
            </div>
            <div className="detail-row">
              <span>From Wallet</span>
              <strong>{formData.walletType === 'millance_rewards_wallet' ? 'Millance Rewards' : 'Savings'}</strong>
            </div>
            <div className="detail-row">
              <span>New Balance</span>
              <strong>₹{result.new_balance?.toFixed(2)}</strong>
            </div>
            <div className="detail-row">
              <span>Transaction ID</span>
              <strong className="transaction-id">#{result.transaction_id}</strong>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="payment-page">
        <div className="payment-container error">
          <div className="error-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Payment Failed</h2>
          <p className="error-message">{error}</p>
          
          <div className="error-actions">
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleTryAgain}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1>Store Payment</h1>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step === 'amount' ? 'active' : step === 'pin' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Amount</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step === 'pin' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>PIN</span>
          </div>
        </div>

        {/* User Info */}
        <div className="user-info-card">
          <div className="user-avatar">{user.full_name?.[0] || 'U'}</div>
          <div className="user-details">
            <h3>{user.full_name}</h3>
            <p>MLD ID: {user.mld_id}</p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {step === 'amount' ? (
          <div className="payment-form">
            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                className="input input-large"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                autoFocus
              />
            </div>

            <div className="input-group">
              <label>Select Wallet</label>
              <select
                name="walletType"
                className="input"
                value={formData.walletType}
                onChange={handleInputChange}
              >
                <option value="millance_rewards_wallet">Millance Rewards Wallet</option>
                <option value="savings_wallet">Savings Wallet</option>
              </select>
            </div>

            <button className="btn btn-primary btn-full" onClick={handleAmountNext}>
              Next
            </button>
          </div>
        ) : step === 'pin' ? (
          <div className="payment-form pin-form">
            {isSettingPIN ? (
              <>
                <div className="pin-header">
                  <div className="pin-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2>Set Your PIN</h2>
                  <p>Create a 4-digit PIN to secure your payments</p>
                </div>

                <div className="input-group">
                  <label>Enter New PIN</label>
                  <input
                    type="password"
                    className="input input-pin-large"
                    placeholder="••••"
                    value={formData.pin}
                    onChange={handlePINChange}
                    maxLength="4"
                    inputMode="numeric"
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <label>Confirm PIN</label>
                  <input
                    type="password"
                    className="input input-pin-large"
                    placeholder="••••"
                    value={confirmPIN}
                    onChange={handleConfirmPINChange}
                    maxLength="4"
                    inputMode="numeric"
                  />
                </div>

                <button className="btn btn-primary btn-full" onClick={handleSetPIN}>
                  Set PIN & Pay ₹{formData.amount || '0.00'}
                </button>
              </>
            ) : (
              <>
                <div className="pin-header">
                  <div className="pin-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2>Enter Your PIN</h2>
                  <p>Enter your 4-digit PIN to complete payment</p>
                </div>

                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Amount</span>
                    <strong>₹{formData.amount}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Wallet</span>
                    <strong>{formData.walletType === 'millance_rewards_wallet' ? 'Millance Rewards' : 'Savings'}</strong>
                  </div>
                </div>

                <div className="input-group">
                  <label>Enter PIN</label>
                  <input
                    type="password"
                    className="input input-pin-large"
                    placeholder="••••"
                    value={formData.pin}
                    onChange={handlePINChange}
                    maxLength="4"
                    inputMode="numeric"
                    autoFocus
                  />
                </div>

                <button className="btn btn-primary btn-full" onClick={handleVerifyPIN}>
                  Pay ₹{formData.amount || '0.00'}
                </button>
              </>
            )}
          </div>
        ) : null}

        <div className="payment-footer">
          <p>Secure payment powered by Millance Furniture</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
