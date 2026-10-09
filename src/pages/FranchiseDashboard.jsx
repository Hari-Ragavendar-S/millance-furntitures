import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/FranchiseDashboard.css';

const FranchiseDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [prizePools, setPrizePools] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [franchiseInfo, setFranchiseInfo] = useState(null);

  useEffect(() => {
    loadData();
    loadFranchiseInfo();
  }, []);

  const loadFranchiseInfo = async () => {
    try {
      const info = await api.request('/franchise/me');
      setFranchiseInfo(info);
      // Update localStorage with fresh data including franchise_slug
      const currentUserData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const updatedUserData = { ...currentUserData, ...info };
      localStorage.setItem('user_data', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Failed to load franchise info:', error);
    }
  };

  const loadData = async () => {
    try {
      const [poolsData, groupsData, statsData, plansData] = await Promise.all([
        api.getFranchisePrizePools(),
        api.getFranchiseGroups(),
        api.getFranchiseStats(),
        api.getFranchisePlans()
      ]);
      setPrizePools(poolsData);
      setGroups(groupsData);
      setStats(statsData);
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/franchise');
  };

  const openModal = (type) => {
    setModalType(type);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="franchise-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="franchise-brand">
            <div className="logo-icon">MLD</div>
            <div>
              <h1>{user?.franchise_name || 'Franchise Dashboard'}</h1>
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'prizes' ? 'active' : ''}`}
          onClick={() => setActiveTab('prizes')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Prize Pools
        </button>
        <button 
          className={`nav-tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Plans
        </button>
        <button 
          className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Groups
        </button>
        <button 
          className={`nav-tab ${activeTab === 'draws' ? 'active' : ''}`}
          onClick={() => setActiveTab('draws')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Draws
          <span className="new-badge">NEW</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Referrals
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && <OverviewTab groups={groups} prizePools={prizePools} stats={stats} />}
        {activeTab === 'prizes' && <PrizesTab prizePools={prizePools} onRefresh={loadData} onCreateNew={() => openModal('prize')} />}
        {activeTab === 'plans' && <PlansTab plans={plans} prizePools={prizePools} onRefresh={loadData} onCreateNew={() => openModal('plan')} />}
        {activeTab === 'groups' && <GroupsTab groups={groups} plans={plans} onRefresh={loadData} onCreateNew={() => openModal('group')} />}
        {activeTab === 'draws' && <DrawsTab groups={groups} onRefresh={loadData} />}
        {activeTab === 'referrals' && <ReferralsTab user={franchiseInfo || user} groups={groups} />}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal 
          type={modalType} 
          prizePools={prizePools}
          plans={plans}
          onClose={() => setShowCreateModal(false)} 
          onSuccess={loadData} 
        />
      )}
    </div>
  );
};

const OverviewTab = ({ groups, prizePools, stats }) => {
  const totalMembers = stats?.total_members || 0;
  const totalGroups = stats?.total_groups || 0;
  const activePrizePools = stats?.total_plans || 0;
  const totalRevenue = stats?.total_revenue || 0;

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Members</p>
            <h3 className="stat-value">{totalMembers.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #c084fc)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="stat-details">
            <p className="stat-label">Active Groups</p>
            <h3 className="stat-value">{totalGroups}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-details">
            <p className="stat-label">Prize Pools</p>
            <h3 className="stat-value">{activePrizePools}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {groups.slice(0, 5).map((group) => (
            <div key={group.id} className="activity-item">
              <div className="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">{group.group_name}</p>
                <p className="activity-subtitle">Group ID: {group.group_id} • {group.current_members}/{group.max_members} members</p>
              </div>
              <span className={`status-badge ${group.status}`}>{group.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GroupsTab = ({ groups, plans, onRefresh, onCreateNew }) => {
  if (plans.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3>No Plans Available</h3>
        <p>You need to create a Plan first before creating Groups</p>
        <p className="text-sm text-muted">Go to Plans tab and create a plan</p>
      </div>
    );
  }

  return (
    <div className="groups-tab">
      <div className="tab-header">
        <h2>Manage Groups</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Group
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Members</th>
              <th>Max Members</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td><span className="badge">{group.group_id}</span></td>
                <td><strong>{group.group_name}</strong></td>
                <td>{group.current_members}</td>
                <td>{group.max_members}</td>
                <td><span className={`status-badge ${group.status}`}>{group.status}</span></td>
                <td>{new Date(group.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PlansTab = ({ plans, prizePools, onRefresh, onCreateNew }) => {
  if (prizePools.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3>No Prize Pools Available</h3>
        <p>You need to create a Prize Pool first before creating Plans</p>
        <p className="text-sm text-muted">Go to Prize Pools tab and create a prize pool</p>
      </div>
    );
  }

  return (
    <div className="plans-tab">
      <div className="tab-header">
        <h2>Manage Plans</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Plan
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Monthly Amount</th>
              <th>Duration</th>
              <th>Max Members</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td><strong>{plan.name}</strong></td>
                <td>₹{plan.monthly_amount.toLocaleString()}</td>
                <td>{plan.duration_months} months</td>
                <td>{plan.max_members}</td>
                <td><span className={`status-badge ${plan.status}`}>{plan.status}</span></td>
                <td>{new Date(plan.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DrawsTab = ({ groups, onRefresh }) => {
  const [activeDrawTab, setActiveDrawTab] = useState('scheduled');
  const [scheduledDraws, setScheduledDraws] = useState([]);
  const [drawHistory, setDrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConductModal, setShowConductModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);

  useEffect(() => {
    loadDrawData();
  }, []);

  const loadDrawData = async () => {
    try {
      const [scheduled, history] = await Promise.all([
        api.getScheduledDraws(),
        api.getDrawHistory()
      ]);
      setScheduledDraws(scheduled);
      setDrawHistory(history);
    } catch (error) {
      console.error('Failed to load draw data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConductDraw = (draw) => {
    setSelectedDraw(draw);
    setShowConductModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="draws-tab">
      <div className="tab-header">
        <h2>Draw Management</h2>
        <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule Draw
        </button>
      </div>

      <div className="draws-nav">
        <button
          className={`draws-nav-tab ${activeDrawTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => {
            setActiveDrawTab('scheduled');
            loadDrawData();
          }}
        >
          Scheduled Draws ({scheduledDraws.length})
        </button>
        <button
          className={`draws-nav-tab ${activeDrawTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveDrawTab('history');
            loadDrawData();
          }}
        >
          Draw History ({drawHistory.length})
        </button>
      </div>

      {activeDrawTab === 'scheduled' && (
        <div className="scheduled-draws-section">
          {scheduledDraws.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3>No Scheduled Draws</h3>
              <p>Schedule a draw for your groups to start the lucky draw process</p>
            </div>
          ) : (
            <div className="draws-grid">
              {scheduledDraws.map((draw) => (
                <div key={draw.id} className="draw-card">
                  <div className="draw-card-header">
                    <h3>{draw.group_name}</h3>
                    <span className="month-badge">Month {draw.month_number}</span>
                  </div>
                  <div className="draw-details">
                    <div className="draw-detail-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date: {new Date(draw.draw_date).toLocaleDateString()}</span>
                    </div>
                    <div className="draw-detail-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Time: {draw.draw_time}</span>
                    </div>
                    <div className="draw-detail-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Eligible: {draw.eligible_users_count} users</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-accent btn-full"
                    onClick={() => handleConductDraw(draw)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conduct Draw
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeDrawTab === 'history' && (
        <div className="draw-history-section">
          {drawHistory.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>No Draw History</h3>
              <p>Completed draws will appear here</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Month</th>
                    <th>Date</th>
                    <th>Winner</th>
                    <th>Prize</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {drawHistory.map((draw) => (
                    <tr key={draw.id}>
                      <td><strong>{draw.group_name}</strong></td>
                      <td>Month {draw.month_number}</td>
                      <td>{new Date(draw.draw_date).toLocaleDateString()}</td>
                      <td>
                        {draw.winner ? (
                          <div>
                            <div>{draw.winner.full_name}</div>
                            <div className="text-sm text-muted">MLD: {draw.winner.mld_id}</div>
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td>{draw.prize_name}</td>
                      <td className="prize-amount">₹{draw.prize_amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showScheduleModal && (
        <ScheduleDrawModal
          groups={groups}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            loadDrawData();
            setShowScheduleModal(false);
          }}
        />
      )}

      {showConductModal && selectedDraw && (
        <ConductDrawModal
          draw={selectedDraw}
          onClose={() => {
            setShowConductModal(false);
            setSelectedDraw(null);
          }}
          onSuccess={() => {
            loadDrawData();
            onRefresh();
            setShowConductModal(false);
            setSelectedDraw(null);
          }}
        />
      )}
    </div>
  );
};

const ScheduleDrawModal = ({ groups, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    group_id: '',
    month_number: '',
    draw_date: '',
    draw_time: '12:00:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.scheduleDrawForGroup({
        group_id: parseInt(formData.group_id),
        month_number: parseInt(formData.month_number),
        draw_date: formData.draw_date,
        draw_time: formData.draw_time
      });
      alert('Draw scheduled successfully!');
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to schedule draw');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule Draw</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Select Group *</label>
            <select
              className="input"
              value={formData.group_id}
              onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
              required
            >
              <option value="">Choose a group</option>
              {groups.filter(g => g.status === 'active').map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name} ({group.group_id}) - {group.current_members} members
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Month Number (1-11) *</label>
            <input
              type="number"
              className="input"
              min="1"
              max="11"
              value={formData.month_number}
              onChange={(e) => setFormData({ ...formData, month_number: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Draw Date *</label>
            <input
              type="date"
              className="input"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Draw Time *</label>
            <input
              type="time"
              className="input"
              value={formData.draw_time.substring(0, 5)}
              onChange={(e) => setFormData({ ...formData, draw_time: e.target.value + ':00' })}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Draw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConductDrawModal = ({ draw, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleConduct = async () => {
    console.log('Conduct Draw button clicked for draw ID:', draw.id);
    setError('');
    setLoading(true);

    try {
      console.log('Calling conductDraw API...');
      const response = await api.conductDraw(draw.id);
      console.log('Draw conducted successfully:', response);
      setResult(response);
    } catch (err) {
      console.error('Error conducting draw:', err);
      setError(err.message || 'Failed to conduct draw');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (result) {
      // Reload all data after successful draw
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content conduct-draw-modal" onClick={(e) => e.stopPropagation()}>
        {!result ? (
          <>
            <div className="modal-header">
              <h2>Conduct Draw</h2>
              <button className="modal-close" onClick={onClose}>×</button>
            </div>

            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}

              <div className="draw-info-card">
                <h3>{draw.group_name}</h3>
                <p className="text-muted">Month {draw.month_number}</p>
                <div className="draw-stats">
                  <div className="draw-stat">
                    <span className="stat-label">Draw Date:</span>
                    <span className="stat-value">{new Date(draw.draw_date).toLocaleDateString()}</span>
                  </div>
                  <div className="draw-stat">
                    <span className="stat-label">Draw Time:</span>
                    <span className="stat-value">{draw.draw_time}</span>
                  </div>
                  <div className="draw-stat">
                    <span className="stat-label">Eligible Users:</span>
                    <span className="stat-value highlight">{draw.eligible_users_count}</span>
                  </div>
                </div>
              </div>

              <div className="warning-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>This will randomly select a winner from {draw.eligible_users_count} eligible user(s). This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="btn btn-accent" onClick={handleConduct} disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Drawing...
                  </>
                ) : (
                  'Conduct Draw Now'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-header winner-header">
              <div className="winner-icon">🎉</div>
            </div>

            <div className="modal-body winner-body">
              <h2 className="winner-title">Winner Selected!</h2>
              
              <div className="winner-card">
                <div className="winner-avatar">
                  {result.winner.full_name.charAt(0)}
                </div>
                <h3 className="winner-name">{result.winner.full_name}</h3>
                <p className="winner-mld">MLD ID: {result.winner.mld_id}</p>
              </div>

              <div className="prize-details">
                <div className="prize-detail-row">
                  <span>Prize:</span>
                  <strong>{result.prize.name}</strong>
                </div>
                <div className="prize-detail-row prize-amount-row">
                  <span>Prize Amount:</span>
                  <strong className="prize-amount-large">₹{result.prize.amount.toLocaleString()}</strong>
                </div>
                <div className="prize-detail-row">
                  <span>Months Paid:</span>
                  <strong>{result.enrollment.months_paid}</strong>
                </div>
                <div className="prize-detail-row">
                  <span>Savings Accumulated:</span>
                  <strong>₹{result.enrollment.savings_accumulated.toLocaleString()}</strong>
                </div>
                <div className="prize-detail-row total-benefit">
                  <span>Total Benefit:</span>
                  <strong className="benefit-amount">₹{result.total_benefit.toLocaleString()}</strong>
                </div>
              </div>

              <div className="success-message">
                ✓ Prize credited to winner's rewards wallet
                <br />
                ✓ Plan completed for the winner
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary btn-full" onClick={handleClose}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PrizesTab = ({ prizePools, onRefresh, onCreateNew }) => {
  return (
    <div className="prizes-tab">
      <div className="tab-header">
        <h2>Prize Pools</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Prize Pool
        </button>
      </div>

      <div className="prizes-grid">
        {prizePools.map((pool) => (
          <div key={pool.id} className="prize-card">
            <div className="prize-header">
              <h3>{pool.name}</h3>
              <span className={`status-badge ${pool.is_active ? 'active' : 'inactive'}`}>
                {pool.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="prize-description">{pool.description}</p>
            <div className="prize-list">
              {pool.prizes.filter(p => p.name).map((prize, idx) => (
                <div key={idx} className="prize-item">
                  <span className="prize-name">{prize.name}</span>
                  <span className="prize-amount">₹{prize.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateModal = ({ type, prizePools, plans, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(
    type === 'prize' 
      ? { name: '', description: '', prizes: [{ name: '', amount: '' }] }
      : type === 'plan'
      ? { prize_pool_id: '', name: '', monthly_amount: '', duration_months: 11, max_members: '', description: '' }
      : { plan_id: '', group_name: '', max_members: '' }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'prize') {
        // Filter out empty prizes
        const validPrizes = formData.prizes.filter(p => p.name && p.amount);
        if (validPrizes.length === 0) {
          throw new Error('Please add at least one prize');
        }
        if (validPrizes.length > 15) {
          throw new Error('Maximum 15 prizes allowed');
        }
        await api.createPrizePool({
          ...formData,
          prizes: validPrizes
        });
      } else if (type === 'plan') {
        await api.createPlan({
          ...formData,
          prize_pool_id: parseInt(formData.prize_pool_id),
          monthly_amount: parseFloat(formData.monthly_amount),
          duration_months: parseInt(formData.duration_months),
          max_members: parseInt(formData.max_members)
        });
      } else {
        await api.createGroup({
          ...formData,
          plan_id: parseInt(formData.plan_id),
          max_members: parseInt(formData.max_members)
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const addPrize = () => {
    if (formData.prizes.length >= 15) {
      setError('Maximum 15 prizes allowed');
      return;
    }
    setFormData({
      ...formData,
      prizes: [...formData.prizes, { name: '', amount: '' }]
    });
  };

  const removePrize = (idx) => {
    const newPrizes = formData.prizes.filter((_, i) => i !== idx);
    setFormData({ ...formData, prizes: newPrizes });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create {type === 'prize' ? 'Prize Pool' : type === 'plan' ? 'Plan' : 'Group'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          {type === 'prize' ? (
            <>
              <div className="input-group">
                <label>Prize Pool Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="prizes-section">
                <label>Prizes (Max 15)</label>
                {formData.prizes.map((prize, idx) => (
                  <div key={idx} className="prize-input-row">
                    <input
                      type="text"
                      className="input"
                      placeholder="Prize Name"
                      value={prize.name}
                      onChange={(e) => {
                        const newPrizes = [...formData.prizes];
                        newPrizes[idx].name = e.target.value;
                        setFormData({ ...formData, prizes: newPrizes });
                      }}
                    />
                    <input
                      type="number"
                      className="input"
                      placeholder="Amount"
                      value={prize.amount}
                      onChange={(e) => {
                        const newPrizes = [...formData.prizes];
                        newPrizes[idx].amount = e.target.value;
                        setFormData({ ...formData, prizes: newPrizes });
                      }}
                    />
                    {formData.prizes.length > 1 && (
                      <button type="button" className="btn-remove" onClick={() => removePrize(idx)}>×</button>
                    )}
                  </div>
                ))}
                {formData.prizes.length < 15 && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={addPrize}>
                    + Add Prize
                  </button>
                )}
              </div>
            </>
          ) : type === 'plan' ? (
            <>
              <div className="input-group">
                <label>Prize Pool *</label>
                <select
                  className="input"
                  value={formData.prize_pool_id}
                  onChange={(e) => setFormData({ ...formData, prize_pool_id: e.target.value })}
                  required
                >
                  <option value="">Select Prize Pool</option>
                  {prizePools.filter(p => p.is_active).map((pool) => (
                    <option key={pool.id} value={pool.id}>{pool.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Plan Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Premium Plan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Monthly Amount (₹) *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 5000"
                  value={formData.monthly_amount}
                  onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Duration (Months) *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="11"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="input-group">
                <label>Max Members per Group *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 15"
                  value={formData.max_members}
                  onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                  required
                  min="2"
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>Group Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Group Alpha"
                  value={formData.group_name}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Plan *</label>
                <select
                  className="input"
                  value={formData.plan_id}
                  onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                  required
                >
                  <option value="">Select Plan</option>
                  {plans.filter(p => p.status === 'active').map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name} - ₹{plan.monthly_amount}/month</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Max Members</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 15"
                  value={formData.max_members}
                  onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                  required
                  min="2"
                />
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReferralsTab = ({ user, groups }) => {
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [franchiseSlug, setFranchiseSlug] = useState(null);

  useEffect(() => {
    loadReferralData();
    loadFranchiseSlug();
  }, [page]);

  const loadFranchiseSlug = async () => {
    // Get franchise slug from user object or from API
    if (user?.franchise_slug) {
      setFranchiseSlug(user.franchise_slug);
    } else {
      // Fallback: get from localStorage or default
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      if (userData.franchise_slug) {
        setFranchiseSlug(userData.franchise_slug);
      } else {
        // Last resort: use a default or show error
        console.warn('Franchise slug not found. Please re-login.');
        setFranchiseSlug('franchise'); // fallback
      }
    }
  };

  const loadReferralData = async () => {
    try {
      const [referralsData, earningsData] = await Promise.all([
        api.getFranchiseReferrals(page, 20),
        api.getFranchiseEarnings()
      ]);
      setReferrals(referralsData.users || []);
      setTotalPages(referralsData.total_pages || 1);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (group) => {
    if (!franchiseSlug) {
      alert('Franchise slug not available. Please re-login.');
      return;
    }
    const link = `https://millancefurniture.com/${franchiseSlug}/${group.invite_code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(group.invite_code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const viewUserDetails = async (userId) => {
    try {
      const userData = await api.getReferralUserDetails(userId);
      setSelectedUser(userData);
      setShowUserDetails(true);
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="referrals-tab">
      <div className="tab-header">
        <h2>Referral System</h2>
        <div className="earnings-badge">
          Total Earnings: ₹{earnings?.total_earnings?.toLocaleString() || '0'}
        </div>
      </div>

      {/* Invite Links Section */}
      <div className="invite-links-section">
        <h3>Your Invite Links</h3>
        <div className="invite-links-grid">
          {groups.map((group) => (
            <div key={group.id} className="invite-link-card">
              <div className="invite-link-header">
                <h4>{group.group_name}</h4>
                <span className="group-badge">{group.group_id}</span>
              </div>
              <div className="invite-link-url">
                <input 
                  type="text" 
                  readOnly 
                  value={franchiseSlug ? `millancefurniture.com/${franchiseSlug}/${group.invite_code}` : 'Loading...'}
                  className="invite-link-input"
                />
              </div>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => copyInviteLink(group)}
              >
                {copiedCode === group.invite_code ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
              <div className="invite-stats">
                <span>{group.current_members || 0} members</span>
                <span className={`status-badge ${group.status}`}>{group.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referred Users Section */}
      <div className="referred-users-section">
        <h3>Referred Users</h3>
        {referrals.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h4>No Referred Users Yet</h4>
            <p>Share your invite links to start earning commissions</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>MLD ID</th>
                    <th>Group</th>
                    <th>Plan</th>
                    <th>Payments</th>
                    <th>Your Earnings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.user_id}>
                      <td><strong>{referral.full_name}</strong></td>
                      <td><span className="badge">{referral.mld_id}</span></td>
                      <td>{referral.group_name}</td>
                      <td>₹{referral.monthly_amount} x {referral.duration_months}M</td>
                      <td>
                        <span className="payment-badge">
                          {referral.payments_made}/{referral.total_payments}
                        </span>
                      </td>
                      <td className="earnings-cell">
                        ₹{referral.commission_earned?.toLocaleString() || '0'}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => viewUserDetails(referral.user_id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button 
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button 
                className="btn btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="modal-close" onClick={() => setShowUserDetails(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="user-info-section">
                <h3>{selectedUser.full_name}</h3>
                <p className="text-muted">MLD ID: {selectedUser.mld_id}</p>
                <p className="text-muted">Email: {selectedUser.email}</p>
                <p className="text-muted">Phone: {selectedUser.phone}</p>
              </div>

              <div className="user-enrollment-info">
                <h4>Plan Details</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Group:</span>
                    <span className="value">{selectedUser.group_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Monthly Amount:</span>
                    <span className="value">₹{selectedUser.monthly_amount}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Payments Made:</span>
                    <span className="value">{selectedUser.payments_made}/{selectedUser.total_payments}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Paid:</span>
                    <span className="value">₹{selectedUser.total_paid?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="user-earnings-info">
                <h4>Your Earnings from this User</h4>
                <div className="earnings-highlight">
                  ₹{selectedUser.commission_earned?.toLocaleString() || '0'}
                </div>
                <p className="text-sm text-muted">15% commission on each payment</p>
              </div>

              <div className="user-payment-history">
                <h4>Payment History</h4>
                {selectedUser.payments && selectedUser.payments.length > 0 ? (
                  <div className="payment-history-list">
                    {selectedUser.payments.map((payment) => (
                      <div key={payment.id} className="payment-history-item">
                        <div>
                          <strong>{payment.month}</strong>
                          <p className="text-sm text-muted">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="payment-amounts">
                          <div>₹{payment.amount}</div>
                          <div className="commission-amount">
                            +₹{payment.commission_earned?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No payments yet</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowUserDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseDashboard;
