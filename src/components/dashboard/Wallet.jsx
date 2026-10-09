import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Vault, Gift, CheckCircle, TrendingUp, Wallet as WalletIcon, 
  ArrowUpCircle, ArrowDownCircle, Send, History,
  Plus, Minus, ChevronRight, Calendar, CreditCard
} from 'lucide-react';

const Wallet = () => {
  const { user } = useAuth();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [wallet, setWallet] = useState(null);
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
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletData, transactionsData] = await Promise.all([
        api.getWallet(),
        api.getTransactions()
      ]);
      setWallet(walletData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from transactions
  const totalCredits = transactions
    .filter(t => t.transaction_type === 'credit' || t.transaction_type === 'deposit' || t.transaction_type === 'winning')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  
  const totalDebits = transactions
    .filter(t => t.transaction_type === 'debit' || t.transaction_type === 'withdrawal' || t.transaction_type === 'payment')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const pendingAmount = 0; // Transactions in DB are completed, no pending status

  // Summary Data from backend
  const vaultSummary = {
    totalRewards: wallet?.millance_rewards_wallet || 0,
    availableRewards: wallet?.millance_rewards_wallet || 0,
    redeemedRewards: totalDebits,
    pendingRewards: pendingAmount
  };

  // Savings Wallet from backend
  const savingsTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes('savings') || 
    t.transaction_type === 'savings'
  );
  
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  
  const thisMonthSavings = savingsTransactions
    .filter(t => new Date(t.created_at) >= thisMonthStart)
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const savingsWallet = {
    currentSavings: wallet?.savings_wallet || 0,
    totalSaved: wallet?.savings_wallet || 0,
    thisMonth: thisMonthSavings,
    savingsEntries: savingsTransactions.length,
    targetSavings: 50000
  };

  // Millance Wallet from backend
  const millanceWallet = {
    availableBalance: wallet?.millance_rewards_wallet || 0,
    totalCredits: totalCredits,
    totalDebits: totalDebits,
    pending: pendingAmount
  };

  // Backend transactions data
  const allTransactions = transactions.map(t => ({
    id: t.id,
    date: t.created_at,
    type: t.transaction_type === 'credit' || t.transaction_type === 'deposit' || t.transaction_type === 'winning' ? 'Credit' : 'Debit',
    description: t.description || 'Transaction',
    amount: (t.transaction_type === 'credit' || t.transaction_type === 'deposit' || t.transaction_type === 'winning') ? parseFloat(t.amount) : -parseFloat(t.amount),
    status: 'Completed' // All transactions in DB are completed
  }));

  const savingsHistory = transactions
    .filter(t => 
      t.wallet === 'savings_wallet' || 
      t.description?.toLowerCase().includes('savings') || 
      t.transaction_type === 'savings'
    )
    .map(t => ({
      id: t.id,
      date: t.created_at,
      description: t.description || 'Savings',
      amount: parseFloat(t.amount),
      status: 'Completed'
    }));

  // Filter transactions
  const filteredTransactions = allTransactions.filter(t => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'credits') return t.type === 'Credit';
    if (transactionFilter === 'debits') return t.type === 'Debit';
    if (transactionFilter === 'pending') return t.status === 'Pending';
    return true;
  });

  const recentTransactions = showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 5);
  const savingsProgress = (savingsWallet.currentSavings / savingsWallet.targetSavings) * 100;

  if (loading) {
    return (
      <div className="user-dashboard-compact">
        <div className="loading-container" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading wallet...</p>
        </div>
      </div>
    );
  }

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
        {/* Page Header */}
        <div className="user-welcome-compact">
          <div>
            <h1 className="user-welcome-title">Vault</h1>
            <p className="user-welcome-subtitle">Your rewards, savings and wallet activity</p>
          </div>
          <div className="user-next-draw-badge">
            <Vault className="w-5 h-5" />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="user-vault-summary-grid">
          <div className="user-vault-summary-card">
            <Vault className="user-vault-summary-icon text-pink-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">₹{vaultSummary.totalRewards.toLocaleString()}</span>
              <span className="user-vault-summary-label">Total Rewards</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <Gift className="user-vault-summary-icon text-green-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">₹{vaultSummary.availableRewards.toLocaleString()}</span>
              <span className="user-vault-summary-label">Available</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <CheckCircle className="user-vault-summary-icon text-blue-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">₹{vaultSummary.redeemedRewards.toLocaleString()}</span>
              <span className="user-vault-summary-label">Redeemed</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <TrendingUp className="user-vault-summary-icon text-orange-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">₹{vaultSummary.pendingRewards.toLocaleString()}</span>
              <span className="user-vault-summary-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Savings + Millance Wallet */}
        <div className="user-vault-two-col">
          {/* Savings Wallet - Simple Card */}
          <div className="user-card-compact user-savings-wallet-card">
            <div className="user-vault-section-header">
              <WalletIcon className="user-vault-section-icon" style={{ color: '#10B981' }} />
              <h2 className="user-vault-section-title">Savings Wallet</h2>
            </div>

            {/* Large Balance Display */}
            <div style={{
              textAlign: 'center',
              padding: '24px 16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                Total Savings Accumulated
              </div>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: '700',
                color: '#10B981',
                marginBottom: '8px'
              }}>
                ₹{savingsWallet.currentSavings.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                From {savingsWallet.savingsEntries} monthly payments
              </div>
            </div>

            {/* This Month Savings */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '10px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  This Month
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#10B981' }}>
                  +₹{savingsWallet.thisMonth.toLocaleString()}
                </div>
              </div>
              <TrendingUp style={{ width: '24px', height: '24px', color: '#10B981' }} />
            </div>

            {/* Info Text */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              💡 Savings accumulate from every monthly payment. Redeem at any Millance store!
            </div>
          </div>

          {/* Millance Wallet */}
          <div className="user-card-compact user-millance-wallet-card">
            <div className="user-vault-section-header">
              <CreditCard className="user-vault-section-icon" />
              <h2 className="user-vault-section-title">Millance Wallet</h2>
            </div>

            <div className="user-wallet-balance-card">
              <span className="user-wallet-balance-label">Available Balance</span>
              <span className="user-wallet-balance-value">₹{millanceWallet.availableBalance.toLocaleString()}</span>
            </div>

            <div className="user-wallet-stats-grid">
              <div className="user-wallet-stat-item">
                <ArrowUpCircle className="user-wallet-stat-icon text-green-500" />
                <div>
                  <span className="user-wallet-stat-label">Total Credits</span>
                  <span className="user-wallet-stat-value">₹{millanceWallet.totalCredits.toLocaleString()}</span>
                </div>
              </div>

              <div className="user-wallet-stat-item">
                <ArrowDownCircle className="user-wallet-stat-icon text-red-500" />
                <div>
                  <span className="user-wallet-stat-label">Total Debits</span>
                  <span className="user-wallet-stat-value">₹{millanceWallet.totalDebits.toLocaleString()}</span>
                </div>
              </div>

              <div className="user-wallet-stat-item">
                <TrendingUp className="user-wallet-stat-icon text-orange-500" />
                <div>
                  <span className="user-wallet-stat-label">Pending</span>
                  <span className="user-wallet-stat-value">₹{millanceWallet.pending.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="user-wallet-actions-grid">
              <button className="user-wallet-action-btn user-wallet-action-green">
                <Plus className="w-4 h-4" />
                <span>Add Money</span>
              </button>

              <button className="user-wallet-action-btn user-wallet-action-orange">
                <Minus className="w-4 h-4" />
                <span>Withdraw</span>
              </button>

              <button className="user-wallet-action-btn user-wallet-action-blue">
                <Send className="w-4 h-4" />
                <span>Transfer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Savings History */}
        <div className="user-card-compact user-savings-history-card">
          <div className="user-section-header-with-action">
            <h3 className="user-section-title">Savings History</h3>
          </div>

          <div className="user-transaction-list">
            {savingsHistory.map((entry) => (
              <div key={entry.id} className="user-transaction-item">
                <div className="user-transaction-icon-wrapper">
                  <Calendar className="user-transaction-icon text-green-500" />
                </div>
                <div className="user-transaction-details">
                  <span className="user-transaction-desc">{entry.description}</span>
                  <span className="user-transaction-date">
                    {new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="user-transaction-amount-wrapper">
                  <span className="user-transaction-amount user-transaction-credit">
                    +₹{entry.amount.toLocaleString()}
                  </span>
                  <span className="user-transaction-status user-transaction-status-completed">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="user-card-compact user-transactions-card">
          <div className="user-section-header-with-action">
            <h3 className="user-section-title">Recent Transactions</h3>
            {!showAllTransactions && (
              <button 
                onClick={() => setShowAllTransactions(true)}
                className="user-view-all-btn"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {showAllTransactions && (
            <div className="user-transaction-filters">
              <button 
                onClick={() => setTransactionFilter('all')}
                className={`user-transaction-filter-btn ${transactionFilter === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              <button 
                onClick={() => setTransactionFilter('credits')}
                className={`user-transaction-filter-btn ${transactionFilter === 'credits' ? 'active' : ''}`}
              >
                Credits
              </button>
              <button 
                onClick={() => setTransactionFilter('debits')}
                className={`user-transaction-filter-btn ${transactionFilter === 'debits' ? 'active' : ''}`}
              >
                Debits
              </button>
              <button 
                onClick={() => setTransactionFilter('pending')}
                className={`user-transaction-filter-btn ${transactionFilter === 'pending' ? 'active' : ''}`}
              >
                Pending
              </button>
            </div>
          )}

          <div className="user-transaction-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="user-transaction-item">
                <div className="user-transaction-icon-wrapper">
                  {transaction.type === 'Credit' ? (
                    <ArrowUpCircle className="user-transaction-icon text-green-500" />
                  ) : (
                    <ArrowDownCircle className="user-transaction-icon text-red-500" />
                  )}
                </div>
                <div className="user-transaction-details">
                  <span className="user-transaction-desc">{transaction.description}</span>
                  <span className="user-transaction-date">
                    {new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="user-transaction-amount-wrapper">
                  <span className={`user-transaction-amount ${transaction.amount > 0 ? 'user-transaction-credit' : 'user-transaction-debit'}`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                  </span>
                  <span className="user-transaction-status user-transaction-status-completed">{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>

          {showAllTransactions && (
            <button 
              onClick={() => setShowAllTransactions(false)}
              className="user-show-less-btn"
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Wallet;
