import { X, Wallet, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

const PayMonthModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  enrollment, 
  plan, 
  walletBalance,
  loading = false 
}) => {
  if (!isOpen || !enrollment || !plan) return null;

  const nextMonth = enrollment.months_paid + 1;
  const monthlyAmount = plan.monthly_amount;
  const balanceAfter = walletBalance - monthlyAmount;
  const savingsAfter = (enrollment.savings_accumulated || 0) + monthlyAmount;
  const hasInsufficientBalance = walletBalance < monthlyAmount;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 'clamp(12px, 3vw, 20px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: 'clamp(16px, 4vw, 20px)',
          padding: 'clamp(20px, 5vw, 32px) clamp(16px, 4vw, 24px)',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'clamp(16px, 4vw, 24px)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(18px, 5vw, 22px)', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Pay Month {nextMonth}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '8px',
              padding: 'clamp(6px, 1.5vw, 8px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px'
            }}
          >
            <X style={{ width: 'clamp(18px, 4vw, 20px)', height: 'clamp(18px, 4vw, 20px)', color: '#666' }} />
          </button>
        </div>

        {/* Plan Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
          borderRadius: 'clamp(10px, 2.5vw, 12px)',
          padding: 'clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(16px, 4vw, 20px)'
        }}>
          <div style={{ fontSize: 'clamp(12px, 3.2vw, 13px)', color: '#666', marginBottom: '4px', wordBreak: 'break-word' }}>
            {plan.name}
          </div>
          <div style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: '#1a1a1a', fontWeight: '600' }}>
            Group {enrollment.group_id}
          </div>
        </div>

        {/* Payment Details */}
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(12px, 3vw, 16px)',
            background: '#F9FAFB',
            borderRadius: 'clamp(10px, 2.5vw, 12px)',
            marginBottom: 'clamp(10px, 2.5vw, 12px)',
            gap: '12px'
          }}>
            <span style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: '#666', fontWeight: '500' }}>
              Payment Amount
            </span>
            <span style={{ fontSize: 'clamp(18px, 5vw, 20px)', fontWeight: '700', color: '#1a1a1a' }}>
              ₹{monthlyAmount.toLocaleString()}
            </span>
          </div>

          {/* Wallet Deduction */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 2.5vw, 12px)',
            padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(239, 68, 68, 0.05)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            marginBottom: 'clamp(6px, 1.5vw, 8px)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: 'clamp(6px, 1.5vw, 8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingDown style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)', color: '#EF4444' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#666', marginBottom: '2px' }}>
                From Millance Wallet
              </div>
              <div style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: '#EF4444', fontWeight: '600' }}>
                -₹{monthlyAmount.toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: 'clamp(12px, 3.2vw, 13px)', color: '#999', flexShrink: 0 }}>
              → ₹{balanceAfter.toLocaleString()}
            </div>
          </div>

          {/* Savings Credit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 2.5vw, 12px)',
            padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(16, 185, 129, 0.05)',
            borderRadius: 'clamp(8px, 2vw, 10px)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: 'clamp(6px, 1.5vw, 8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingUp style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)', color: '#10B981' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#666', marginBottom: '2px' }}>
                To Savings Wallet
              </div>
              <div style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: '#10B981', fontWeight: '600' }}>
                +₹{monthlyAmount.toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: 'clamp(12px, 3.2vw, 13px)', color: '#999', flexShrink: 0 }}>
              → ₹{savingsAfter.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Warning for insufficient balance */}
        {hasInsufficientBalance && (
          <div style={{
            display: 'flex',
            gap: 'clamp(10px, 2.5vw, 12px)',
            padding: 'clamp(10px, 2.5vw, 12px)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            marginBottom: 'clamp(16px, 4vw, 20px)'
          }}>
            <AlertCircle style={{ width: 'clamp(18px, 4vw, 20px)', height: 'clamp(18px, 4vw, 20px)', color: '#EF4444', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'clamp(12px, 3.2vw, 13px)', fontWeight: '600', color: '#EF4444', marginBottom: '4px' }}>
                Insufficient Balance
              </div>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#666', wordBreak: 'break-word' }}>
                You need ₹{(monthlyAmount - walletBalance).toLocaleString()} more in your Millance Wallet.
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: 'clamp(8px, 2vw, 10px)',
          padding: 'clamp(10px, 2.5vw, 12px)',
          marginBottom: 'clamp(20px, 5vw, 24px)'
        }}>
          <div style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#3B82F6', fontWeight: '600', marginBottom: '6px' }}>
            ✨ Benefits:
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#666', lineHeight: '1.6' }}>
            <li>Eligible for Month {nextMonth} draw</li>
            <li>₹{monthlyAmount.toLocaleString()} added to Savings Wallet</li>
            <li>Progress: {nextMonth}/11 months</li>
          </ul>
        </div>

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(10px, 2.5vw, 12px)',
          width: '100%'
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: 'clamp(12px, 3vw, 14px)',
              background: '#F3F4F6',
              color: '#666',
              border: 'none',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              fontSize: 'clamp(14px, 3.8vw, 15px)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              minHeight: '48px',
              whiteSpace: 'nowrap'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || hasInsufficientBalance}
            style={{
              flex: 1,
              padding: 'clamp(12px, 3vw, 14px)',
              background: hasInsufficientBalance 
                ? '#E5E7EB' 
                : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              color: hasInsufficientBalance ? '#999' : 'white',
              border: 'none',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              fontSize: 'clamp(14px, 3.8vw, 15px)',
              fontWeight: '600',
              cursor: (loading || hasInsufficientBalance) ? 'not-allowed' : 'pointer',
              boxShadow: hasInsufficientBalance ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)',
              opacity: loading ? 0.7 : 1,
              minHeight: '48px',
              wordBreak: 'break-word',
              lineHeight: '1.2'
            }}
          >
            {loading ? 'Processing...' : hasInsufficientBalance ? 'Insufficient Funds' : 'Confirm Payment'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PayMonthModal;
