import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import CustomSelect from '../../components/CustomSelect';
import { 
  Users, Grid, IdCard, Wallet, CheckCircle, Clock,
  Calendar, Award, TrendingUp, Building, Gift, ArrowRight,
  Check, Circle, AlertCircle, MapPin
} from 'lucide-react';

const UserMyPlan = () => {
  // User's multiple Teams and Groups (replace with actual backend data)
  const userPlansData = {
    userId: 'USER-001',
    name: 'Rajesh Kumar',
    franchiseId: 'FRAN-001',
    franchiseName: 'ABC Franchise Salem',
    
    teams: [
      {
        teamId: 'TEAM-1',
        teamName: 'Team 1',
        groups: [
          {
            groupId: 'GROUP-A',
            groupName: 'Group A',
            memberId: 'ML001',
            groupCapacity: 11,
            currentSlot: 5,
            planAmount: 50000,
            monthlyPayment: 4545,
            paidAmount: 30000,
            paidMonths: 6,
            totalMonths: 11,
            currentMonth: 5,
            registrationDate: '2026-01-15',
            membershipStatus: 'ACTIVE',
            nextPaymentDate: '2026-11-01',
            nextDrawDate: '2026-10-15',
            nextDrawTime: '19:00',
            drawEligibility: 'ELIGIBLE',
            currentMonthPrize: {
              prizeId: 'PRIZE-001',
              prizeName: '43" LED TV',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 3,
              month: 5,
              drawDate: '2026-10-15'
            },
            nextMonthPrize: {
              prizeId: 'PRIZE-002',
              prizeName: 'Gold Coin 5g',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 2,
              month: 6,
              drawDate: '2026-11-15'
            },
            monthlyPayments: [
              { month: 1, status: 'PAID', date: '2026-01-15', amount: 4545 },
              { month: 2, status: 'PAID', date: '2026-02-15', amount: 4545 },
              { month: 3, status: 'PAID', date: '2026-03-15', amount: 4545 },
              { month: 4, status: 'PAID', date: '2026-04-15', amount: 4545 },
              { month: 5, status: 'PAID', date: '2026-05-15', amount: 4545 },
              { month: 6, status: 'PAID', date: '2026-06-15', amount: 4545 },
              { month: 7, status: 'PENDING', date: null, amount: 4545 },
              { month: 8, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 9, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 10, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 11, status: 'UPCOMING', date: null, amount: 4545 }
            ]
          },
          {
            groupId: 'GROUP-B',
            groupName: 'Group B',
            memberId: 'ML002',
            groupCapacity: 11,
            currentSlot: 3,
            planAmount: 50000,
            monthlyPayment: 4545,
            paidAmount: 13635,
            paidMonths: 3,
            totalMonths: 11,
            currentMonth: 3,
            registrationDate: '2026-03-01',
            membershipStatus: 'ACTIVE',
            nextPaymentDate: '2026-11-01',
            nextDrawDate: '2026-10-15',
            nextDrawTime: '19:00',
            drawEligibility: 'ELIGIBLE',
            currentMonthPrize: {
              prizeId: 'PRIZE-003',
              prizeName: 'Washing Machine',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 2,
              month: 3,
              drawDate: '2026-10-15'
            },
            nextMonthPrize: {
              prizeId: 'PRIZE-004',
              prizeName: 'Laptop',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 1,
              month: 4,
              drawDate: '2026-11-15'
            },
            monthlyPayments: [
              { month: 1, status: 'PAID', date: '2026-03-01', amount: 4545 },
              { month: 2, status: 'PAID', date: '2026-04-01', amount: 4545 },
              { month: 3, status: 'PAID', date: '2026-05-01', amount: 4545 },
              { month: 4, status: 'PENDING', date: null, amount: 4545 },
              { month: 5, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 6, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 7, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 8, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 9, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 10, status: 'UPCOMING', date: null, amount: 4545 },
              { month: 11, status: 'UPCOMING', date: null, amount: 4545 }
            ]
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
            groupCapacity: 11,
            currentSlot: 8,
            planAmount: 50000,
            monthlyPayment: 4545,
            paidAmount: 40909,
            paidMonths: 9,
            totalMonths: 11,
            currentMonth: 9,
            registrationDate: '2025-12-01',
            membershipStatus: 'ACTIVE',
            nextPaymentDate: '2026-11-01',
            nextDrawDate: '2026-10-15',
            nextDrawTime: '19:00',
            drawEligibility: 'ELIGIBLE',
            currentMonthPrize: {
              prizeId: 'PRIZE-005',
              prizeName: 'Refrigerator',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 2,
              month: 9,
              drawDate: '2026-10-15'
            },
            nextMonthPrize: {
              prizeId: 'PRIZE-006',
              prizeName: 'Bike',
              prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
              winnerCount: 1,
              month: 10,
              drawDate: '2026-11-15'
            },
            monthlyPayments: [
              { month: 1, status: 'PAID', date: '2025-12-01', amount: 4545 },
              { month: 2, status: 'PAID', date: '2026-01-01', amount: 4545 },
              { month: 3, status: 'PAID', date: '2026-02-01', amount: 4545 },
              { month: 4, status: 'PAID', date: '2026-03-01', amount: 4545 },
              { month: 5, status: 'PAID', date: '2026-04-01', amount: 4545 },
              { month: 6, status: 'PAID', date: '2026-05-01', amount: 4545 },
              { month: 7, status: 'PAID', date: '2026-06-01', amount: 4545 },
              { month: 8, status: 'PAID', date: '2026-07-01', amount: 4545 },
              { month: 9, status: 'PAID', date: '2026-08-01', amount: 4545 },
              { month: 10, status: 'PENDING', date: null, amount: 4545 },
              { month: 11, status: 'UPCOMING', date: null, amount: 4545 }
            ]
          }
        ]
      }
    ]
  };

  // State for selected Team and Group
  const [selectedTeamId, setSelectedTeamId] = useState(userPlansData.teams[0].teamId);
  const [selectedGroupId, setSelectedGroupId] = useState(userPlansData.teams[0].groups[0].groupId);
  
  // Get current selected team and group
  const selectedTeam = userPlansData.teams.find(t => t.teamId === selectedTeamId);
  const selectedGroup = selectedTeam?.groups.find(g => g.groupId === selectedGroupId);
  
  // Update group when team changes
  useEffect(() => {
    if (selectedTeam && selectedTeam.groups.length > 0) {
      // If current group doesn't belong to selected team, select first group of new team
      const groupExists = selectedTeam.groups.find(g => g.groupId === selectedGroupId);
      if (!groupExists) {
        setSelectedGroupId(selectedTeam.groups[0].groupId);
      }
    }
  }, [selectedTeamId]);
  
  // Current plan data (from selected group)
  const planData = selectedGroup || {};

  // Calculate derived values
  const pendingAmount = (planData.planAmount || 0) - (planData.paidAmount || 0);
  const remainingMonths = (planData.totalMonths || 11) - (planData.paidMonths || 0);
  const progressPercent = Math.round(((planData.paidMonths || 0) / (planData.totalMonths || 11)) * 100);

  // Get month status from payment data
  const getMonthStatus = (monthNum) => {
    const monthPayment = planData.monthlyPayments?.find(m => m.month === monthNum);
    return monthPayment?.status || 'UPCOMING';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'INACTIVE': return 'status-inactive';
      case 'COMPLETED': return 'status-completed';
      case 'SUSPENDED': return 'status-suspended';
      default: return 'status-default';
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
        {/* Page Header */}
        <div className="user-plan-header">
          <Award className="user-plan-header-icon" />
          <div>
            <h1 className="user-plan-header-title">My Plan</h1>
            <p className="user-plan-header-subtitle">
              View your membership, payment progress and upcoming draw details
            </p>
          </div>
        </div>

        {/* Team & Group Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-plan-selection-bar"
        >
          <div className="user-plan-selection-grid">
            {/* Team Dropdown */}
            <div className="user-plan-select-wrapper">
              <CustomSelect
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                options={userPlansData.teams.map((team) => ({
                  value: team.teamId,
                  label: team.teamName
                }))}
                label="Select Team"
                type="team"
              />
            </div>
            
            {/* Group Dropdown */}
            <div className="user-plan-select-wrapper">
              <CustomSelect
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                options={selectedTeam?.groups.map((group) => ({
                  value: group.groupId,
                  label: group.groupName
                })) || []}
                label="Select Group"
                type="group"
              />
            </div>
          </div>
        </motion.div>

        {/* Premium Plan Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="user-plan-hero-card"
        >
          <div className="user-plan-hero-header">
            <h2 className="user-plan-hero-title">MY PLAN</h2>
            <div className={`user-plan-hero-status ${getStatusColor(planData.membershipStatus)}`}>
              <CheckCircle size={16} />
              <span>{planData.membershipStatus || 'N/A'}</span>
            </div>
          </div>
          
          <div className="user-plan-hero-details">
            <div className="user-plan-hero-detail-item">
              <Users size={20} />
              <div>
                <span className="user-plan-hero-label">Team</span>
                <span className="user-plan-hero-value">{selectedTeam?.teamName || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-plan-hero-detail-item">
              <Grid size={20} />
              <div>
                <span className="user-plan-hero-label">Group</span>
                <span className="user-plan-hero-value">{planData.groupName || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-plan-hero-detail-item">
              <IdCard size={20} />
              <div>
                <span className="user-plan-hero-label">Member ID</span>
                <span className="user-plan-hero-value">{planData.memberId || 'N/A'}</span>
              </div>
            </div>
            
            <div className="user-plan-hero-detail-item">
              <Wallet size={20} />
              <div>
                <span className="user-plan-hero-label">Plan Amount</span>
                <span className="user-plan-hero-value">{formatCurrency(planData.planAmount || 0)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Membership Details Grid */}
        <div className="user-plan-details-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="user-plan-detail-card user-plan-card-team"
          >
            <Users className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Team</span>
            <span className="user-plan-detail-value">{selectedTeam?.teamName || 'N/A'}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="user-plan-detail-card user-plan-card-group"
          >
            <Grid className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Group</span>
            <span className="user-plan-detail-value">{planData.groupName || 'N/A'}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="user-plan-detail-card user-plan-card-member"
          >
            <IdCard className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Member ID</span>
            <span className="user-plan-detail-value">{planData.memberId || 'N/A'}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="user-plan-detail-card user-plan-card-amount"
          >
            <Wallet className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Monthly Payment</span>
            <span className="user-plan-detail-value">{formatCurrency(planData.monthlyPayment || 0)}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="user-plan-detail-card user-plan-card-status"
          >
            <MapPin className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Slot Position</span>
            <span className="user-plan-detail-value">{planData.currentSlot || 0} / {planData.groupCapacity || 11}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="user-plan-detail-card user-plan-card-month"
          >
            <Calendar className="user-plan-detail-icon" />
            <span className="user-plan-detail-label">Current Month</span>
            <span className="user-plan-detail-value">Month {planData.currentMonth || 0}</span>
          </motion.div>
        </div>

        {/* Payment Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          key={`progress-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-plan-progress-card"
        >
          <div className="user-plan-section-header">
            <TrendingUp className="user-plan-section-icon" />
            <h3 className="user-section-title">Payment Progress</h3>
          </div>
          
          <div className="user-plan-progress-container">
            <div className="user-plan-progress-circle">
              <svg className="user-plan-progress-svg" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - progressPercent / 100)}`}
                  transform="rotate(-90 100 100)"
                  className="user-plan-progress-circle-animated"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="user-plan-progress-text">
                <span className="user-plan-progress-percent">{progressPercent}%</span>
                <span className="user-plan-progress-label">Complete</span>
              </div>
            </div>
            
            <div className="user-plan-progress-stats">
              <div className="user-plan-progress-stat-item">
                <CheckCircle className="user-plan-progress-stat-icon user-icon-paid" />
                <div>
                  <span className="user-plan-progress-stat-label">Paid</span>
                  <span className="user-plan-progress-stat-value">{planData.paidMonths || 0} Months</span>
                </div>
              </div>
              
              <div className="user-plan-progress-stat-item">
                <Clock className="user-plan-progress-stat-icon user-icon-remaining" />
                <div>
                  <span className="user-plan-progress-stat-label">Remaining</span>
                  <span className="user-plan-progress-stat-value">{remainingMonths} Months</span>
                </div>
              </div>
              
              <div className="user-plan-progress-stat-item">
                <Calendar className="user-plan-progress-stat-icon user-icon-total" />
                <div>
                  <span className="user-plan-progress-stat-label">Total</span>
                  <span className="user-plan-progress-stat-value">{planData.totalMonths || 11} Months</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Month Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          key={`timeline-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-plan-timeline-card"
        >
          <h3 className="user-section-title">11-Month Timeline</h3>
          
          <div className="user-plan-month-timeline">
            {Array.from({ length: planData.totalMonths || 11 }, (_, i) => i + 1).map((month) => {
              const status = getMonthStatus(month);
              const isCurrent = month === planData.currentMonth;
              return (
                <div
                  key={month}
                  className={`user-plan-month-item ${
                    status === 'PAID' ? 'user-plan-month-paid' : 
                    isCurrent ? 'user-plan-month-current' :
                    status === 'PENDING' ? 'user-plan-month-pending' :
                    'user-plan-month-upcoming'
                  }`}
                >
                  <div className="user-plan-month-indicator">
                    {status === 'PAID' && <Check size={14} />}
                    {isCurrent && <Circle size={14} className="user-plan-month-pulse" />}
                    {(status === 'PENDING' || status === 'UPCOMING') && !isCurrent && <Circle size={14} />}
                  </div>
                  <span className="user-plan-month-label">M{month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          key={`summary-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-plan-summary-card"
        >
          <h3 className="user-section-title">Payment Summary</h3>
          
          <div className="user-plan-summary-grid">
            <div className="user-plan-summary-item">
              <span className="user-plan-summary-label">Plan Amount</span>
              <span className="user-plan-summary-value user-plan-value-total">{formatCurrency(planData.planAmount || 0)}</span>
            </div>
            
            <div className="user-plan-summary-item">
              <span className="user-plan-summary-label">Paid Amount</span>
              <span className="user-plan-summary-value user-plan-value-paid">{formatCurrency(planData.paidAmount || 0)}</span>
            </div>
            
            <div className="user-plan-summary-item">
              <span className="user-plan-summary-label">Pending Amount</span>
              <span className="user-plan-summary-value user-plan-value-pending">{formatCurrency(pendingAmount)}</span>
            </div>
            
            <div className="user-plan-summary-item">
              <span className="user-plan-summary-label">Paid Months</span>
              <span className="user-plan-summary-value">{planData.paidMonths || 0} / {planData.totalMonths || 11}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Month & Next Draw */}
        <div className="user-plan-dual-card-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            key={`current-${selectedTeamId}-${selectedGroupId}`}
            className="user-card-compact user-plan-current-month-card"
          >
            <Calendar className="user-plan-current-month-icon" />
            <h3 className="user-section-title">Current Month</h3>
            <div className="user-plan-current-month-value">Month {planData.currentMonth || 0}</div>
            <div className={`user-plan-current-month-status ${getStatusColor(planData.drawEligibility || 'PENDING')}`}>
              <CheckCircle size={14} />
              <span>{planData.drawEligibility || 'PENDING'}</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            key={`next-${selectedTeamId}-${selectedGroupId}`}
            className="user-card-compact user-plan-next-draw-card"
          >
            <Award className="user-plan-next-draw-icon" />
            <h3 className="user-section-title">Next Draw</h3>
            
            <div className="user-plan-next-draw-details">
              <div className="user-plan-next-draw-row">
                <Calendar size={16} />
                <span>{formatDate(planData.nextDrawDate || '2026-10-15')}</span>
              </div>
              <div className="user-plan-next-draw-row">
                <Clock size={16} />
                <span>{new Date(`2000-01-01T${planData.nextDrawTime || '19:00'}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
            </div>
            
            <button className="user-plan-view-draw-btn">
              View Draw
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Current Month Prize */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          key={`prize-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-plan-prize-card"
        >
          <div className="user-plan-section-header">
            <Gift className="user-plan-section-icon" />
            <h3 className="user-section-title">Current Month Prize</h3>
          </div>
          
          <div className="user-plan-prize-content">
            <div className="user-plan-prize-image-wrapper">
              <img src={planData.currentMonthPrize?.prizeImage} alt={planData.currentMonthPrize?.prizeName} className="user-plan-prize-image" />
            </div>
            
            <div className="user-plan-prize-details">
              <h4 className="user-plan-prize-name">{planData.currentMonthPrize?.prizeName || 'N/A'}</h4>
              
              <div className="user-plan-prize-info-grid">
                <div className="user-plan-prize-info-item">
                  <Award className="user-plan-prize-info-icon" />
                  <span>{planData.currentMonthPrize?.winnerCount || 0} Winners</span>
                </div>
                
                <div className="user-plan-prize-info-item">
                  <Calendar className="user-plan-prize-info-icon" />
                  <span>Month {planData.currentMonthPrize?.month || planData.currentMonth || 0}</span>
                </div>
                
                <div className="user-plan-prize-info-item">
                  <Clock className="user-plan-prize-info-icon" />
                  <span>{formatDate(planData.currentMonthPrize?.drawDate || planData.nextDrawDate || '2026-10-15')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plan Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          key={`info-${selectedTeamId}-${selectedGroupId}`}
          className="user-card-compact user-plan-info-card"
        >
          <h3 className="user-section-title">Plan Information</h3>
          
          <div className="user-plan-info-list">
            <div className="user-plan-info-row">
              <div className="user-plan-info-cell">
                <Building size={18} className="user-plan-info-cell-icon" />
                <span className="user-plan-info-cell-label">Franchise</span>
              </div>
              <span className="user-plan-info-cell-value">{userPlansData.franchiseName}</span>
            </div>
            
            <div className="user-plan-info-row">
              <div className="user-plan-info-cell">
                <IdCard size={18} className="user-plan-info-cell-icon" />
                <span className="user-plan-info-cell-label">Franchise ID</span>
              </div>
              <span className="user-plan-info-cell-value">{userPlansData.franchiseId}</span>
            </div>
            
            <div className="user-plan-info-row">
              <div className="user-plan-info-cell">
                <Calendar size={18} className="user-plan-info-cell-icon" />
                <span className="user-plan-info-cell-label">Registration Date</span>
              </div>
              <span className="user-plan-info-cell-value">{formatDate(planData.registrationDate || '2026-01-15')}</span>
            </div>
            
            <div className="user-plan-info-row">
              <div className="user-plan-info-cell">
                <CheckCircle size={18} className="user-plan-info-cell-icon" />
                <span className="user-plan-info-cell-label">Membership Status</span>
              </div>
              <span className={`user-plan-status-badge ${getStatusColor(planData.membershipStatus || 'PENDING')}`}>
                {planData.membershipStatus || 'PENDING'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserMyPlan;
