import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, Wallet, TrendingUp, TrendingDown, 
  CreditCard, Calendar, Filter, Download 
} from 'lucide-react';

const TransactionHistory = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recharges, plans

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      // Fetch wallet transactions
      const txns = await api.getTransactions();
      setTransactions(Array.isArray(txns) ? txns : []);

      // Fetch Cashfree payment history
      const payments = await api.getPaymentHistory();
      setPaymentHistory(payments.payments || []);

    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine and sort all transactions
  const getAllTransactions = () => {
    const combined = [];

    // Add wallet recharges from Cashfree
    paymentHistory.forEach(payment => {
      if (payment.is_credited) {
        combined.push({
          type: 'wallet_recharge',
          amount: payment.amount,
          date: new Date(payment.created_at),
          description: 'Wallet Recharge',
          transactionId: payment.order_id,
          status: 'success'
        });
      }
    });

    // Add regular transactions
    transactions.forEach(txn => {
      combined.push({
        type: txn.transaction_type,
        amount: txn.amount,
        date: new Date(txn.created_at),
        description: txn.description,
        transactionId: txn.id,
        status: 'completed'
      });
    });

    // Sort by date (newest first)
    combined.sort((a, b) => b.date - a.date);

    // Apply filter
    if (filter === 'recharges') {
      return combined.filter(t => t.type === 'wallet_recharge');
    } else if (filter === 'plans') {
      return combined.filter(t => t.type === 'payment' || t.type === 'plan_payment');
    }

    return combined;
  };

  const getTransactionIcon = (type) => {
    if (type === 'wallet_recharge' || type === 'deposit') {
      return <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />;
    }
    return <TrendingDown className="w-5 h-5" style={{ color: '#F59E0B' }} />;
  };

  const getTransactionColor = (type) => {
    if (type === 'wallet_recharge' || type === 'deposit') {
      return '#10B981';
    }
    return '#F59E0B';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const allTransactions = getAllTransactions();

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
              <h1 className="user-welcome-title">Transaction History</h1>
              <p className="user-welcome-subtitle">{allTransactions.length} transactions</p>
            </div>
          </div>
          <div className="user-next-draw-badge">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="user-card-compact" style={{ borderColor: '#8B5CF6' }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            padding: '4px',
            background: '#F9FAFB',
            borderRadius: '10px'
          }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                flex: 1,
                padding: '10px',
                background: filter === 'all' 
                  ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' 
                  : 'transparent',
                color: filter === 'all' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('recharges')}
              style={{
                flex: 1,
                padding: '10px',
                background: filter === 'recharges' 
                  ? 'linear-gradient(135deg, #10B981, #34D399)' 
                  : 'transparent',
                color: filter === 'recharges' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Recharges
            </button>
            <button
              onClick={() => setFilter('plans')}
              style={{
                flex: 1,
                padding: '10px',
                background: filter === 'plans' 
                  ? 'linear-gradient(135deg, #F59E0B, #FBBF24)' 
                  : 'transparent',
                color: filter === 'plans' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Plans
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="user-card-compact" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto',
              border: '4px solid rgba(139, 92, 246, 0.2)',
              borderTop: '4px solid #8B5CF6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '16px', color: '#666' }}>Loading transactions...</p>
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="user-card-compact" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Wallet style={{ color: '#D1D5DB', margin: '0 auto 16px' }} className="w-12 h-12" />
            <p style={{ color: '#666', fontSize: '14px' }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allTransactions.map((txn, index) => (
              <div 
                key={index}
                className="user-card-compact" 
                style={{ 
                  borderColor: getTransactionColor(txn.type),
                  borderLeft: `4px solid ${getTransactionColor(txn.type)}`
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${getTransactionColor(txn.type)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getTransactionIcon(txn.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      color: '#1a1a1a',
                      marginBottom: '4px'
                    }}>
                      {txn.description}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Calendar className="w-3 h-3" />
                      {formatDate(txn.date)}
                    </div>
                    {txn.transactionId && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#D1D5DB',
                        marginTop: '4px',
                        fontFamily: 'monospace'
                      }}>
                        ID: {typeof txn.transactionId === 'string' 
                          ? txn.transactionId.substring(0, 16) + '...' 
                          : txn.transactionId}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: getTransactionColor(txn.type)
                    }}>
                      {txn.type === 'wallet_recharge' || txn.type === 'deposit' ? '+' : '-'}
                      ₹{Math.abs(txn.amount).toFixed(2)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: txn.status === 'success' ? '#10B981' : '#F59E0B',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginTop: '4px'
                    }}>
                      {txn.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default TransactionHistory;
