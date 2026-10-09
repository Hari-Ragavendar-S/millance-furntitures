import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import { 
  CreditCard, Download, CheckCircle, Clock, 
  Wallet, Users, Grid, IdCard, FileText, Calendar, ChevronDown, Filter
} from 'lucide-react';

const UserPayments = () => {
  // User's multiple Teams and Groups (same structure as My Plan)
  const userPlansData = {
    userId: 'USER-001',
    name: 'Rajesh Kumar',
    
    teams: [
      {
        teamId: 'TEAM-1',
        teamName: 'Team 1',
        groups: [
          {
            groupId: 'GROUP-A',
            groupName: 'Group A',
            memberId: 'ML001',
            planAmount: 50000,
            monthlyPayment: 4545,
            totalMonths: 11,
            paidMonths: 6,
            currentMonth: 5
          },
          {
            groupId: 'GROUP-B',
            groupName: 'Group B',
            memberId: 'ML002',
            planAmount: 50000,
            monthlyPayment: 4545,
            totalMonths: 11,
            paidMonths: 3,
            currentMonth: 3
          }
        ]
      },
      {
        teamId: 'TEAM-2',
        teamName: 'Team 2',
        groups: [
          {
            groupId: 'GROUP-C',
            groupName: 'Group C',
            memberId: 'ML003',
            planAmount: 50000,
            monthlyPayment: 4545,
            totalMonths: 11,
            paidMonths: 9,
            currentMonth: 9
          }
        ]
      }
    ]
  };

  // All Payment Transactions (for all groups)
  const allPaymentTransactions = [
    // Team 1 - Group A Payments
    { paymentId: 'PAY001', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 6, amount: 4545, date: '2026-06-15', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260615001', receipt: true },
    { paymentId: 'PAY002', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 5, amount: 4545, date: '2026-05-15', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260515001', receipt: true },
    { paymentId: 'PAY003', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 4, amount: 4545, date: '2026-04-15', method: 'Cash', status: 'COMPLETED', transactionId: 'TXN20260415001', receipt: true },
    { paymentId: 'PAY004', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 3, amount: 4545, date: '2026-03-15', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260315001', receipt: true },
    { paymentId: 'PAY005', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 2, amount: 4545, date: '2026-02-15', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260215001', receipt: true },
    { paymentId: 'PAY006', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 1, amount: 4545, date: '2026-01-15', method: 'Cash', status: 'COMPLETED', transactionId: 'TXN20260115001', receipt: true },
    { paymentId: 'PAY007', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-A', groupName: 'Group A', memberId: 'ML001', month: 7, amount: 4545, date: null, method: null, status: 'PENDING', transactionId: null, receipt: false },
    
    // Team 1 - Group B Payments
    { paymentId: 'PAY008', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-B', groupName: 'Group B', memberId: 'ML002', month: 3, amount: 4545, date: '2026-05-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260501001', receipt: true },
    { paymentId: 'PAY009', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-B', groupName: 'Group B', memberId: 'ML002', month: 2, amount: 4545, date: '2026-04-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260401001', receipt: true },
    { paymentId: 'PAY010', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-B', groupName: 'Group B', memberId: 'ML002', month: 1, amount: 4545, date: '2026-03-01', method: 'Cash', status: 'COMPLETED', transactionId: 'TXN20260301001', receipt: true },
    { paymentId: 'PAY011', userId: 'USER-001', teamId: 'TEAM-1', teamName: 'Team 1', groupId: 'GROUP-B', groupName: 'Group B', memberId: 'ML002', month: 4, amount: 4545, date: null, method: null, status: 'PENDING', transactionId: null, receipt: false },
    
    // Team 2 - Group C Payments
    { paymentId: 'PAY012', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 9, amount: 4545, date: '2026-08-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260801001', receipt: true },
    { paymentId: 'PAY013', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 8, amount: 4545, date: '2026-07-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260701001', receipt: true },
    { paymentId: 'PAY014', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 7, amount: 4545, date: '2026-06-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260601001', receipt: true },
    { paymentId: 'PAY015', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 6, amount: 4545, date: '2026-05-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260501002', receipt: true },
    { paymentId: 'PAY016', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 5, amount: 4545, date: '2026-04-01', method: 'Cash', status: 'COMPLETED', transactionId: 'TXN20260401002', receipt: true },
    { paymentId: 'PAY017', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 4, amount: 4545, date: '2026-03-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260301002', receipt: true },
    { paymentId: 'PAY018', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 3, amount: 4545, date: '2026-02-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260201001', receipt: true },
    { paymentId: 'PAY019', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 2, amount: 4545, date: '2026-01-01', method: 'Online', status: 'COMPLETED', transactionId: 'TXN20260101001', receipt: true },
    { paymentId: 'PAY020', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 1, amount: 4545, date: '2025-12-01', method: 'Cash', status: 'COMPLETED', transactionId: 'TXN20251201001', receipt: true },
    { paymentId: 'PAY021', userId: 'USER-001', teamId: 'TEAM-2', teamName: 'Team 2', groupId: 'GROUP-C', groupName: 'Group C', memberId: 'ML003', month: 10, amount: 4545, date: null, method: null, status: 'PENDING', transactionId: null, receipt: false }
  ];

  // State for filters
  const [selectedTeamId, setSelectedTeamId] = useState(userPlansData.teams[0].teamId);
  const [selectedGroupId, setSelectedGroupId] = useState(userPlansData.teams[0].groups[0].groupId);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Get current selected team and group
  const selectedTeam = userPlansData.teams.find(t => t.teamId === selectedTeamId);
  const selectedGroup = selectedTeam?.groups.find(g => g.groupId === selectedGroupId);
  
  // Update group when team changes
  useEffect(() => {
    if (selectedTeam && selectedTeam.groups.length > 0) {
      const groupExists = selectedTeam.groups.find(g => g.groupId === selectedGroupId);
      if (!groupExists) {
        setSelectedGroupId(selectedTeam.groups[0].groupId);
      }
    }
  }, [selectedTeamId]);
  
  // Filter transactions by Team + Group + Month + Status
  const filteredTransactions = allPaymentTransactions.filter(transaction => {
    const matchesUser = transaction.userId === userPlansData.userId;
    const matchesTeam = transaction.teamId === selectedTeamId;
    const matchesGroup = transaction.groupId === selectedGroupId;
    const matchesMonth = selectedMonth === 'all' || transaction.month === parseInt(selectedMonth);
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    
    return matchesUser && matchesTeam && matchesGroup && matchesMonth && matchesStatus;
  });
  
  // Calculate dynamic totals from filtered transactions
  const completedPayments = filteredTransactions.filter(p => p.status === 'COMPLETED');
  const pendingPayments = filteredTransactions.filter(p => p.status === 'PENDING');
  
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const transactionCount = filteredTransactions.length;
  
  // Current month payment (most recent completed)
  const currentMonthPayment = completedPayments.length > 0 
    ? completedPayments[0].amount 
    : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status style
  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'user-payment-status-completed';
      case 'PENDING': return 'user-payment-status-pending';
      case 'FAILED': return 'user-payment-status-failed';
      default: return 'user-payment-status-default';
    }
  };

  return (
    <UserLayout>
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      <div className="user-dashboard-compact">
        {/* Team + Group + Filters Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-payment-filters-bar"
        >
          <div className="user-payment-filters-grid">
            {/* Team Dropdown */}
            <div className="user-payment-filter-item">
              <label className="user-payment-filter-label">
                <Users size={14} />
                <span>Team</span>
              </label>
              <div className="user-payment-select-container">
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="user-payment-select"
                >
                  {userPlansData.teams.map((team) => (
                    <option key={team.teamId} value={team.teamId}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="user-payment-select-icon" />
              </div>
            </div>
            
            {/* Group Dropdown */}
            <div className="user-payment-filter-item">
              <label className="user-payment-filter-label">
                <Grid size={14} />
                <span>Group</span>
              </label>
              <div className="user-payment-select-container">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="user-payment-select"
                >
                  {selectedTeam?.groups.map((group) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="user-payment-select-icon" />
              </div>
            </div>
            
            {/* Month Filter */}
            <div className="user-payment-filter-item">
              <label className="user-payment-filter-label">
                <Calendar size={14} />
                <span>Month</span>
              </label>
              <div className="user-payment-select-container">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="user-payment-select"
                >
                  <option value="all">All Months</option>
                  {Array.from({ length: 11 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>Month {month}</option>
                  ))}
                </select>
                <ChevronDown className="user-payment-select-icon" />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="user-payment-filter-item">
              <label className="user-payment-filter-label">
                <Filter size={14} />
                <span>Status</span>
              </label>
              <div className="user-payment-select-container">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="user-payment-select"
                >
                  <option value="all">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
                <ChevronDown className="user-payment-select-icon" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compact KPI Cards */}
        <div className="user-stats-grid-v2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`paid-${selectedTeamId}-${selectedGroupId}`}
            className="user-stat-card-v2 user-stat-paid"
          >
            <div className="user-stat-icon-v2">
              <CheckCircle />
            </div>
            <div className="user-stat-content-v2">
              <div className="user-stat-value-v2">{formatCurrency(totalPaid)}</div>
              <div className="user-stat-label-v2">Total Paid</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={`pending-${selectedTeamId}-${selectedGroupId}`}
            className="user-stat-card-v2 user-stat-pending"
          >
            <div className="user-stat-icon-v2">
              <Clock />
            </div>
            <div className="user-stat-content-v2">
              <div className="user-stat-value-v2">{formatCurrency(pendingAmount)}</div>
              <div className="user-stat-label-v2">Pending</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            key={`trans-${selectedTeamId}-${selectedGroupId}`}
            className="user-stat-card-v2 user-stat-transactions"
          >
            <div className="user-stat-icon-v2">
              <CreditCard />
            </div>
            <div className="user-stat-content-v2">
              <div className="user-stat-value-v2">{transactionCount}</div>
              <div className="user-stat-label-v2">Transactions</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            key={`month-${selectedTeamId}-${selectedGroupId}`}
            className="user-stat-card-v2 user-stat-month"
          >
            <div className="user-stat-icon-v2">
              <Wallet />
            </div>
            <div className="user-stat-content-v2">
              <div className="user-stat-value-v2">{formatCurrency(currentMonthPayment)}</div>
              <div className="user-stat-label-v2">This Month</div>
            </div>
          </motion.div>
        </div>

        {/* My Plan Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          key={`plan-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-payment-plan-card"
        >
          <h3 className="user-section-title">My Plan Payment</h3>
          
          <div className="user-payment-plan-grid">
            <div className="user-payment-plan-item">
              <Users className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Team</span>
                <span className="user-payment-plan-value">{selectedTeam?.teamName || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <Grid className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Group</span>
                <span className="user-payment-plan-value">{selectedGroup?.groupName || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <IdCard className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Member ID</span>
                <span className="user-payment-plan-value">{selectedGroup?.memberId || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <Wallet className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Plan Amount</span>
                <span className="user-payment-plan-value">{formatCurrency(selectedGroup?.planAmount || 0)}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <CreditCard className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Monthly Payment</span>
                <span className="user-payment-plan-value">{formatCurrency(selectedGroup?.monthlyPayment || 0)}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <CheckCircle className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Paid Months</span>
                <span className="user-payment-plan-value">{selectedGroup?.paidMonths || 0} / {selectedGroup?.totalMonths || 11}</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <Clock className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Remaining</span>
                <span className="user-payment-plan-value">{((selectedGroup?.totalMonths || 11) - (selectedGroup?.paidMonths || 0))} Months</span>
              </div>
            </div>
            
            <div className="user-payment-plan-item">
              <Calendar className="user-payment-plan-icon" />
              <div>
                <span className="user-payment-plan-label">Current Month</span>
                <span className="user-payment-plan-value">Month {selectedGroup?.currentMonth || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          key={`history-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact"
        >
          <div className="user-payment-history-header">
            <FileText className="user-payment-history-icon" />
            <div>
              <h3 className="user-section-title">Payment History</h3>
              <div className="user-payment-history-info">
                <span className="user-payment-history-team">{selectedTeam?.teamName}</span>
                <span className="user-payment-history-separator">•</span>
                <span className="user-payment-history-group">{selectedGroup?.groupName}</span>
                <span className="user-payment-history-separator">•</span>
                <span className="user-payment-history-count">{transactionCount} Transactions</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="user-payment-table-desktop">
            <table className="user-payment-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((payment) => (
                    <tr key={payment.paymentId}>
                      <td className="user-payment-id">{payment.paymentId}</td>
                      <td>Month {payment.month}</td>
                      <td className="user-payment-amount">{formatCurrency(payment.amount)}</td>
                      <td>{formatDate(payment.date)}</td>
                      <td>{payment.method || 'N/A'}</td>
                      <td>
                        <span className={`user-payment-status ${getStatusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        {payment.receipt && (
                          <button className="user-payment-receipt-btn">
                            <Download size={16} />
                            <span>Receipt</span>
                          </button>
                        )}
                        {!payment.receipt && (
                          <span className="user-payment-no-receipt">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="user-payment-no-data">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="user-payment-cards-mobile">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((payment, index) => (
                <motion.div
                  key={payment.paymentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.05) }}
                  className="user-payment-card-mobile"
                >
                  <div className="user-payment-card-header">
                    <div>
                      <div className="user-payment-card-id">{payment.paymentId}</div>
                      <div className="user-payment-card-month">Month {payment.month}</div>
                    </div>
                    <span className={`user-payment-status ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  <div className="user-payment-card-details">
                    <div className="user-payment-card-row">
                      <span className="user-payment-card-label">Amount:</span>
                      <span className="user-payment-card-value">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="user-payment-card-row">
                      <span className="user-payment-card-label">Date:</span>
                      <span className="user-payment-card-value">{formatDate(payment.date)}</span>
                    </div>
                    <div className="user-payment-card-row">
                      <span className="user-payment-card-label">Method:</span>
                      <span className="user-payment-card-value">{payment.method || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {payment.receipt && (
                    <button className="user-payment-receipt-btn-mobile">
                      <Download size={16} />
                      <span>Download Receipt</span>
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="user-payment-no-data-mobile">
                No transactions found for the selected filters
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserPayments;
