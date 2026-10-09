import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Gem, TrendingUp, Info } from 'lucide-react';

const SavingsWallet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savingsData, setSavingsData] = useState({
    balance: 0,
    total_saved: 0,
    this_month: 0,
    entries_count: 0
  });
  const [savingsHistory, setSavingsHistory] = useState([]);
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
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      const wallet = await api.getWallet();
      setSavingsData({
        balance: wallet.savings_wallet || 0,
        total_saved: wallet.total_savings || 0,
        this_month: wallet.this_month_savings || 0,
        entries_count: wallet.savings_entries_count || 0
      });

      const txns = await api.getTransactions();
      
      // Filter only savings-related transactions
      const savingsTransactions = Array.isArray(txns) 
        ? txns.filter(t => 
            t.description?.toLowerCase().includes('savings') ||
            t.transaction_type === 'savings_credit'
          ).slice(0, 10)
        : [];
      
      setSavingsHistory(savingsTransactions);
    } catch (error) {
      console.error('Failed to fetch savings data:', error);
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
          Savings Wallet
        </h1>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
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
          <Gem style={{ 
            width: 'clamp(28px, 7vw, 36px)', 
            height: 'clamp(28px, 7vw, 36px)' 
          }} />
          <span style={{
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontWeight: '500',
            opacity: 0.95
          }}>
            Current Savings
          </span>
        </div>
        <div style={{
          fontSize: 'clamp(36px, 9vw, 48px)',
          fontWeight: '700',
          marginBottom: 'clamp(8px, 2vw, 12px)',
          letterSpacing: '-0.5px'
        }}>
          ₹{savingsData.balance.toFixed(2)}
        </div>
        <div style={{
          fontSize: 'clamp(13px, 3.5vw, 15px)',
          opacity: 0.9
        }}>
          From {savingsData.entries_count} monthly payment{savingsData.entries_count !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Info Card */}
      <div style={{
        background: '#EFF6FF',
        borderRadius: 'clamp(10px, 2.5vw, 12px)',
        padding: 'clamp(14px, 3.5vw, 16px)',
        display: 'flex',
        gap: 'clamp(10px, 2.5vw, 12px)',
        marginBottom: 'clamp(20px, 5vw, 24px)',
        border: '1px solid #DBEAFE'
      }}>
        <Info style={{ 
          width: '20px', 
          height: '20px', 
          color: '#3B82F6',
          flexShrink: 0,
          marginTop: '2px'
        }} />
        <div style={{
          fontSize: 'clamp(13px, 3.5vw, 14px)',
          color: '#1E40AF',
          lineHeight: 1.5
        }}>
          Your savings accumulate with each monthly payment and can be redeemed at any Millance store.
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'clamp(12px, 3vw, 16px)',
        marginBottom: 'clamp(20px, 5vw, 24px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'clamp(10px, 2.5vw, 12px)',
          padding: 'clamp(14px, 3.5vw, 18px)',
          border: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'clamp(11px, 3vw, 12px)',
            color: '#666',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Total Saved
          </div>
          <div style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: '700',
            color: '#8B5CF6'
          }}>
            ₹{savingsData.total_saved.toFixed(0)}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 'clamp(10px, 2.5vw, 12px)',
          padding: 'clamp(14px, 3.5vw, 18px)',
          border: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'clamp(11px, 3vw, 12px)',
            color: '#666',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            This Month
          </div>
          <div style={{
            fontSize: 'clamp(20px, 5vw, 24px)',
            fontWeight: '700',
            color: '#10B981'
          }}>
            ₹{savingsData.this_month.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Savings History */}
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
          Savings History
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            Loading...
          </div>
        ) : savingsHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No savings yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {savingsHistory.map((transaction, index) => (
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
                  background: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <TrendingUp style={{ width: '20px', height: '20px', color: '#8B5CF6' }} />
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
                    {transaction.description || 'Savings credit'}
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
                  color: '#8B5CF6',
                  flexShrink: 0
                }}>
                  +₹{Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsWallet;
