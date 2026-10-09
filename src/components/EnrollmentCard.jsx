import { Trophy, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, Gift } from 'lucide-react';

const EnrollmentCard = ({ 
  enrollment, 
  plan, 
  nextDraw,
  onPayMonth,
  onAddMoney,
  walletBalance 
}) => {
  if (!enrollment || !plan) return null;

  const nextMonth = enrollment.months_paid + 1;
  const monthlyAmount = plan.monthly_amount;
  const hasInsufficientBalance = walletBalance < monthlyAmount;
  const isCompleted = enrollment.months_paid >= 11;
  const hasWonPrize = enrollment.has_won_prize;
  const isActive = enrollment.status === 'active';

  // Determine card status
  const getStatusConfig = () => {
    if (hasWonPrize) {
      return {
        color: '#FBBF24',
        bgColor: 'rgba(251, 191, 36, 0.1)',
        borderColor: '#FBBF24',
        label: '🎉 WON PRIZE!',
        icon: Trophy
      };
    }
    if (isCompleted) {
      return {
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10B981',
        label: '✅ COMPLETED',
        icon: CheckCircle
      };
    }
    if (isActive) {
      return {
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        label: 'ACTIVE',
        icon: CheckCircle
      };
    }
    return {
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#EF4444',
      label: 'PAYMENT PENDING',
      icon: AlertCircle
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: `2px solid ${statusConfig.borderColor}`,
      height: '100%'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h3 style={{ 
              fontSize: '17px', 
              fontWeight: '700', 
              margin: 0,
              color: '#1a1a1a'
            }}>
              Group {enrollment.group_id}
            </h3>
            <div style={{
              padding: '2px 8px',
              background: statusConfig.bgColor,
              color: statusConfig.color,
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <StatusIcon style={{ width: '10px', height: '10px' }} />
              {statusConfig.label}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
            {plan.name}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            ₹{monthlyAmount.toLocaleString()}/month × {plan.duration_months || 11} months
          </div>
        </div>
      </div>

      {/* Prize Won Display */}
      {hasWonPrize && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '2px solid #FBBF24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy style={{ width: '28px', height: '28px', color: '#FBBF24' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                Congratulations! 🎉
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>
                Prize: {enrollment.prize_name || 'N/A'}
              </div>
              <div style={{ fontSize: '13px', color: '#F59E0B', fontWeight: '600' }}>
                Won in Month {enrollment.prize_won_month} • ₹{(enrollment.prize_amount || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center'
          }}>
            🏪 Visit Millance Store to collect your prize!
          </div>
        </div>
      )}

      {/* Progress Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Months Paid */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05))',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
            Months Paid
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#8B5CF6' }}>
            {enrollment.months_paid}/{plan.duration_months || 11}
          </div>
        </div>

        {/* Savings Earned */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))',
          borderRadius: '10px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
            Savings Earned
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#10B981' }}>
            ₹{(enrollment.savings_accumulated || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Next Draw Info */}
      {nextDraw && isActive && !hasWonPrize && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          background: 'rgba(59, 130, 246, 0.05)',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <Calendar style={{ width: '16px', height: '16px', color: '#3B82F6' }} />
          <div style={{ fontSize: '12px', color: '#666' }}>
            Next Draw: {new Date(nextDraw.draw_date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })} at {nextDraw.draw_time}
          </div>
        </div>
      )}

      {/* Payment Button - Show only if active and not won */}
      {isActive && !hasWonPrize && !isCompleted && (
        <>
          {hasInsufficientBalance ? (
            <button
              onClick={onAddMoney}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              Add Money to Wallet
            </button>
          ) : (
            <button
              onClick={() => onPayMonth(enrollment)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
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
              <CreditCard style={{ width: '18px', height: '18px' }} />
              Pay Month {nextMonth} - ₹{monthlyAmount.toLocaleString()}
            </button>
          )}
        </>
      )}

      {/* No Payment Needed Message */}
      {hasWonPrize && (
        <div style={{
          padding: '12px',
          background: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#F59E0B',
          fontWeight: '600'
        }}>
          ✅ No more payments required! You won the prize!
        </div>
      )}

      {/* Completed Message */}
      {isCompleted && !hasWonPrize && (
        <div style={{
          padding: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#10B981',
          fontWeight: '600'
        }}>
          🎊 All 11 months completed! Plan finished successfully!
        </div>
      )}
    </div>
  );
};

export default EnrollmentCard;
