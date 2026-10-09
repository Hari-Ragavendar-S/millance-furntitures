import { useState, useEffect, useRef } from 'react';
import UserLayout from '../../layouts/UserLayout';
import CustomSelect from '../../components/CustomSelect';
import { 
  Wallet, DollarSign, AlertCircle, Sparkles, Trophy, 
  Gift, Calendar, TrendingUp, Users, Award, Clock
} from 'lucide-react';

const UserDashboard = () => {
  const prizeScrollRef = useRef(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Team/Group Selection State
  const [selectedTeam, setSelectedTeam] = useState('TEAM-1');
  const [selectedGroup, setSelectedGroup] = useState('GROUP-A');

  // Mock user data - in real app, get from auth context
  const userData = {
    name: 'Rajesh Kumar',
    memberId: 'ML001',
    franchiseId: 'FRAN-001',
    currentMonth: 5,
    // User may belong to multiple teams
    availableTeams: [
      { id: 'TEAM-1', name: 'Team 1' },
      { id: 'TEAM-2', name: 'Team 2' }
    ],
    // Groups per team
    teamGroups: {
      'TEAM-1': [
        { id: 'GROUP-A', name: 'Group A' },
        { id: 'GROUP-B', name: 'Group B' },
        { id: 'GROUP-C', name: 'Group C' }
      ],
      'TEAM-2': [
        { id: 'GROUP-D', name: 'Group D' },
        { id: 'GROUP-E', name: 'Group E' }
      ]
    }
  };
  
  // Get current team and group names
  const currentTeam = userData.availableTeams.find(t => t.id === selectedTeam)?.name || 'Team 1';
  const currentGroup = userData.teamGroups[selectedTeam]?.find(g => g.id === selectedGroup)?.name || 'Group A';
  
  // Get available groups for selected team
  const availableGroups = userData.teamGroups[selectedTeam] || [];
  
  // Handle team change - reset group to first available
  const handleTeamChange = (e) => {
    const newTeam = e.target.value;
    setSelectedTeam(newTeam);
    // Reset group to first available group in new team
    const firstGroup = userData.teamGroups[newTeam]?.[0]?.id;
    if (firstGroup) {
      setSelectedGroup(firstGroup);
    }
  };

  // Current Month Draw Data - Dynamic based on selected Team/Group
  const currentMonthDraw = {
    franchiseId: userData.franchiseId,
    teamId: selectedTeam,
    team: currentTeam,
    groupId: selectedGroup,
    group: currentGroup,
    month: userData.currentMonth,
    drawDate: '2026-10-15',
    drawTime: '19:00',
    status: 'Upcoming',
    participants: 120
  };

  // Current Month Prizes - Multiple prizes for the user's team/group/month
  const currentMonthPrizes = [
    {
      id: 'PRIZE-1',
      name: '43" LED TV',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop',
      quantity: 2,
      winners: 2
    },
    {
      id: 'PRIZE-2',
      name: 'Gold Coin 10g',
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300&h=300&fit=crop',
      quantity: 5,
      winners: 5
    },
    {
      id: 'PRIZE-3',
      name: 'Silver Coin 10g',
      image: 'https://images.unsplash.com/photo-1610375461369-d613b564f6df?w=300&h=300&fit=crop',
      quantity: 3,
      winners: 3
    },
    {
      id: 'PRIZE-4',
      name: 'Washing Machine',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop',
      quantity: 2,
      winners: 2
    },
    {
      id: 'PRIZE-5',
      name: 'Premium Sofa Set',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      quantity: 1,
      winners: 1
    },
    {
      id: 'PRIZE-6',
      name: 'Double Door Refrigerator',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop',
      quantity: 2,
      winners: 2
    },
    {
      id: 'PRIZE-7',
      name: 'Wooden Bed King Size',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=300&h=300&fit=crop',
      quantity: 1,
      winners: 1
    },
    {
      id: 'PRIZE-8',
      name: '3-Door Wardrobe',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop',
      quantity: 1,
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

  const kpiCards = [
    { 
      label: 'Total Plan Value', 
      value: '₹50,000', 
      icon: Wallet, 
      gradient: 'from-soft-pink to-soft-rose',
      bgColor: 'bg-soft-pink/10'
    },
    { 
      label: 'Paid Amount', 
      value: '₹30,000', 
      icon: DollarSign, 
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Pending Amount', 
      value: '₹20,000', 
      icon: AlertCircle, 
      gradient: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Total Draws', 
      value: '11', 
      icon: Sparkles, 
      gradient: 'from-soft-violet to-soft-blue',
      bgColor: 'bg-soft-violet/10'
    },
    { 
      label: 'Upcoming Draw', 
      value: 'Month 5', 
      icon: Calendar, 
      gradient: 'from-soft-orange to-soft-red',
      bgColor: 'bg-soft-orange/10'
    },
    { 
      label: 'Wins', 
      value: '0', 
      icon: Trophy, 
      gradient: 'from-gold to-soft-orange',
      bgColor: 'bg-gold/10'
    },
    { 
      label: 'Total Rewards', 
      value: '₹0', 
      icon: Gift, 
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Redeemed Rewards', 
      value: '₹0', 
      icon: Award, 
      gradient: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      label: 'Current Team', 
      value: userData.team, 
      icon: Users, 
      gradient: 'from-soft-pink to-soft-rose',
      bgColor: 'bg-soft-pink/10'
    },
    { 
      label: 'Membership Status', 
      value: 'Active', 
      icon: TrendingUp, 
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  const recentActivity = [
    { type: 'payment', title: 'Payment Received', desc: 'Month 4 - ₹5,000', date: '2 days ago', icon: DollarSign, color: 'text-green-600' },
    { type: 'draw', title: 'Draw Participated', desc: 'Month 3 Draw', date: '1 week ago', icon: Sparkles, color: 'text-soft-violet' },
    { type: 'info', title: 'Upcoming Draw', desc: 'Month 5 in 15 days', date: '15 days', icon: Calendar, color: 'text-soft-orange' },
  ];

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
        {/* Compact Welcome Header */}
        <div className="user-welcome-compact">
          <div>
            <h1 className="user-welcome-title">Welcome back, {userData.name}</h1>
            <p className="user-welcome-subtitle">
              Member ID: {userData.memberId} • {userData.team} • {userData.group}
            </p>
          </div>
          <div className="user-next-draw-badge">
            <span className="user-badge-label">Next Draw</span>
            <span className="user-badge-value">15 Days</span>
          </div>
        </div>

        {/* Compact Current Month Draw - HERO SECTION */}
        <div className="user-card-compact user-draw-card">
          <div className="user-draw-header">
            <Sparkles className="user-draw-icon" />
            <div className="flex-1">
              <h2 className="user-draw-title">Current Month Draw</h2>
              <p className="user-draw-meta">Month {currentMonthDraw.month}</p>
            </div>
          </div>

          {/* Team/Group Selectors */}
          <div className="user-team-group-selectors">
            <CustomSelect
              value={selectedTeam}
              onChange={handleTeamChange}
              options={userData.availableTeams.map(team => ({
                value: team.id,
                label: team.name
              }))}
              label="Team"
              type="team"
            />

            <CustomSelect
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              options={availableGroups.map(group => ({
                value: group.id,
                label: group.name
              }))}
              label="Group"
              type="group"
            />
          </div>

          {/* Selected Info Display */}
          <div className="user-selected-info">
            {currentMonthDraw.team} • {currentMonthDraw.group} • Month {currentMonthDraw.month}
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
              <a href="/user/draws" className="user-action-item user-action-purple">
                <Sparkles className="w-4 h-4" />
                <div>
                  <p className="user-action-title">View Draws</p>
                  <p className="user-action-subtitle">Check draw status</p>
                </div>
              </a>

              <a href="/user/vault" className="user-action-item user-action-pink">
                <Gift className="w-4 h-4" />
                <div>
                  <p className="user-action-title">My Vault</p>
                  <p className="user-action-subtitle">Check rewards</p>
                </div>
              </a>

              <a href="/user/payments" className="user-action-item user-action-blue">
                <DollarSign className="w-4 h-4" />
                <div>
                  <p className="user-action-title">Payments</p>
                  <p className="user-action-subtitle">View history</p>
                </div>
              </a>

              <a href="/user/my-plan" className="user-action-item user-action-cyan">
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
            <span className="user-progress-percent">60%</span>
          </div>
          <div className="user-progress-bar-wrapper">
            <div className="user-progress-bar" style={{ width: '60%' }}></div>
          </div>
          <p className="user-progress-text">₹30,000 of ₹50,000 paid</p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
