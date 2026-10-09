import { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { 
  Vault, Gift, CheckCircle, TrendingUp, Wallet, 
  ArrowUpCircle, ArrowDownCircle, Send, History,
  Plus, Minus, ChevronRight, Calendar, CreditCard
} from 'lucide-react';

const UserVault = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all'); // all, credits, debits, pending

  // Summary Data
  const vaultSummary = {
    totalRewards: 0,
    availableRewards: 0,
    redeemedRewards: 0,
    pendingRewards: 0
  };

  // Savings Wallet - Demo Data
  const savingsWallet = {
    currentSavings: 24500,
    totalSaved: 24500,
    thisMonth: 3000,
    savingsEntries: 8,
    targetSavings: 50000
  };

  // Savings History - Demo Data
  const savingsHistory = [
    { id: 1, date: '2026-10-05', description: 'Monthly Savings', amount: 1000, status: 'Completed' },
    { id: 2, date: '2026-09-05', description: 'Monthly Savings', amount: 1000, status: 'Completed' },
    { id: 3, date: '2026-08-05', description: 'Monthly Savings', amount: 1000, status: 'Completed' },
    { id: 4, date: '2026-07-05', description: 'Monthly Savings', amount: 1000, status: 'Completed' },
    { id: 5, date: '2026-06-05', description: 'Monthly Savings', amount: 1000, status: 'Completed' }
  ];

  // Millance Wallet - Demo Data
  const millanceWallet = {
    availableBalance: 8750,
    totalCredits: 12500,
    totalDebits: 3750,
    pending: 0
  };

  // Recent Transactions - Demo Data
  const recentTransactions = [
    { id: 1, date: '2026-10-05', type: 'Credit', description: 'Reward Credit', amount: 2000, status: 'Completed' },
    { id: 2, date: '2026-10-02', type: 'Debit', description: 'Wallet Payment', amount: -500, status: 'Completed' },
    { id: 3, date: '2026-09-28', type: 'Credit', description: 'Reward Credit', amount: 1500, status: 'Completed' },
    { id: 4, date: '2026-09-20', type: 'Debit', description: 'Wallet Transfer', amount: -750, status: 'Completed' },
    { id: 5, date: '2026-09-15', type: 'Credit', description: 'Monthly Credit', amount: 3000, status: 'Completed' }
  ];

  // All Transactions for full history
  const allTransactions = [
    ...recentTransactions,
    { id: 6, date: '2026-09-10', type: 'Debit', description: 'Service Fee', amount: -250, status: 'Completed' },
    { id: 7, date: '2026-09-05', type: 'Credit', description: 'Bonus Credit', amount: 1000, status: 'Completed' },
    { id: 8, date: '2026-08-28', type: 'Credit', description: 'Reward Credit', amount: 2000, status: 'Completed' },
    { id: 9, date: '2026-08-15', type: 'Debit', description: 'Withdrawal', amount: -1500, status: 'Completed' },
    { id: 10, date: '2026-08-05', type: 'Credit', description: 'Monthly Credit', amount: 3000, status: 'Completed' }
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter(t => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'credits') return t.type === 'Credit';
    if (transactionFilter === 'debits') return t.type === 'Debit';
    if (transactionFilter === 'pending') return t.status === 'Pending';
    return true;
  });

  // Rewards Data
  const rewards = [];

  const savingsProgress = (savingsWallet.currentSavings / savingsWallet.targetSavings) * 100;

  return (
    <UserLayout>
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
          {/* Savings Wallet */}
          <div className="user-card-compact user-savings-wallet-card">
            <div className="user-vault-section-header">
              <Wallet className="user-vault-section-icon" />
              <h2 className="user-vault-section-title">Savings Wallet</h2>
            </div>

            <div className="user-savings-stats-grid">
              <div className="user-savings-stat-item">
                <span className="user-savings-stat-label">Current Savings</span>
                <span className="user-savings-stat-value">₹{savingsWallet.currentSavings.toLocaleString()}</span>
              </div>

              <div className="user-savings-stat-item">
                <span className="user-savings-stat-label">Total Saved</span>
                <span className="user-savings-stat-value">₹{savingsWallet.totalSaved.toLocaleString()}</span>
              </div>

              <div className="user-savings-stat-item">
                <span className="user-savings-stat-label">This Month</span>
                <span className="user-savings-stat-value text-green-600">₹{savingsWallet.thisMonth.toLocaleString()}</span>
              </div>

              <div className="user-savings-stat-item">
                <span className="user-savings-stat-label">Savings Entries</span>
                <span className="user-savings-stat-value">{savingsWallet.savingsEntries}</span>
              </div>
            </div>

            {/* Savings Progress */}
            <div className="user-savings-progress-section">
              <div className="user-progress-info">
                <span className="user-progress-label">Savings Progress</span>
                <span className="user-progress-percent">{Math.round(savingsProgress)}%</span>
              </div>
              <div className="user-progress-bar-wrapper">
                <div className="user-progress-bar" style={{ width: `${savingsProgress}%` }}></div>
              </div>
              <p className="user-progress-text">
                ₹{savingsWallet.currentSavings.toLocaleString()} saved of ₹{savingsWallet.targetSavings.toLocaleString()} target
              </p>
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
            {(showAllTransactions ? filteredTransactions : recentTransactions).map((transaction) => (
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

        {/* My Rewards */}
        <div className="user-card-compact user-rewards-card">
          <h3 className="user-section-title">My Rewards</h3>
          
          {rewards.length === 0 ? (
            <div className="user-empty-state">
              <div className="user-empty-icon-wrapper">
                <Vault className="user-empty-icon" />
              </div>
              <h4 className="user-empty-title">No Rewards Yet</h4>
              <p className="user-empty-desc">Your rewards will appear here when you win a draw</p>
            </div>
          ) : (
            <div className="user-rewards-grid">
              {rewards.map((reward) => (
                <div key={reward.id} className="user-reward-card">
                  <div className="user-reward-header">
                    <span className={`user-reward-status ${reward.status === 'available' ? 'available' : reward.status === 'redeemed' ? 'redeemed' : 'pending'}`}>
                      {reward.status}
                    </span>
                    <span className="user-reward-month">Month {reward.month}</span>
                  </div>
                  <h4 className="user-reward-name">{reward.prize}</h4>
                  <p className="user-reward-value">{reward.value}</p>
                  {reward.status === 'available' && (
                    <button className="user-reward-redeem-btn">Redeem Now</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserVault;
