import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [revenueReport, setRevenueReport] = useState([]);
  const [prizePools, setPrizePools] = useState([]);
  const [plans, setPlans] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showCreateFranchiseModal, setShowCreateFranchiseModal] = useState(false);
  const [showCreatePrizePoolModal, setShowCreatePrizePoolModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.getAdminStats();
      setStats(statsData);

      // Always load franchises since they're needed for other tabs
      const franchisesData = await api.getAllFranchises();
      setFranchises(franchisesData);

      if (activeTab === 'users') {
        const usersData = await api.getAllUsers();
        setUsers(usersData);
      } else if (activeTab === 'reports') {
        const reportData = await api.getRevenueReport();
        setRevenueReport(reportData);
      } else if (activeTab === 'prize-pools') {
        const poolsData = await api.getAdminPrizePools();
        setPrizePools(poolsData);
      } else if (activeTab === 'plans') {
        const [poolsData, plansData] = await Promise.all([
          api.getAdminPrizePools(),
          api.getAdminPlans()
        ]);
        setPrizePools(poolsData);
        setPlans(plansData);
      } else if (activeTab === 'groups') {
        const [poolsData, plansData, groupsData] = await Promise.all([
          api.getAdminPrizePools(),
          api.getAdminPlans(),
          api.getAdminGroups()
        ]);
        setPrizePools(poolsData);
        setPlans(plansData);
        setGroups(groupsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="admin-brand">
            <div className="logo-icon admin">A</div>
            <div>
              <h1>Admin Dashboard</h1>
              <p className="text-sm text-neutral-500">{user?.email || 'Administrator'}</p>
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
          className={`nav-tab ${activeTab === 'franchises' ? 'active' : ''}`}
          onClick={() => setActiveTab('franchises')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Franchises
        </button>
        <button 
          className={`nav-tab ${activeTab === 'prize-pools' ? 'active' : ''}`}
          onClick={() => setActiveTab('prize-pools')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Prize Pools
          <span className="new-badge">NEW</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Plans
          <span className="new-badge">NEW</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Groups
          <span className="new-badge">NEW</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reports
        </button>
        <button 
          className={`nav-tab ${activeTab === 'qr-code' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr-code')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <AdminOverviewTab stats={stats} />}
            {activeTab === 'franchises' && (
              <FranchisesTab 
                franchises={franchises} 
                onCreateNew={() => setShowCreateFranchiseModal(true)}
                onRefresh={loadData}
              />
            )}
            {activeTab === 'prize-pools' && (
              <PrizePoolsTab 
                prizePools={prizePools}
                franchises={franchises}
                onCreateNew={() => setShowCreatePrizePoolModal(true)}
                onRefresh={loadData}
              />
            )}
            {activeTab === 'plans' && (
              <PlansTab 
                plans={plans}
                prizePools={prizePools}
                franchises={franchises}
                onCreateNew={() => setShowCreatePlanModal(true)}
                onRefresh={loadData}
              />
            )}
            {activeTab === 'groups' && (
              <GroupsTab 
                groups={groups}
                plans={plans}
                franchises={franchises}
                onCreateNew={() => setShowCreateGroupModal(true)}
                onRefresh={loadData}
              />
            )}
            {activeTab === 'users' && <UsersTab users={users} onRefresh={loadData} />}
            {activeTab === 'reports' && <ReportsTab revenueReport={revenueReport} stats={stats} />}
            {activeTab === 'qr-code' && <QRCodeTab />}
          </>
        )}
      </main>

      {/* Create Franchise Modal */}
      {showCreateFranchiseModal && (
        <CreateFranchiseModal 
          onClose={() => setShowCreateFranchiseModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* Create Prize Pool Modal */}
      {showCreatePrizePoolModal && (
        <CreatePrizePoolModal 
          franchises={franchises}
          onClose={() => setShowCreatePrizePoolModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <CreatePlanModal 
          franchises={franchises}
          prizePools={prizePools}
          onClose={() => setShowCreatePlanModal(false)}
          onSuccess={loadData}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal 
          franchises={franchises}
          plans={plans}
          onClose={() => setShowCreateGroupModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

const AdminOverviewTab = ({ stats }) => {
  const statsData = [
    { label: 'Total Users', value: stats?.total_users || 0, change: '+12%', icon: 'users', color: '#6366f1' },
    { label: 'Active Franchises', value: stats?.total_franchises || 0, change: '+5%', icon: 'building', color: '#a855f7' },
    { label: 'Total Revenue', value: `₹${((stats?.total_revenue || 0) / 100000).toFixed(2)}L`, change: '+18%', icon: 'money', color: '#22c55e' },
    { label: 'Active Groups', value: stats?.total_groups || 0, change: '+8%', icon: 'group', color: '#f59e0b' }
  ];

  return (
    <div className="admin-overview">
      <div className="stats-grid">
        {statsData.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="stat-details">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-change positive">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <h2 className="section-title">Revenue Overview</h2>
        <div className="chart-placeholder">
          <div className="bar-chart">
            {[65, 85, 45, 75, 95, 60, 80, 70, 90, 55, 85, 75].map((height, idx) => (
              <div key={idx} className="bar-wrapper">
                <div className="bar" style={{ height: `${height}%` }}></div>
                <span className="bar-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">New user registered</p>
              <p className="activity-subtitle">MLD ID: 123456 • 2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">New franchise onboarded</p>
              <p className="activity-subtitle">Mumbai Central Branch • 5 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-title">Prize pool created</p>
              <p className="activity-subtitle">Gold Plan - ₹5,00,000 • Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FranchisesTab = ({ franchises, onCreateNew, onRefresh }) => {
  const handleToggleStatus = async (franchiseId, currentStatus) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this franchise?`)) {
      try {
        await api.updateFranchiseStatus(franchiseId, !currentStatus);
        onRefresh();
      } catch (error) {
        alert('Failed to update franchise status');
      }
    }
  };

  return (
    <div className="franchises-tab">
      <div className="tab-header">
        <h2>Franchise Management</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Franchise
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Franchise Name</th>
              <th>Code</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {franchises.map((franchise) => (
              <tr key={franchise.id}>
                <td><strong>{franchise.franchise_name}</strong></td>
                <td><span className="badge">{franchise.franchise_code}</span></td>
                <td>{franchise.email}</td>
                <td>{franchise.phone}</td>
                <td>
                  <span className={`status-badge ${franchise.is_active ? 'active' : 'inactive'}`}>
                    {franchise.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-icon"
                    onClick={() => handleToggleStatus(franchise.id, franchise.is_active)}
                    title={franchise.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UsersTab = ({ users, onRefresh }) => {
  const handleToggleStatus = async (userId, currentStatus) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) {
      try {
        await api.updateUserStatus(userId, !currentStatus);
        onRefresh();
      } catch (error) {
        alert('Failed to update user status');
      }
    }
  };

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>User Management</h2>
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search users..." />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>MLD ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><span className="badge">{user.mld_id}</span></td>
                <td><strong>{user.full_name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'suspended'}`}>
                    {user.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-icon"
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    title={user.is_active ? 'Suspend' : 'Activate'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTab = ({ revenueReport, stats }) => {
  return (
    <div className="reports-tab">
      <div className="tab-header">
        <h2>Reports & Analytics</h2>
        <div className="report-filters">
          <select className="input-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Revenue Report</h3>
          <div className="report-value">₹45.2M</div>
          <p className="report-subtitle">Total revenue this month</p>
          <div className="chart-mini">
            {[40, 60, 45, 70, 55, 80, 65].map((height, idx) => (
              <div key={idx} className="mini-bar" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h3>User Growth</h3>
          <div className="report-value">+12.5%</div>
          <p className="report-subtitle">New users this month</p>
          <div className="chart-mini">
            {[30, 45, 55, 40, 60, 75, 85].map((height, idx) => (
              <div key={idx} className="mini-bar" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h3>Draw Completion</h3>
          <div className="report-value">98.5%</div>
          <p className="report-subtitle">Success rate</p>
          <div className="chart-mini">
            {[85, 90, 88, 95, 92, 97, 98].map((height, idx) => (
              <div key={idx} className="mini-bar" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h3>Payment Success</h3>
          <div className="report-value">96.8%</div>
          <p className="report-subtitle">On-time payments</p>
          <div className="chart-mini">
            {[90, 92, 95, 93, 96, 97, 96].map((height, idx) => (
              <div key={idx} className="mini-bar" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateFranchiseModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    franchise_name: '',
    franchise_code: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createFranchise(formData);
      alert('Franchise created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create franchise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Franchise</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Franchise Name</label>
            <input
              type="text"
              className="input"
              value={formData.franchise_name}
              onChange={(e) => setFormData({ ...formData, franchise_name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Franchise Code</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., MUMB-01"
              value={formData.franchise_code}
              onChange={(e) => setFormData({ ...formData, franchise_code: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input
              type="tel"
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Address (Optional)</label>
            <textarea
              className="input"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Franchise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Prize Pools Tab
const PrizePoolsTab = ({ prizePools, franchises, onCreateNew, onRefresh }) => {
  return (
    <div className="prize-pools-tab">
      <div className="tab-header">
        <h2>Prize Pool Management</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Prize Pool
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Franchise</th>
              <th>Prizes</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {prizePools.map((pool) => {
              const franchise = franchises.find(f => f.id === pool.franchise_id);
              const prizeCount = pool.prizes?.filter(p => p.name && p.amount).length || 0;
              return (
                <tr key={pool.id}>
                  <td><strong>{pool.name}</strong></td>
                  <td>{franchise?.franchise_name || 'N/A'}</td>
                  <td><span className="badge">{prizeCount} prizes</span></td>
                  <td>
                    <span className={`status-badge ${pool.is_active ? 'active' : 'inactive'}`}>
                      {pool.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(pool.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Plans Tab
const PlansTab = ({ plans, prizePools, franchises, onCreateNew, onRefresh }) => {
  return (
    <div className="plans-tab">
      <div className="tab-header">
        <h2>Plan Management</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Plan
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Franchise</th>
              <th>Monthly Amount</th>
              <th>Duration</th>
              <th>Members</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => {
              const franchise = franchises.find(f => f.id === plan.franchise_id);
              return (
                <tr key={plan.id}>
                  <td><strong>{plan.name}</strong></td>
                  <td>{franchise?.franchise_name || 'N/A'}</td>
                  <td className="amount">₹{plan.monthly_amount.toLocaleString()}</td>
                  <td>{plan.duration_months} months</td>
                  <td>{plan.current_members}/{plan.max_members}</td>
                  <td>
                    <span className={`status-badge ${plan.status === 'active' ? 'active' : 'inactive'}`}>
                      {plan.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Groups Tab
const GroupsTab = ({ groups, plans, franchises, onCreateNew, onRefresh }) => {
  return (
    <div className="groups-tab">
      <div className="tab-header">
        <h2>Group Management</h2>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Group
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Group ID</th>
              <th>Plan</th>
              <th>Franchise</th>
              <th>Members</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const plan = plans.find(p => p.id === group.plan_id);
              const franchise = franchises.find(f => f.id === group.franchise_id);
              return (
                <tr key={group.id}>
                  <td><strong>{group.group_name}</strong></td>
                  <td><span className="badge">{group.group_id}</span></td>
                  <td>{plan?.name || 'N/A'}</td>
                  <td>{franchise?.franchise_name || 'N/A'}</td>
                  <td>{group.current_members}/{group.max_members}</td>
                  <td>
                    <span className={`status-badge ${group.status === 'active' ? 'active' : 'inactive'}`}>
                      {group.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Create Prize Pool Modal
const CreatePrizePoolModal = ({ franchises, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    franchise_id: '',
    name: '',
    description: '',
    prizes: Array(15).fill(null).map(() => ({ name: '', amount: '' }))
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setFormData({ ...formData, prizes: newPrizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const filteredPrizes = formData.prizes
        .filter(p => p.name && p.amount)
        .map(p => ({ name: p.name, amount: parseFloat(p.amount) }));

      await api.createAdminPrizePool({
        franchise_id: parseInt(formData.franchise_id),
        name: formData.name,
        description: formData.description,
        prizes: filteredPrizes
      });
      alert('Prize pool created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create prize pool');
    } finally {
      setLoading(false);
    }
  };

  const filledPrizes = formData.prizes.filter(p => p.name && p.amount).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Prize Pool</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Select Franchise *</label>
            <select
              className="input"
              value={formData.franchise_id}
              onChange={(e) => setFormData({ ...formData, franchise_id: e.target.value })}
              required
            >
              <option value="">Choose franchise</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>{f.franchise_name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Prize Pool Name *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Gold Plan Prizes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Describe the prize pool..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="prizes-section">
            <h4>Prizes ({filledPrizes}/15)</h4>
            <div className="prizes-grid">
              {formData.prizes.slice(0, 5).map((prize, idx) => (
                <div key={idx} className="prize-row">
                  <span className="prize-number">{idx + 1}.</span>
                  <input
                    type="text"
                    className="input"
                    placeholder="Prize name"
                    value={prize.name}
                    onChange={(e) => handlePrizeChange(idx, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="Amount"
                    value={prize.amount}
                    onChange={(e) => handlePrizeChange(idx, 'amount', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !filledPrizes}>
              {loading ? 'Creating...' : 'Create Prize Pool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Plan Modal
const CreatePlanModal = ({ franchises, prizePools, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    franchise_id: '',
    prize_pool_id: '',
    name: '',
    monthly_amount: '',
    duration_months: 11,
    max_members: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const franchisePools = prizePools.filter(p => p.franchise_id === parseInt(formData.franchise_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createAdminPlan({
        franchise_id: parseInt(formData.franchise_id),
        prize_pool_id: parseInt(formData.prize_pool_id),
        name: formData.name,
        monthly_amount: parseFloat(formData.monthly_amount),
        duration_months: parseInt(formData.duration_months),
        max_members: parseInt(formData.max_members),
        description: formData.description
      });
      alert('Plan created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Plan</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Select Franchise *</label>
            <select
              className="input"
              value={formData.franchise_id}
              onChange={(e) => setFormData({ ...formData, franchise_id: e.target.value, prize_pool_id: '' })}
              required
            >
              <option value="">Choose franchise</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>{f.franchise_name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Select Prize Pool *</label>
            <select
              className="input"
              value={formData.prize_pool_id}
              onChange={(e) => setFormData({ ...formData, prize_pool_id: e.target.value })}
              disabled={!formData.franchise_id}
              required
            >
              <option value="">Choose prize pool</option>
              {franchisePools.map((pool) => (
                <option key={pool.id} value={pool.id}>{pool.name}</option>
              ))}
            </select>
            {formData.franchise_id && franchisePools.length === 0 && (
              <p className="input-hint warning">No prize pools for this franchise</p>
            )}
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

          <div className="input-row">
            <div className="input-group">
              <label>Monthly Amount *</label>
              <input
                type="number"
                className="input"
                placeholder="5000"
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
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Max Members *</label>
              <input
                type="number"
                className="input"
                placeholder="20"
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Describe the plan..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Group Modal
const CreateGroupModal = ({ franchises, plans, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    franchise_id: '',
    plan_id: '',
    group_name: '',
    max_members: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const franchisePlans = plans.filter(p => p.franchise_id === parseInt(formData.franchise_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createAdminGroup({
        franchise_id: parseInt(formData.franchise_id),
        plan_id: parseInt(formData.plan_id),
        group_name: formData.group_name,
        max_members: parseInt(formData.max_members)
      });
      alert('Group created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Group</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label>Select Franchise *</label>
            <select
              className="input"
              value={formData.franchise_id}
              onChange={(e) => setFormData({ ...formData, franchise_id: e.target.value, plan_id: '' })}
              required
            >
              <option value="">Choose franchise</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>{f.franchise_name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Select Plan *</label>
            <select
              className="input"
              value={formData.plan_id}
              onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
              disabled={!formData.franchise_id}
              required
            >
              <option value="">Choose plan</option>
              {franchisePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
            {formData.franchise_id && franchisePlans.length === 0 && (
              <p className="input-hint warning">No plans for this franchise</p>
            )}
          </div>

          <div className="input-group">
            <label>Group Name *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Premium Group A"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Max Members *</label>
            <input
              type="number"
              className="input"
              placeholder="20"
              value={formData.max_members}
              onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// QR Code Tab
const QRCodeTab = () => {
  const [qrDownloaded, setQrDownloaded] = useState(false);
  const qrCodeUrl = 'https://millancefurniture.com/pay';
  const qrRef = useRef(null);

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) {
      alert('QR code not ready. Please try again.');
      return;
    }

    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create image from SVG
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 600;
      const padding = 60;
      const qrSize = size - (padding * 2);

      canvas.width = size;
      canvas.height = size + 120;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      // Draw border
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 4;
      ctx.strokeRect(padding - 2, padding - 2, qrSize + 4, qrSize + 4);

      // Text below QR
      ctx.fillStyle = '#0B1020';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Millance Payment', canvas.width / 2, size + 50);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('Scan to Pay', canvas.width / 2, size + 85);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'millance-payment-qr.png';
        link.click();
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(svgUrl);
        setQrDownloaded(true);
        setTimeout(() => setQrDownloaded(false), 3000);
      });
    };

    img.onerror = () => {
      alert('Failed to generate QR code image. Please try again.');
      URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
  };

  return (
    <div className="qr-code-tab">
      <div className="tab-header">
        <h2>Payment QR Code</h2>
        <p className="text-sm text-neutral-500">Download and display at stores for customer payments</p>
      </div>

      <div className="qr-code-container">
        <div className="qr-code-card">
          <div className="qr-code-display" ref={qrRef}>
            <QRCodeSVG
              value={qrCodeUrl}
              size={240}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-url">{qrCodeUrl}</p>

          <div className="qr-info">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>This QR code is for all customers</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Scan redirects to payment page</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Users enter MLD ID and PIN to pay</span>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-full"
            onClick={downloadQRCode}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
          </button>

          {qrDownloaded && (
            <div className="success-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              QR Code downloaded successfully!
            </div>
          )}
        </div>

        <div className="qr-instructions">
          <h3>How to Use</h3>
          <ol>
            <li>
              <strong>Download</strong> the QR code using the button above
            </li>
            <li>
              <strong>Print</strong> the QR code image in high quality
            </li>
            <li>
              <strong>Display</strong> the printed QR code at store counters
            </li>
            <li>
              <strong>Customers scan</strong> the QR code with their phone camera
            </li>
            <li>
              <strong>Payment page opens</strong> where they enter:
              <ul>
                <li>Purchase amount</li>
                <li>Their 6-digit MLD ID</li>
                <li>Select wallet (Rewards or Savings)</li>
                <li>Enter 4-digit PIN</li>
              </ul>
            </li>
            <li>
              <strong>Payment completes</strong> and balance is deducted
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
