import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Wallet, Plus, TrendingUp, TrendingDown } from 'lucide-react';

const MillanceWallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch wallet transactions
      const txns = await api.getTransactions();
      
      // Fetch Cashfree payment history
      const payments = await api.getPaymentHistory();
      
      // Combine wallet recharges and payments
      const combined = [];
      
      // Add wallet recharges from Cashfree
      if (payments.payments) {
        payments.payments.forEach(payment => {
          if (payment.is_credited) {
            combined.push({
              type: 'credit',
              amount: payment.amount,
              description: 'Wallet Recharge',
              created_at: payment.created_at
            });
          }
        });
      }
      
      // Add regular transactions (debit/credit)
      if (Array.isArray(txns)) {
        txns.forEach(txn => {
          combined.push({
            type: txn.transaction_type,
            amount: txn.amount,
            description: txn.description,
            created_at: txn.created_at
          });
        });
      }
      
      // Sort by date (newest first)
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Take only first 10
      setTransactions(combined.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

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
          Millance Wallet
        </h1>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
        borderRadius: 'clamp(14px, 3.5vw, 18px)',
        padding: 'clamp(24px, 6vw, 32px)',
        color: 'white',
        boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
        marginBottom: 'clamp(20px, 5vw, 24px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: 'clamp(16px, 4vw, 20px)'
        }}>
          <Wallet style={{ 
            width: 'clamp(28px, 7vw, 36px)', 
            height: 'clamp(28px, 7vw, 36px)' 
          }} />
          <span style={{
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontWeight: '500',
            opacity: 0.95
          }}>
            Available Balance
          </span>
        </div>
        <div style={{
          fontSize: 'clamp(36px, 9vw, 48px)',
          fontWeight: '700',
          marginBottom: 'clamp(8px, 2vw, 12px)',
          letterSpacing: '-0.5px'
        }}>
          ₹{(user?.millance_rewards_wallet || 0).toFixed(2)}
        </div>
        <div style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          opacity: 0.9
        }}>
          Use this balance to pay for monthly plans
        </div>
      </div>

      {/* Top Up Button */}
      <button
        onClick={() => navigate('/add-money')}
        style={{
          width: '100%',
          padding: 'clamp(14px, 4vw, 18px)',
          background: 'white',
          border: '2px solid #EC4899',
          borderRadius: 'clamp(10px, 2.5vw, 14px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: 'clamp(15px, 4vw, 17px)',
          fontWeight: '600',
          color: '#EC4899',
          marginBottom: 'clamp(24px, 6vw, 32px)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#EC4899';
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.color = '#EC4899';
        }}
      >
        <Plus style={{ width: '20px', height: '20px' }} />
        Top Up Wallet
      </button>

      {/* Recent Transactions */}
      <div style={{
        background: 'white',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(16px, 4vw, 20px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E5E7EB'
      }}>
        <h3 style={{
          fontSize: 'clamp(16px, 4.2vw, 18px)',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: 'clamp(16px, 4vw, 20px)'
        }}>
          Recent Transactions
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Loading...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No transactions yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((transaction, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 3vw, 16px)',
                  padding: 'clamp(12px, 3vw, 14px)',
                  background: '#F9FAFB',
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: transaction.type === 'credit' ? '#DCFCE7' : '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {transaction.type === 'credit' ? (
                    <TrendingUp style={{ width: '20px', height: '20px', color: '#16A34A' }} />
                  ) : (
                    <TrendingDown style={{ width: '20px', height: '20px', color: '#DC2626' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    fontWeight: '500',
                    color: '#1a1a1a',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {transaction.description || 'Transaction'}
                  </div>
                  <div style={{
                    fontSize: 'clamp(11px, 3vw, 12px)',
                    color: '#999'
                  }}>
                    {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  fontWeight: '600',
                  color: transaction.type === 'credit' ? '#16A34A' : '#DC2626',
                  flexShrink: 0
                }}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/transaction-history')}
          style={{
            width: '100%',
            marginTop: 'clamp(16px, 4vw, 20px)',
            padding: '12px',
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: 'clamp(13px, 3.5vw, 14px)',
            fontWeight: '500',
            color: '#666'
          }}
        >
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default MillanceWallet;
