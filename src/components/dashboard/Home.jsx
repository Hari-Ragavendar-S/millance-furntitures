import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CustomSelect from '../CustomSelect';
import ConfirmModal from '../ConfirmModal';
import EnrollmentCard from '../EnrollmentCard';
import PayMonthModal from '../PayMonthModal';
import { 
  Wallet, DollarSign, AlertCircle, Sparkles, Trophy, 
  Gift, Calendar, TrendingUp, Users, Award, Clock
} from 'lucide-react';

const Home = () => {
  const { user, refreshUser } = useAuth();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);
  
  // Backend Data State
  const [enrollments, setEnrollments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [drawStatus, setDrawStatus] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Team/Group Selection (using real enrollment data)
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  
  // Enrollment Modal State
  const [enrollModal, setEnrollModal] = useState({
    show: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: null
  });
  const [selectedPlanForEnrollment, setSelectedPlanForEnrollment] = useState(null);
  const [selectedWalletType, setSelectedWalletType] = useState('millance_rewards_wallet');
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showAllPlansModal, setShowAllPlansModal] = useState(false);

  // Payment Modal State
  const [paymentModal, setPaymentModal] = useState({
    show: false,
    enrollment: null,
    loading: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    
    // Poll for live draws every 5 seconds
    const pollingInterval = setInterval(() => {
      checkForLiveDraw();
    }, 5000);
    
    return () => clearInterval(pollingInterval);
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsData, walletData, drawStatusData, plansData] = await Promise.all([
        api.getMyEnrollments(),
        api.getWallet(),
        api.getUserDrawStatus(),
        api.getAllPlans()
      ]);
      setEnrollments(enrollmentsData);
      setWallet(walletData);
      setDrawStatus(drawStatusData);
      setAvailablePlans(plansData);
      
      // Select first active enrollment by default
      const activeEnrollment = enrollmentsData.find(e => e.status === 'active');
      if (activeEnrollment) {
        setSelectedEnrollmentId(activeEnrollment.id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForLiveDraw = async () => {
    try {
      const data = await api.getUserDrawStatus();
      setDrawStatus(data);
    } catch (error) {
      console.error('Failed to check live draw:', error);
    }
  };

  // Get selected enrollment data
  const selectedEnrollment = enrollments.find(e => e.id === selectedEnrollmentId) || enrollments[0];
  const activeEnrollment = enrollments.find(e => e.status === 'active');
  const hasWon = drawStatus?.enrollment_status?.has_won;

  // Current Month Draw Data
  const currentMonthDraw = {
    month: selectedEnrollment?.months_paid + 1 || 1,
    drawDate: drawStatus?.next_draw?.draw_date || '2026-10-15',
    drawTime: drawStatus?.next_draw?.draw_time || '19:00',
    status: 'Upcoming',
    participants: drawStatus?.next_draw?.eligible_users_count || 0
  };

  // Current Month Prizes (from backend or mock)
  const currentMonthPrizes = [
    {
      id: 'PRIZE-1',
      name: drawStatus?.next_draw?.prize_name || '43" LED TV',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
      winners: 1
    },
    {
      id: 'PRIZE-2',
      name: 'Gold Coin 10g',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&h=300&fit=crop',
      winners: 2
    },
    {
      id: 'PRIZE-3',
      name: 'Silver Coin 10g',
      image: 'https://images.unsplash.com/photo-1610375461369-d613b564f6df?w=300&h=300&fit=crop',
      winners: 1
    },
    {
      id: 'PRIZE-4',
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop',
      winners: 1
    }
  ];

  // Border colors for prize cards
  const borderColors = [
    'rgba(255, 105, 180, 0.4)', // Pink
    'rgba(90, 185, 234, 0.4)',  // Blue
    'rgba(186, 85, 211, 0.4)',  // Violet
    'rgba(255, 160, 122, 0.4)', // Orange
    'rgba(0, 206, 209, 0.4)',   // Cyan
    'rgba(72, 209, 204, 0.4)'   // Green
  ];

  // Countdown Timer
  useEffect(() => {
    if (!currentMonthDraw.drawDate) return;
    
    const calculateCountdown = () => {
      const drawDateTime = new Date(`${currentMonthDraw.drawDate}T${currentMonthDraw.drawTime}:00`);
      const now = new Date();
      const diff = drawDateTime - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentMonthDraw.drawDate, currentMonthDraw.drawTime]);

  // KPI Cards with real data
  const kpiCards = [
    { 
      label: 'Total Plan Value', 
      value: `₹${((selectedEnrollment?.months_paid || 0) * 4545).toLocaleString()}`, 
      icon: Wallet, 
      bgColor: 'bg-soft-pink/10'
    },
    { 
      label: 'Paid Amount', 
      value: `₹${(selectedEnrollment?.total_paid || 0).toLocaleString()}`, 
      icon: DollarSign, 
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Pending Amount', 
      value: `₹${((11 - (selectedEnrollment?.months_paid || 0)) * 4545).toLocaleString()}`, 
      icon: AlertCircle, 
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Total Draws', 
      value: '11', 
      icon: Sparkles, 
      bgColor: 'bg-soft-violet/10'
    },
    { 
      label: 'Current Month', 
      value: `Month ${selectedEnrollment?.months_paid + 1 || 1}`, 
      icon: Calendar, 
      bgColor: 'bg-soft-orange/10'
    },
    { 
      label: 'Wins', 
      value: hasWon ? '1' : '0', 
      icon: Trophy, 
      bgColor: 'bg-gold/10'
    },
    { 
      label: 'Rewards Wallet', 
      value: `₹${(wallet?.millance_rewards_wallet || 0).toLocaleString()}`, 
      icon: Gift, 
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Savings Wallet', 
      value: `₹${(wallet?.savings_wallet || 0).toLocaleString()}`, 
      icon: Award, 
      bgColor: 'bg-indigo-50'
    },
    { 
      label: 'Group ID', 
      value: selectedEnrollment?.group_id || 'N/A', 
      icon: Users, 
      bgColor: 'bg-soft-pink/10'
    },
    { 
      label: 'Membership Status', 
      value: selectedEnrollment?.status || 'N/A', 
      icon: TrendingUp, 
      bgColor: 'bg-green-50'
    },
  ];

  const recentActivity = [
    { type: 'payment', title: 'Payment Received', desc: `Month ${selectedEnrollment?.months_paid || 0} - ₹4,545`, date: '2 days ago', icon: DollarSign, color: 'text-green-600' },
    { type: 'draw', title: 'Draw Participated', desc: `Month ${(selectedEnrollment?.months_paid || 1) - 1} Draw`, date: '1 week ago', icon: Sparkles, color: 'text-soft-violet' },
    { type: 'info', title: 'Upcoming Draw', desc: `Month ${selectedEnrollment?.months_paid + 1 || 1} in ${countdown.days} days`, date: `${countdown.days} days`, icon: Calendar, color: 'text-soft-orange' },
  ];

  // Enrollment Functions
  const handleEnrollClick = async (plan) => {
    setSelectedPlanForEnrollment(plan);
    
    // Show loading while fetching groups
    setEnrollModal({
      show: true,
      type: 'loading',
      title: 'Loading Groups',
      message: 'Fetching available groups...'
    });

    try {
      console.log('🔍 Fetching groups for plan:', plan.id);
      
      // Get available groups for this plan
      const groups = await api.getGroupsByPlan(plan.id);
      
      console.log('✅ Received groups:', groups);
      
      if (!groups || groups.length === 0) {
        setEnrollModal({
          show: true,
          type: 'error',
          title: 'No Groups Available',
          message: 'No available groups for this plan. Please try another plan or contact support.',
          onConfirm: () => setEnrollModal({ ...enrollModal, show: false })
        });
        return;
      }

      // Set available groups and select first one by default
      setAvailableGroups(groups);
      setSelectedGroupId(groups[0].id);

      console.log('📋 Available groups set:', groups.length, 'groups');

      // Show enrollment confirmation with group selection
      setEnrollModal({
        show: true,
        type: 'confirm',
        title: 'Enroll in Plan',
        message: `Enrolling in: ${plan.name}\n\nMonthly Amount: ₹${plan.monthly_amount.toLocaleString()}\nDuration: ${plan.duration_months} months\n\nSelect your group and payment wallet:`,
        onConfirm: () => handleEnrollConfirm(plan)
      });
    } catch (error) {
      console.error('❌ Failed to fetch groups:', error);
      setEnrollModal({
        show: true,
        type: 'error',
        title: 'Error Loading Groups',
        message: `Failed to load groups: ${error.message}\n\nPlease check your connection and try again.`,
        onConfirm: () => setEnrollModal({ ...enrollModal, show: false })
      });
    }
  };

  const handleEnrollConfirm = async (plan) => {
    // Validate selections
    if (!selectedGroupId) {
      setEnrollModal({
        show: true,
        type: 'error',
        title: 'Selection Required',
        message: 'Please select a group to enroll in.',
        onConfirm: () => setEnrollModal({ ...enrollModal, show: false })
      });
      return;
    }

    // Show loading
    setEnrollModal({
      show: true,
      type: 'loading',
      title: 'Processing Enrollment',
      message: 'Please wait...'
    });

    try {
      console.log('💰 Checking wallet balance...');
      console.log('Selected wallet:', selectedWalletType);
      console.log('Wallet data:', wallet);
      
      // Check wallet balance
      const currentWallet = wallet?.[selectedWalletType] || 0;
      
      console.log('Current balance:', currentWallet);
      console.log('Required amount:', plan.monthly_amount);
      
      if (currentWallet < plan.monthly_amount) {
        setEnrollModal({
          show: true,
          type: 'error',
          title: 'Insufficient Balance',
          message: `Your ${selectedWalletType === 'millance_rewards_wallet' ? 'Millance Rewards' : 'Savings'} Wallet has ₹${currentWallet.toLocaleString()}.\n\nRequired: ₹${plan.monthly_amount.toLocaleString()}\n\nPlease add funds to your wallet first.`,
          onConfirm: () => {
            setEnrollModal({ ...enrollModal, show: false });
            window.location.hash = '#wallet';
          }
        });
        return;
      }

      // Get selected group details
      const selectedGroup = availableGroups.find(g => g.id === selectedGroupId);

      console.log('🎯 Enrolling user...');
      console.log('Plan ID:', plan.id);
      console.log('Group ID:', selectedGroupId);
      console.log('Wallet Type:', selectedWalletType);

      // Enroll user
      const enrollmentResult = await api.enrollInPlan(plan.id, selectedGroupId, selectedWalletType);
      
      console.log('✅ Enrollment successful:', enrollmentResult);

      // Refresh data
      await loadData();
      await refreshUser();

      // Show success
      setEnrollModal({
        show: true,
        type: 'success',
        title: '🎉 Welcome to the Group!',
        message: `Successfully joined Group ${selectedGroup?.group_id || selectedGroup?.group_name || 'N/A'}!\n\n${plan.name}\nMonthly: ₹${plan.monthly_amount.toLocaleString()}\nDuration: ${plan.duration_months} months\n\n✨ You're now eligible for monthly draws!`,
        onConfirm: () => {
          setEnrollModal({ ...enrollModal, show: false });
          window.location.hash = '#draw';
        }
      });
    } catch (error) {
      console.error('❌ Enrollment error:', error);
      
      // Extract error message properly
      let errorMessage = 'Failed to enroll in plan. Please try again or contact support.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setEnrollModal({
        show: true,
        type: 'error',
        title: 'Enrollment Failed',
        message: errorMessage,
        onConfirm: () => setEnrollModal({ ...enrollModal, show: false })
      });
    }
  };

  // Payment Handlers
  const handlePayMonth = (enrollment) => {
    setPaymentModal({
      show: true,
      enrollment,
      loading: false
    });
  };

  const handleConfirmPayment = async () => {
    const { enrollment } = paymentModal;
    if (!enrollment) return;

    setPaymentModal({ ...paymentModal, loading: true });

    try {
      const plan = availablePlans.find(p => p.id === enrollment.plan_id);
      const nextMonth = enrollment.months_paid + 1;

      // Call API to process payment
      await api.payMonth(enrollment.id, {
        month: nextMonth,
        wallet_type: 'millance_rewards_wallet'
      });

      // Close modal
      setPaymentModal({ show: false, enrollment: null, loading: false });

      // Show success with confetti
      setEnrollModal({
        show: true,
        type: 'success',
        title: '✅ Payment Successful!',
        message: `Month ${nextMonth} paid successfully!\n\n✓ ₹${plan.monthly_amount.toLocaleString()} deducted from Millance Wallet\n✓ ₹${plan.monthly_amount.toLocaleString()} added to Savings Wallet\n✓ Eligible for Month ${nextMonth} draw!`,
        onConfirm: () => {
          setEnrollModal({ ...enrollModal, show: false });
          loadData(); // Refresh data
          refreshUser(); // Refresh user wallet
        }
      });
    } catch (error) {
      console.error('❌ Payment error:', error);
      setPaymentModal({ ...paymentModal, loading: false });
      
      // Extract error message properly
      let errorMessage = 'Failed to process payment. Please try again.';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        // Handle array of errors (FastAPI validation errors)
        if (Array.isArray(detail)) {
          errorMessage = detail.map(err => {
            if (typeof err === 'string') return err;
            if (err.msg) return err.msg;
            if (err.message) return err.message;
            return JSON.stringify(err);
          }).join('\n');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else {
          errorMessage = JSON.stringify(detail);
        }
      } else if (error.message && error.message !== '[object Object]') {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setEnrollModal({
        show: true,
        type: 'error',
        title: 'Payment Failed',
        message: errorMessage,
        onConfirm: () => setEnrollModal({ ...enrollModal, show: false })
      });
    }
  };

  const handleAddMoney = () => {
    navigate('/add-money');
  };

  if (loading) {
    return (
      <div className="user-dashboard-compact">
        <div className="loading-container" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading dashboard...</p>
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
        {/* LIVE DRAW BANNER */}
        {drawStatus?.live_draw && (
          <div 
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  color: 'white',
                  animation: 'spin 2s linear infinite'
                }} 
              />
              <div>
                <h3 style={{ 
                  color: 'white', 
                  margin: 0, 
                  fontSize: '18px', 
                  fontWeight: '700' 
                }}>
                  🔴 DRAW LIVE NOW!
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  margin: 0, 
                  fontSize: '13px' 
                }}>
                  Month {drawStatus.live_draw.month_number} draw in progress
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.hash = '#draw'}
              style={{
                background: 'white',
                color: '#EF4444',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Watch Live
            </button>
          </div>
        )}

        {/* Compact Welcome Header */}
        <div className="user-welcome-compact">
          <div>
            <h1 className="user-welcome-title">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h1>
            <p className="user-welcome-subtitle">
              Member ID: {user?.mld_id} • Group: {selectedEnrollment?.group_id || 'N/A'}
            </p>
          </div>
          <div className="user-next-draw-badge">
            <span className="user-badge-label">Next Draw</span>
            <span className="user-badge-value">{countdown.days} Days</span>
          </div>
        </div>

        {/* MY ACTIVE PLANS - Payment Section */}
        {enrollments.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '0 4px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                margin: 0,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Trophy style={{ width: '20px', height: '20px', color: '#8B5CF6' }} />
                My Active Plans
              </h2>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {enrollments.filter(e => e.status === 'active').length} Active
              </div>
            </div>

            {/* Enrollment Cards - Horizontal Scroll */}
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: '16px',
              WebkitOverflowScrolling: 'touch'
            }}>
              {enrollments.map(enrollment => {
                const plan = availablePlans.find(p => p.id === enrollment.plan_id);
                const nextDraw = drawStatus?.all_scheduled_draws?.find(
                  d => d.group_id === enrollment.group_id
                );
                
                if (!plan) return null;

                return (
                  <div
                    key={enrollment.id}
                    style={{
                      minWidth: '280px',
                      maxWidth: '320px',
                      flex: '0 0 auto'
                    }}
                  >
                    <EnrollmentCard
                      enrollment={enrollment}
                      plan={plan}
                      nextDraw={nextDraw}
                      onPayMonth={handlePayMonth}
                      onAddMoney={handleAddMoney}
                      walletBalance={wallet?.millance_rewards_wallet || 0}
                    />
                  </div>
                );
              })}
            </div>

            {/* Scroll hint */}
            {enrollments.length > 1 && (
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                marginTop: '4px'
              }}>
                {enrollments.length} plan{enrollments.length > 1 ? 's' : ''} • Scroll horizontally →
              </div>
            )}
          </div>
        )}

        {/* Compact Current Month Draw - HERO SECTION */}
        <div className="user-card-compact user-draw-card">
          <div className="user-draw-header">
            <Sparkles className="user-draw-icon" />
            <div className="flex-1">
              <h2 className="user-draw-title">Current Month Draw</h2>
              <p className="user-draw-meta">Month {currentMonthDraw.month}</p>
            </div>
          </div>

          {/* Enrollment Selector (if multiple enrollments) */}
          {enrollments.length > 1 && (
            <div className="user-team-group-selectors">
              <CustomSelect
                value={selectedEnrollmentId}
                onChange={(e) => setSelectedEnrollmentId(parseInt(e.target.value))}
                options={enrollments.map(enrollment => ({
                  value: enrollment.id,
                  label: `Group ${enrollment.group_id} - Month ${enrollment.months_paid + 1}`
                }))}
                label="Select Enrollment"
                type="team"
              />
            </div>
          )}

          {/* Selected Info Display */}
          <div className="user-selected-info">
            Group {selectedEnrollment?.group_id} • Month {currentMonthDraw.month} • {currentMonthDraw.participants} Participants
          </div>

          <div className="user-draw-info-grid">
            <div className="user-draw-info-item">
              <Calendar className="user-info-icon" />
              <div>
                <span className="user-info-label">Draw Date</span>
                <span className="user-info-value">
                  {new Date(currentMonthDraw.drawDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="user-draw-info-item">
              <Clock className="user-info-icon" />
              <div>
                <span className="user-info-label">Draw Time</span>
                <span className="user-info-value">
                  {new Date(`2000-01-01T${currentMonthDraw.drawTime}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Compact Countdown */}
          <div className="user-countdown-compact">
            <div className="user-countdown-box">
              <span className="user-countdown-num">{String(countdown.days).padStart(2, '0')}</span>
              <span className="user-countdown-label">Days</span>
            </div>
            <div className="user-countdown-box">
              <span className="user-countdown-num">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="user-countdown-label">Hours</span>
            </div>
            <div className="user-countdown-box">
              <span className="user-countdown-num">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="user-countdown-label">Min</span>
            </div>
            <div className="user-countdown-box">
              <span className="user-countdown-num">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="user-countdown-label">Sec</span>
            </div>
          </div>
        </div>

        {/* This Month's Prizes - Continuous Single Row Marquee */}
        <div className="user-prizes-section">
          <div className="user-prizes-header">
            <h3 className="user-prizes-title">This Month's Prizes</h3>
          </div>

          {/* Single Row Marquee for All Screen Sizes */}
          <div className="user-prizes-marquee-container">
            <div className="user-marquee-track user-marquee-rtl">
              {/* Duplicate prizes for seamless loop */}
              {[...currentMonthPrizes, ...currentMonthPrizes].map((prize, index) => (
                <div 
                  key={`${prize.id}-${index}`} 
                  className="user-prize-card-marquee"
                  style={{ 
                    borderColor: borderColors[index % borderColors.length],
                    boxShadow: `0 2px 8px ${borderColors[index % borderColors.length].replace('0.4', '0.15')}`
                  }}
                >
                  <div className="user-prize-image-wrapper">
                    <img 
                      src={prize.image} 
                      alt={prize.name}
                      className="user-prize-image"
                    />
                  </div>
                  <div className="user-prize-info">
                    <h4 className="user-prize-name">{prize.name}</h4>
                    <p className="user-prize-qty">{prize.winners} Winners</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compact KPI Grid */}
        <div className="user-kpi-grid">
          {kpiCards.map((card, index) => (
            <div key={index} className="user-kpi-card-compact">
              <card.icon className="user-kpi-icon" />
              <div className="user-kpi-content">
                <span className="user-kpi-value">{card.value}</span>
                <span className="user-kpi-label">{card.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* AVAILABLE GROUPS - Show groups from all plans */}
        <div style={{ marginBottom: 'clamp(20px, 5vw, 24px)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'clamp(12px, 3vw, 16px)',
            padding: '0 4px'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(18px, 5vw, 20px)', 
              fontWeight: '700', 
              margin: 0,
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(8px, 2vw, 10px)'
            }}>
              <Users style={{ width: 'clamp(20px, 5vw, 22px)', height: 'clamp(20px, 5vw, 22px)', color: '#8B5CF6' }} />
              Increase Your Luck!
            </h2>
          </div>
          
          <p style={{
            fontSize: 'clamp(13px, 3.5vw, 14px)',
            color: '#666',
            marginBottom: 'clamp(16px, 4vw, 20px)',
            padding: '0 4px',
            lineHeight: '1.5'
          }}>
            Enroll in more groups to multiply your winning chances
          </p>

          {/* Groups List - Horizontal Scroll */}
          <div style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 16px)',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '16px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin'
          }}>
            {availablePlans.slice(0, 4).map((plan) => {
              const userEnrollment = enrollments.find(e => e.plan_id === plan.id);
              const hasWon = userEnrollment?.has_won_prize;
              
              return (
                <div
                  key={plan.id}
                  style={{
                    minWidth: 'clamp(260px, 70vw, 320px)',
                    maxWidth: 'clamp(280px, 75vw, 340px)',
                    flex: '0 0 auto',
                    background: 'white',
                    borderRadius: 'clamp(14px, 4vw, 16px)',
                    padding: 'clamp(16px, 4vw, 20px)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Winner Badge */}
                  {hasWon && (
                    <div style={{
                      position: 'absolute',
                      top: 'clamp(10px, 2.5vw, 12px)',
                      right: 'clamp(10px, 2.5vw, 12px)',
                      background: 'linear-gradient(135deg, #10B981, #34D399)',
                      color: 'white',
                      padding: 'clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px)',
                      borderRadius: 'clamp(16px, 4vw, 20px)',
                      fontSize: 'clamp(10px, 2.8vw, 11px)',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(3px, 1vw, 4px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      zIndex: 10,
                      animation: 'pulse 2s ease-in-out infinite',
                      whiteSpace: 'nowrap'
                    }}>
                      <Trophy style={{ width: 'clamp(12px, 3.5vw, 14px)', height: 'clamp(12px, 3.5vw, 14px)', flexShrink: 0 }} />
                      YOU WON!
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                    color: 'white',
                    padding: 'clamp(3px, 1vw, 4px) clamp(10px, 2.5vw, 12px)',
                    borderRadius: 'clamp(10px, 2.5vw, 12px)',
                    fontSize: 'clamp(10px, 2.8vw, 11px)',
                    fontWeight: '600',
                    marginBottom: 'clamp(10px, 2.5vw, 12px)'
                  }}>
                    {plan.status === 'active' ? 'Active' : 'Available'}
                  </div>

                  {/* Group Title - Make it prominent */}
                  <h3 style={{
                    fontSize: 'clamp(17px, 4.5vw, 18px)',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: 'clamp(6px, 1.5vw, 8px)',
                    lineHeight: '1.3'
                  }}>
                    {plan.name} Groups
                  </h3>
                  
                  <p style={{
                    fontSize: 'clamp(12px, 3.2vw, 13px)',
                    color: '#666',
                    marginBottom: 'clamp(14px, 3.5vw, 16px)',
                    lineHeight: '1.4'
                  }}>
                    Join a group and start winning prizes!
                  </p>

                  {/* Plan Details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(8px, 2vw, 10px)',
                    marginBottom: 'clamp(14px, 3.5vw, 16px)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(12px, 3.2vw, 13px)',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#666', flexShrink: 0 }}>Monthly Amount:</span>
                      <span style={{ fontWeight: '600', color: '#1a1a1a', textAlign: 'right' }}>
                        ₹{plan.monthly_amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(12px, 3.2vw, 13px)',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#666', flexShrink: 0 }}>Duration:</span>
                      <span style={{ fontWeight: '600', color: '#1a1a1a', textAlign: 'right' }}>
                        {plan.duration_months} Months
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(12px, 3.2vw, 13px)',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#666', flexShrink: 0 }}>Available Groups:</span>
                      <span style={{ 
                        fontWeight: '600',
                        color: plan.current_members >= plan.max_members ? '#EF4444' : '#10B981',
                        textAlign: 'right'
                      }}>
                        {plan.max_members > plan.current_members ? 'Open' : 'Limited'}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {userEnrollment ? (
                    <button
                      onClick={() => handleEnrollClick(plan)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'clamp(10px, 2.5vw, 12px)',
                        padding: 'clamp(10px, 2.5vw, 12px)',
                        fontSize: 'clamp(13px, 3.5vw, 14px)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Join Another Group
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnrollClick(plan)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'clamp(10px, 2.5vw, 12px)',
                        padding: 'clamp(10px, 2.5vw, 12px)',
                        fontSize: 'clamp(13px, 3.5vw, 14px)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Join a Group Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll hint */}
          {availablePlans.length > 1 && (
            <div style={{
              textAlign: 'center',
              fontSize: 'clamp(10px, 2.8vw, 11px)',
              color: '#999',
              marginTop: '8px'
            }}>
              {availablePlans.length} plan{availablePlans.length > 1 ? 's' : ''} available • Scroll horizontally →
            </div>
          )}

          {/* View All Link */}
          {availablePlans.length > 4 && (
            <div style={{
              textAlign: 'center',
              marginTop: 'clamp(12px, 3vw, 16px)'
            }}>
              <button
                onClick={() => setShowAllPlansModal(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8B5CF6',
                  fontSize: 'clamp(13px, 3.5vw, 14px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(5px, 1.5vw, 6px)',
                  margin: '0 auto',
                  padding: 'clamp(8px, 2vw, 10px)',
                  minHeight: '44px'
                }}
              >
                View All Groups →
              </button>
            </div>
          )}
        </div>

        {/* Compact Two Column Layout */}
        <div className="user-two-col-grid">
          {/* Recent Activity */}
          <div className="user-card-compact">
            <h3 className="user-section-title">Recent Activity</h3>
            <div className="user-activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="user-activity-item">
                  <div className={`user-activity-icon ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="user-activity-content">
                    <h4 className="user-activity-title">{activity.title}</h4>
                    <p className="user-activity-desc">{activity.desc}</p>
                  </div>
                  <span className="user-activity-date">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="user-card-compact">
            <h3 className="user-section-title">Quick Actions</h3>
            <div className="user-actions-list">
              <a href="#draw" className="user-action-item user-action-purple">
                <Sparkles className="w-4 h-4" />
                <div>
                  <p className="user-action-title">View Draws</p>
                  <p className="user-action-subtitle">Check draw status</p>
                </div>
              </a>

              <a href="#rewards" className="user-action-item user-action-pink">
                <Gift className="w-4 h-4" />
                <div>
                  <p className="user-action-title">My Rewards</p>
                  <p className="user-action-subtitle">Check rewards</p>
                </div>
              </a>

              <a href="#wallet" className="user-action-item user-action-blue">
                <DollarSign className="w-4 h-4" />
                <div>
                  <p className="user-action-title">Wallet</p>
                  <p className="user-action-subtitle">View balance</p>
                </div>
              </a>

              <a href="#profile" className="user-action-item user-action-cyan">
                <Calendar className="w-4 h-4" />
                <div>
                  <p className="user-action-title">My Plan</p>
                  <p className="user-action-subtitle">View details</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Compact Payment Progress */}
        <div className="user-card-compact">
          <h3 className="user-section-title">Payment Progress</h3>
          <div className="user-progress-info">
            <span className="user-progress-label">Total Progress</span>
            <span className="user-progress-percent">{Math.round(((selectedEnrollment?.months_paid || 0) / 11) * 100)}%</span>
          </div>
          <div className="user-progress-bar-wrapper">
            <div className="user-progress-bar" style={{ width: `${((selectedEnrollment?.months_paid || 0) / 11) * 100}%` }}></div>
          </div>
          <p className="user-progress-text">
            ₹{(selectedEnrollment?.total_paid || 0).toLocaleString()} of ₹{(11 * 4545).toLocaleString()} paid
          </p>
        </div>



        {/* My Prize History */}
        {drawStatus?.my_results && drawStatus.my_results.length > 0 && (
          <div className="user-card-compact" style={{ marginTop: '20px' }}>
            <h3 className="user-section-title" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Trophy style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
              My Prize History
            </h3>
            
            {/* Mobile Responsive Table */}
            <div style={{ 
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
                minWidth: '500px'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
                    borderBottom: '2px solid #D1D5DB'
                  }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>Month</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>Status</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>Winner</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>Prize</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#1a1a1a'
                    }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {drawStatus.my_results.map((result, index) => (
                    <tr 
                      key={index}
                      style={{
                        borderBottom: '1px solid #E5E7EB',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{
                        padding: '12px',
                        fontWeight: '500',
                        color: '#1a1a1a'
                      }}>
                        Month {result.month}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: result.status === 'won' 
                            ? 'linear-gradient(135deg, #10B981, #059669)' 
                            : '#F3F4F6',
                          color: result.status === 'won' ? 'white' : '#6B7280'
                        }}>
                          {result.status === 'won' ? '🏆 WON' : 'Lost'}
                        </span>
                      </td>
                      <td style={{
                        padding: '12px',
                        color: '#666',
                        fontSize: '13px'
                      }}>
                        {result.winner_mld_id || '-'}
                      </td>
                      <td style={{
                        padding: '12px',
                        color: '#1a1a1a',
                        fontWeight: result.status === 'won' ? '600' : '400'
                      }}>
                        {result.prize_name || '-'}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: result.status === 'won' ? '700' : '400',
                        color: result.status === 'won' ? '#10B981' : '#666',
                        fontSize: result.status === 'won' ? '15px' : '14px'
                      }}>
                        {result.prize_amount ? `₹${result.prize_amount.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Visible only on very small screens) */}
            <div style={{
              display: 'none'
            }} className="mobile-prize-cards">
              {drawStatus.my_results.map((result, index) => (
                <div 
                  key={index}
                  style={{
                    background: result.status === 'won' 
                      ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
                      : '#F9FAFB',
                    border: result.status === 'won' 
                      ? '2px solid #10B981'
                      : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#1a1a1a'
                    }}>
                      Month {result.month}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: result.status === 'won' 
                        ? 'linear-gradient(135deg, #10B981, #059669)' 
                        : '#E5E7EB',
                      color: result.status === 'won' ? 'white' : '#6B7280'
                    }}>
                      {result.status === 'won' ? '🏆 WON' : 'Lost'}
                    </span>
                  </div>
                  
                  {result.status === 'won' && (
                    <>
                      <div style={{
                        fontSize: '14px',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        {result.prize_name}
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#10B981'
                      }}>
                        ₹{result.prize_amount?.toLocaleString()}
                      </div>
                    </>
                  )}
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '8px'
                  }}>
                    Winner: {result.winner_mld_id || '-'}
                  </div>
                </div>
              ))}
            </div>

            {/* CSS for mobile cards */}
            <style>{`
              @media (max-width: 640px) {
                .mobile-prize-cards {
                  display: block !important;
                }
                .mobile-prize-cards + div > table {
                  display: none;
                }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {enrollModal.show && enrollModal.type !== 'confirm' && (
        <ConfirmModal
          isOpen={enrollModal.show}
          type={enrollModal.type}
          title={enrollModal.title}
          message={enrollModal.message}
          onConfirm={enrollModal.onConfirm || (() => setEnrollModal({ ...enrollModal, show: false }))}
          onClose={() => setEnrollModal({ ...enrollModal, show: false })}
        />
      )}

      {/* Custom Enrollment Confirmation Modal with Form */}
      {enrollModal.show && enrollModal.type === 'confirm' && selectedPlanForEnrollment && availableGroups.length > 0 && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setEnrollModal({ ...enrollModal, show: false })}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <Trophy style={{ width: '32px', height: '32px', color: 'white' }} />
              </div>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a1a1a',
              textAlign: 'center',
              margin: '0 0 12px'
            }}>
              {enrollModal.title}
            </h2>

            {/* Message */}
            <p style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center',
              margin: '0 0 24px',
              whiteSpace: 'pre-line'
            }}>
              {enrollModal.message}
            </p>

            {/* Group Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1a1a1a'
              }}>
                Select Group:
              </label>
              <select
                value={selectedGroupId || ''}
                onChange={(e) => setSelectedGroupId(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F472B6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              >
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name} - {group.current_members}/{group.max_members} members
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1a1a1a'
              }}>
                Payment Wallet:
              </label>
              <select
                value={selectedWalletType}
                onChange={(e) => setSelectedWalletType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F472B6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              >
                <option value="millance_rewards_wallet">
                  Millance Rewards Wallet (₹{(wallet?.millance_rewards_wallet || 0).toLocaleString()})
                </option>
                <option value="savings_wallet">
                  Savings Wallet (₹{(wallet?.savings_wallet || 0).toLocaleString()})
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setEnrollModal({ ...enrollModal, show: false })}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#F3F4F6',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#E5E7EB'}
                onMouseOut={(e) => e.currentTarget.style.background = '#F3F4F6'}
              >
                Cancel
              </button>
              <button
                onClick={enrollModal.onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(236, 72, 153, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
                }}
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Plans Modal */}
      {showAllPlansModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setShowAllPlansModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px solid #F3F4F6'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#1a1a1a',
                  margin: '0 0 4px'
                }}>
                  All Available Plans
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  margin: 0
                }}>
                  Choose a plan to increase your winning chances
                </p>
              </div>
              <button
                onClick={() => setShowAllPlansModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {/* Plans Grid */}
            <div style={{ 
              display: 'grid', 
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
            }}>
              {availablePlans.map((plan) => (
                <div 
                  key={plan.id}
                  style={{
                    background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '2px solid #E5E7EB',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#F472B6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: '#1a1a1a',
                    margin: '0 0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Trophy style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                    {plan.name}
                  </h3>
                  
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Monthly Amount:</span>
                      <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '16px' }}>
                        ₹{plan.monthly_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Duration:</span>
                      <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                        {plan.duration_months} Months
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Value:</span>
                      <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                        ₹{(plan.monthly_amount * plan.duration_months).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Available Slots:</span>
                      <span style={{ 
                        fontWeight: '700', 
                        color: plan.max_members - plan.current_members > 10 ? '#10B981' : '#F59E0B',
                        fontSize: '15px'
                      }}>
                        {plan.max_members - plan.current_members}/{plan.max_members}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#E5E7EB',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: `${(plan.current_members / plan.max_members) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #F472B6, #EC4899)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowAllPlansModal(false);
                      handleEnrollClick(plan);
                    }}
                    disabled={plan.max_members <= plan.current_members}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: plan.max_members <= plan.current_members 
                        ? '#E5E7EB' 
                        : 'linear-gradient(135deg, #F472B6, #EC4899)',
                      color: plan.max_members <= plan.current_members ? '#9CA3AF' : 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: plan.max_members <= plan.current_members ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (plan.max_members > plan.current_members) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {plan.max_members <= plan.current_members ? 'FULL' : 'Enroll Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Month Modal */}
      <PayMonthModal
        isOpen={paymentModal.show}
        onClose={() => setPaymentModal({ show: false, enrollment: null, loading: false })}
        onConfirm={handleConfirmPayment}
        enrollment={paymentModal.enrollment}
        plan={paymentModal.enrollment ? availablePlans.find(p => p.id === paymentModal.enrollment.plan_id) : null}
        walletBalance={wallet?.millance_rewards_wallet || 0}
        loading={paymentModal.loading}
      />
    </>
  );
};

export default Home;
