import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  LayoutDashboard, Users, Gift, FileText, UsersRound, 
  Calendar, Trophy, DollarSign, BarChart3, User, LogOut,
  Plus, TrendingUp, Wallet, AlertCircle, X, Check, Link2, QrCode, 
  Download, Copy, ChevronLeft, ChevronRight
} from 'lucide-react';
import '../styles/FranchiseDashboardV2.css';
import QRCode from 'qrcode';

const FranchiseDashboardV2 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [prizePools, setPrizePools] = useState([]);
  const [groups, setGroups] = useState([]);
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadData();
    loadFranchiseInfo();
  }, []);

  const loadFranchiseInfo = async () => {
    try {
      const info = await api.request('/franchise/me');
      setFranchiseInfo(info);
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

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prizes', label: 'Prize Pools', icon: Gift },
    { id: 'plans', label: 'Plans', icon: FileText },
    { id: 'groups', label: 'Groups', icon: UsersRound },
    { id: 'draws', label: 'Draw Schedule', icon: Calendar },
    { id: 'history', label: 'Draw History', icon: Trophy },
    { id: 'enrollments', label: 'Members', icon: Users },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign }
  ];

  if (loading) {
    return (
      <div className="franchise-loading">
        <div className="franchise-spinner"></div>
      </div>
    );
  }

  return (
    <div className="franchise-dashboard-v2">
      {/* Sidebar */}
      <aside className={`franchise-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="franchise-sidebar-header">
          <div className="franchise-logo">
            <div className="franchise-logo-icon">MLD</div>
            <div className="franchise-logo-text">
              <h2>MILLANCE</h2>
              <p>Lucky Draw</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="franchise-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`franchise-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
              {item.badge && <span className="franchise-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="franchise-sidebar-footer">
          <button className="franchise-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="franchise-main">
        {/* Welcome Header */}
        <div className="franchise-welcome-header">
          <div className="franchise-welcome-content">
            <div className="franchise-welcome-text">
              <h1>Welcome, {franchiseInfo?.franchise_name || user?.franchise_name || 'Franchise'}</h1>
              <div className="franchise-welcome-info">
                <div className="franchise-welcome-info-item">
                  <strong>Code:</strong> {franchiseInfo?.franchise_code || user?.franchise_code || 'N/A'}
                </div>
                {franchiseInfo?.franchise_slug && (
                  <div className="franchise-welcome-info-item">
                    <strong>Slug:</strong> {franchiseInfo.franchise_slug}
                  </div>
                )}
                <div className="franchise-welcome-info-item">
                  <strong>Email:</strong> {franchiseInfo?.email || user?.email || 'N/A'}
                </div>
                {franchiseInfo?.phone && (
                  <div className="franchise-welcome-info-item">
                    <strong>Phone:</strong> {franchiseInfo.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab stats={stats} groups={groups} />}
        {activeTab === 'prizes' && <PrizesTab prizePools={prizePools} onRefresh={loadData} />}
        {activeTab === 'plans' && <PlansTab plans={plans} prizePools={prizePools} onRefresh={loadData} />}
        {activeTab === 'groups' && <GroupsTab groups={groups} plans={plans} onRefresh={loadData} />}
        {activeTab === 'draws' && <DrawScheduleTab onRefresh={loadData} />}
        {activeTab === 'history' && <DrawHistoryTab />}
        {activeTab === 'enrollments' && <EnrollmentsTab />}
        {activeTab === 'referrals' && <ReferralsTab user={franchiseInfo || user} groups={groups} />}
        {activeTab === 'earnings' && <EarningsTab />}
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, groups }) => {
  const totalMembers = stats?.total_members || 0;
  const totalGroups = stats?.total_groups || 0;
  const totalPlans = stats?.total_plans || 0;
  const totalRevenue = stats?.total_revenue || 0;

  const statCards = [
    {
      label: 'Total Members',
      value: totalMembers.toLocaleString(),
      subtitle: 'Across all groups',
      icon: Users,
      gradient: 'linear-gradient(135deg, #3b82f6, #0891b2)'
    },
    {
      label: 'Active Groups',
      value: totalGroups,
      subtitle: 'Currently running',
      icon: UsersRound,
      gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)'
    },
    {
      label: 'Prize Pools',
      value: totalPlans,
      subtitle: 'Available pools',
      icon: Gift,
      gradient: 'linear-gradient(135deg, #22c55e, #059669)'
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtitle: 'Lifetime earnings',
      icon: Wallet,
      gradient: 'linear-gradient(135deg, #8b5cf6, #9333ea)'
    }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="franchise-stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="franchise-stat-card">
            <div className="franchise-stat-content">
              <div className="franchise-stat-icon" style={{ background: stat.gradient }}>
                <stat.icon />
              </div>
              <div className="franchise-stat-details">
                <p className="franchise-stat-label">{stat.label}</p>
                <h3 className="franchise-stat-value">{stat.value}</h3>
                <p className="franchise-stat-subtitle">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Groups */}
      <div className="franchise-card-v2">
        <div className="franchise-card-header">
          <h2 className="franchise-card-title">Recent Groups</h2>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)' }}>
          {groups.length === 0 ? (
            <p>No groups created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groups.slice(0, 5).map(group => (
                <div key={group.id} style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                        {group.group_name}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                        Group ID: {group.group_id} • {group.current_members}/{group.max_members} members
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder tabs - will implement in next files
// Prize Pools Tab with detailed grid and pagination
const PrizesTab = ({ prizePools, onRefresh }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(prizePools.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = prizePools.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="franchise-card-header" style={{ marginBottom: '24px' }}>
        <h2 className="franchise-card-title">Prize Pools</h2>
        <button className="franchise-create-btn" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create Prize Pool
        </button>
      </div>

      {showModal && (
        <CreatePrizePoolModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            onRefresh();
          }}
        />
      )}

      <div className="franchise-grid">
        {currentItems.map((pool) => (
          <div key={pool.id} className="franchise-card-v2">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ec4899, #e11d48)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Gift size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
                  {pool.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0' }}>
                  {pool.description || 'No description'}
                </p>
                
                {/* Prize List */}
                {pool.prizes && pool.prizes.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: '600' }}>
                      Prizes:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {pool.prizes.map((prize, idx) => (
                        <div key={idx} style={{ 
                          fontSize: '13px', 
                          color: 'rgba(255,255,255,0.8)',
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <span>{prize.name}</span>
                          <span style={{ fontWeight: '600', color: '#fbbf24' }}>₹{prize.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total Prizes: </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{pool.prizes?.length || 0}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Status: </span>
                    <span style={{ 
                      color: pool.is_active ? '#22c55e' : '#ef4444',
                      fontWeight: '600' 
                    }}>
                      {pool.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {prizePools.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <Gift size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No prize pools created yet</p>
        </div>
      )}
    </div>
  );
};

// Plans Tab with detailed grid and pagination
const PlansTab = ({ plans, prizePools, onRefresh }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = plans.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="franchise-card-header" style={{ marginBottom: '24px' }}>
        <h2 className="franchise-card-title">Plans</h2>
        <button className="franchise-create-btn" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create Plan
        </button>
      </div>

      {showModal && (
        <CreatePlanModal 
          prizePools={prizePools}
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            onRefresh();
          }}
        />
      )}

      <div className="franchise-grid">
        {currentItems.map((plan) => {
          const prizePool = prizePools.find(p => p.id === plan.prize_pool_id);
          return (
            <div key={plan.id} className="franchise-card-v2">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3b82f6, #0891b2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
                    {plan.name}
                  </h3>
                  {prizePool && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 12px 0' }}>
                      Prize Pool: {prizePool.name}
                    </p>
                  )}
                  {plan.description && (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0' }}>
                      {plan.description}
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Amount: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>₹{plan.monthly_amount?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Duration: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{plan.duration_months || plan.duration} months</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Capacity: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>{plan.max_members || plan.total_capacity}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Status: </span>
                      <span style={{ 
                        color: plan.is_active ? '#22c55e' : '#ef4444',
                        fontWeight: '600' 
                      }}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {plans.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <FileText size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No plans created yet</p>
        </div>
      )}
    </div>
  );
};

// Groups Tab with detailed grid and pagination
const GroupsTab = ({ groups, plans, onRefresh }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = groups.slice(startIndex, startIndex + itemsPerPage);

  const handleGroupClick = (groupId) => {
    navigate(`/franchise-dashboard/group/${groupId}`);
  };

  return (
    <div>
      <div className="franchise-card-header" style={{ marginBottom: '24px' }}>
        <h2 className="franchise-card-title">Groups</h2>
        <button className="franchise-create-btn" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Create Group
        </button>
      </div>

      {showModal && (
        <CreateGroupModal 
          plans={plans}
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            onRefresh();
          }}
        />
      )}

      <div className="franchise-grid">
        {currentItems.map((group) => {
          const plan = plans.find(p => p.id === group.plan_id);
          return (
            <div 
              key={group.id} 
              className="franchise-card-v2"
              onClick={() => handleGroupClick(group.id)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <UsersRound size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
                    {group.group_name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0' }}>
                    Group ID: {group.group_id}
                  </p>
                  {plan && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px 0' }}>
                      Plan: {plan.name} • ₹{plan.monthly_amount?.toLocaleString()}/month
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Members: </span>
                      <span style={{ color: 'white', fontWeight: '600' }}>
                        {group.current_members}/{group.max_members}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Status: </span>
                      <span style={{ 
                        color: group.status === 'active' ? '#22c55e' : '#ef4444',
                        fontWeight: '600' 
                      }}>
                        {group.status || 'Active'}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(168, 85, 247, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#a855f7',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Click to view details →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {groups.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <UsersRound size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No groups created yet</p>
        </div>
      )}
    </div>
  );
};

const DrawScheduleTab = ({ onRefresh }) => {
  const [scheduledDraws, setScheduledDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    loadScheduledDraws();
  }, []);

  const loadScheduledDraws = async () => {
    try {
      const data = await api.request('/franchise/draws/scheduled');
      setScheduledDraws(data);
    } catch (error) {
      console.error('Failed to load scheduled draws:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(scheduledDraws.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = scheduledDraws.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="franchise-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      <div className="franchise-card-header" style={{ marginBottom: '24px' }}>
        <h2 className="franchise-card-title">Scheduled Draws</h2>
        <button 
          className="franchise-create-btn"
          onClick={() => setShowScheduleModal(true)}
        >
          <Plus size={20} />
          Schedule Draw
        </button>
      </div>

      {showScheduleModal && (
        <ScheduleDrawModal 
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            loadScheduledDraws();
          }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentItems.map((draw, idx) => (
          <div key={idx} className="franchise-card-v2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
                  {draw.group_name || `Group ${draw.group_id}`}
                </h3>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                  Month {draw.month_number} Draw
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  {draw.draw_date} at {draw.draw_time}
                </div>
              </div>
              <div style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #3b82f6, #0891b2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white'
              }}>
                Scheduled
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {scheduledDraws.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <Calendar size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No draws scheduled yet</p>
        </div>
      )}
    </div>
  );
};

const DrawHistoryTab = () => {
  const [drawHistory, setDrawHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadDrawHistory();
  }, []);

  const loadDrawHistory = async () => {
    try {
      const data = await api.request('/franchise/draws/history');
      setDrawHistory(data);
    } catch (error) {
      console.error('Failed to load draw history:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(drawHistory.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = drawHistory.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="franchise-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      <h2 className="franchise-card-title" style={{ marginBottom: '24px' }}>Draw History</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentItems.map((draw, idx) => (
          <div key={idx} className="franchise-card-v2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #22c55e, #059669)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Trophy size={20} color="white" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: '0 0 2px 0' }}>
                      {draw.group_name || `Group ${draw.group_id}`}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Month {draw.month_number} Draw
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Winner</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                    {draw.winner?.full_name || 'No Winner Yet'}
                  </div>
                  {draw.winner?.mld_id && (
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                      ID: {draw.winner.mld_id}
                    </div>
                  )}
                </div>

                <div style={{ 
                  padding: '12px', 
                  background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))', 
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.2)'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Prize Won</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fbbf24' }}>
                    {draw.prize_name || 'Prize Not Assigned'}
                  </div>
                  {draw.prize_amount && (
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                      Value: ₹{parseFloat(draw.prize_amount).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ 
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #22c55e, #059669)',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>Status</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>
                    Completed
                  </div>
                </div>
                {draw.conducted_at && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {new Date(draw.conducted_at).toLocaleDateString('en-IN')}
                  </div>
                )}
                {draw.draw_date && !draw.conducted_at && (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {draw.draw_date}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {drawHistory.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <Trophy size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No draw history yet</p>
        </div>
      )}
    </div>
  );
};

const EnrollmentsTab = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const data = await api.request('/franchise/enrollments');
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(enrollments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = enrollments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="franchise-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      <h2 className="franchise-card-title" style={{ marginBottom: '24px' }}>Member Enrollments</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {currentItems.map((enrollment) => (
          <div key={enrollment.id} className="franchise-card-v2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
                  {enrollment.user?.full_name || enrollment.user_name || `User ID: ${enrollment.user_id}`}
                </h3>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                  {enrollment.user?.mld_id && `MLD ID: ${enrollment.user.mld_id}`}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  Group: {enrollment.group?.group_name || enrollment.group_id} • 
                  Plan: {enrollment.plan?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  Paid: {enrollment.months_paid || 0}/{enrollment.plan?.duration_months || enrollment.plan_duration || 11} months • 
                  Total: ₹{(enrollment.total_paid || 0).toLocaleString()}
                </div>
              </div>
              <div style={{
                padding: '8px 16px',
                background: enrollment.status === 'active' || enrollment.status === 'ACTIVE'
                  ? 'linear-gradient(135deg, #22c55e, #059669)' 
                  : enrollment.status === 'completed' || enrollment.status === 'COMPLETED'
                  ? 'linear-gradient(135deg, #3b82f6, #0891b2)'
                  : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white',
                textTransform: 'capitalize'
              }}>
                {enrollment.status?.toLowerCase() || 'Active'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px',
              background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Previous
          </button>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px',
              background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            Next
          </button>
        </div>
      )}

      {enrollments.length === 0 && (
        <div className="franchise-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
          <Users size={48} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>No enrollments yet</p>
        </div>
      )}
    </div>
  );
};

const EarningsTab = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const data = await api.request('/franchise/earnings');
      setEarnings(data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="franchise-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      <h2 className="franchise-card-title" style={{ marginBottom: '24px' }}>Franchise Earnings</h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="franchise-card-v2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6, #9333ea)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Total Earnings</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                ₹{(earnings?.total_earnings || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="franchise-card-v2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #22c55e, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>This Month</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                ₹{(earnings?.current_month_earnings || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        <div className="franchise-card-v2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Pending</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
                ₹{(earnings?.pending_earnings || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Group */}
      {earnings?.earnings_by_group && earnings.earnings_by_group.length > 0 && (
        <div className="franchise-card-v2">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
            Earnings by Group
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {earnings.earnings_by_group.map((group, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                      {group.group_name || `Group ${group.group_id}`}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                      {group.member_count || 0} members • {group.transaction_count || 0} transactions
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#fbbf24' }}>
                      ₹{(group.earnings || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      10% commission
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        gap: '8px'
      }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          You earn 10% commission on all payments made by members enrolled in your groups. 
          Earnings are calculated in real-time and settled monthly.
        </div>
      </div>
    </div>
  );
};

const DrawsTab = ({ groups, onRefresh }) => (
  <div className="franchise-card-v2">
    <h2 className="franchise-card-title">Draws</h2>
    <div style={{ color: 'rgba(255,255,255,0.7)' }}>
      Draw management coming soon
    </div>
  </div>
);

// ============== CREATION MODALS ==============

// Create Prize Pool Modal with Confirmation
const CreatePrizePoolModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = confirmation
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prizes: [{ name: '', amount: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const updatePrize = (idx, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[idx][field] = value;
    setFormData({ ...formData, prizes: newPrizes });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    const validPrizes = formData.prizes.filter(p => p.name && p.amount);
    if (validPrizes.length === 0) {
      setError('Please add at least one prize');
      return;
    }
    if (!formData.name.trim()) {
      setError('Prize pool name is required');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const validPrizes = formData.prizes.filter(p => p.name && p.amount);
      await api.createPrizePool({
        ...formData,
        prizes: validPrizes.map(p => ({
          name: p.name,
          amount: parseFloat(p.amount)
        }))
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create prize pool');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="franchise-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div 
        className="franchise-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1b23 0%, #2d1b3d 100%)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>
            {step === 1 ? 'Create Prize Pool' : 'Confirm Prize Pool'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Prize Pool Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., Premium Prize Pool"
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Optional description"
              />
            </div>

            {/* Prizes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Prizes (Max 15) *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.prizes.map((prize, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={prize.name}
                      onChange={(e) => updatePrize(idx, 'name', e.target.value)}
                      placeholder="Prize Name"
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="number"
                      value={prize.amount}
                      onChange={(e) => updatePrize(idx, 'amount', e.target.value)}
                      placeholder="Amount"
                      style={{
                        width: '120px',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                    {formData.prizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrize(idx)}
                        style={{
                          padding: '10px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formData.prizes.length < 15 && (
                <button
                  type="button"
                  onClick={addPrize}
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Prize
                </button>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #e11d48)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            {/* Confirmation Screen */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Please review and confirm
              </h3>

              <div style={{ 
                padding: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{formData.name}</div>
                </div>

                {formData.description && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Description</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{formData.description}</div>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                    Prizes ({formData.prizes.filter(p => p.name && p.amount).length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {formData.prizes.filter(p => p.name && p.amount).map((prize, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ color: 'white', fontSize: '14px' }}>{prize.name}</span>
                        <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>
                          ₹{parseFloat(prize.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loading ? 'rgba(236, 72, 153, 0.5)' : 'linear-gradient(135deg, #ec4899, #e11d48)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Creating...' : (
                  <>
                    <Check size={18} />
                    Confirm & Create
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Plan Modal with Confirmation
const CreatePlanModal = ({ prizePools, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    prize_pool_id: '',
    name: '',
    monthly_amount: '',
    duration_months: '11',
    max_members: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.prize_pool_id || !formData.name || !formData.monthly_amount || !formData.max_members) {
      setError('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.createPlan({
        prize_pool_id: parseInt(formData.prize_pool_id),
        name: formData.name,
        monthly_amount: parseFloat(formData.monthly_amount),
        duration_months: parseInt(formData.duration_months),
        max_members: parseInt(formData.max_members),
        description: formData.description
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create plan');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const selectedPool = prizePools.find(p => p.id === parseInt(formData.prize_pool_id));

  return (
    <div 
      className="franchise-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div 
        className="franchise-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1b23 0%, #1b2d3d 100%)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>
            {step === 1 ? 'Create Plan' : 'Confirm Plan'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            {/* Prize Pool */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Prize Pool *
              </label>
              <select
                value={formData.prize_pool_id}
                onChange={(e) => setFormData({ ...formData, prize_pool_id: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Prize Pool</option>
                {prizePools.filter(p => p.is_active).map((pool) => (
                  <option key={pool.id} value={pool.id}>{pool.name}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Plan Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., Premium Plan"
              />
            </div>

            {/* Monthly Amount */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Monthly Amount (₹) *
              </label>
              <input
                type="number"
                value={formData.monthly_amount}
                onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., 5000"
              />
            </div>

            {/* Duration */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Duration (Months) *
              </label>
              <input
                type="number"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="11"
              />
            </div>

            {/* Max Members */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Max Members per Group *
              </label>
              <input
                type="number"
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                required
                min="2"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., 15"
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Optional description"
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #0891b2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            {/* Confirmation Screen */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Please review and confirm
              </h3>

              <div style={{ 
                padding: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {selectedPool && (
                  <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Prize Pool</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{selectedPool.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      {selectedPool.prizes?.length || 0} prizes
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Plan Name</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{formData.name}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Monthly Amount</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fbbf24' }}>₹{parseFloat(formData.monthly_amount).toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Duration</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{formData.duration_months} months</div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Max Members per Group</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{formData.max_members}</div>
                </div>

                {formData.description && (
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Description</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{formData.description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #0891b2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Creating...' : (
                  <>
                    <Check size={18} />
                    Confirm & Create
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Group Modal with Confirmation
const CreateGroupModal = ({ plans, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    plan_id: '',
    group_name: '',
    max_members: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.plan_id || !formData.group_name || !formData.max_members) {
      setError('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.createGroup({
        plan_id: parseInt(formData.plan_id),
        group_name: formData.group_name,
        max_members: parseInt(formData.max_members)
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create group');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find(p => p.id === parseInt(formData.plan_id));

  return (
    <div 
      className="franchise-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div 
        className="franchise-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1b23 0%, #2d1d3d 100%)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>
            {step === 1 ? 'Create Group' : 'Confirm Group'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext}>
            {/* Plan */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Plan *
              </label>
              <select
                value={formData.plan_id}
                onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Plan</option>
                {plans.filter(p => p.is_active).map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.monthly_amount?.toLocaleString()}/month
                  </option>
                ))}
              </select>
            </div>

            {/* Group Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Group Name *
              </label>
              <input
                type="text"
                value={formData.group_name}
                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., Group Alpha"
              />
            </div>

            {/* Max Members */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
                Max Members *
              </label>
              <input
                type="number"
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                required
                min="2"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
                placeholder="e.g., 15"
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            {/* Confirmation Screen */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
                Please review and confirm
              </h3>

              <div style={{ 
                padding: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {selectedPlan && (
                  <div style={{ marginBottom: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Selected Plan</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{selectedPlan.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      ₹{selectedPlan.monthly_amount?.toLocaleString()}/month • {selectedPlan.duration_months || selectedPlan.duration} months
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Group Name</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>{formData.group_name}</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Max Members</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{formData.max_members}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: loading ? 'rgba(168, 85, 247, 0.5)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Creating...' : (
                  <>
                    <Check size={18} />
                    Confirm & Create
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReferralsTab = ({ user, groups }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const data = await api.request('/franchise/referrals?page=1&limit=100');
      setReferrals(data.users || data.referrals || []);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    if (!selectedGroup) return '';
    const group = groups.find(g => g.id === parseInt(selectedGroup));
    if (!group) return '';
    const franchiseSlug = user?.franchise_slug || user?.franchise_id || 'franchise';
    return `https://millancefurniture.com/join/${franchiseSlug}/${group.group_id}`;
  };

  const handleGenerateQR = async () => {
    const link = generateReferralLink();
    if (!link) return;
    try {
      const qr = await QRCode.toDataURL(link, { width: 300, margin: 2 });
      setQrCodeUrl(qr);
      setShowQR(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = () => {
    const link = generateReferralLink();
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const referralLink = generateReferralLink();
  const totalPages = Math.ceil(referrals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = referrals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Referral Link Generator */}
      <div className="franchise-card-v2" style={{ marginBottom: '24px' }}>
        <h2 className="franchise-card-title" style={{ marginBottom: '16px' }}>Generate Referral Link</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', display: 'block' }}>
              Select Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="">Choose a group...</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.group_name} ({group.current_members}/{group.max_members} members)
                </option>
              ))}
            </select>
          </div>

          {referralLink && (
            <div>
              <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', display: 'block' }}>
                Your Referral Link
              </label>
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #3b82f6, #0891b2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button
                  onClick={handleGenerateQR}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <QrCode size={16} />
                  QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowQR(false)}
        >
          <div 
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Scan QR Code</h3>
            <img src={qrCodeUrl} alt="QR Code" style={{ display: 'block', margin: '0 auto' }} />
            <button
              onClick={() => setShowQR(false)}
              style={{
                marginTop: '16px',
                padding: '8px 24px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Referrals List */}
      <div className="franchise-card-v2">
        <h2 className="franchise-card-title" style={{ marginBottom: '16px' }}>
          Referral History ({referrals.length})
        </h2>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading...</p>
        ) : currentItems.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No referrals yet</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentItems.map((referral, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                        {referral.full_name || referral.user_name || referral.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                        {referral.mld_id && `MLD: ${referral.mld_id} • `}
                        Group: {referral.group_name || 'N/A'}
                      </div>
                      {referral.payments_made !== undefined && (
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                          Payments: {referral.payments_made}/{referral.total_payments} • 
                          Total: ₹{(referral.total_paid || 0).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        padding: '4px 12px',
                        background: 'linear-gradient(135deg, #22c55e, #059669)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px'
                      }}>
                        Active
                      </div>
                      {referral.commission_earned !== undefined && (
                        <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '600' }}>
                          Earned: ₹{referral.commission_earned.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px'
              }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: page === 1 ? 'rgba(255,255,255,0.3)' : 'white',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Previous
                </button>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: '8px 16px',
                    background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: page === totalPages ? 'rgba(255,255,255,0.3)' : 'white',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Schedule Draw Modal
const ScheduleDrawModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    group_id: '',
    draw_date: '',
    draw_time: '19:00',
    month_number: ''
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await api.getFranchiseGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.request('/franchise/draws/schedule', {
        method: 'POST',
        body: JSON.stringify({
          group_id: parseInt(formData.group_id),
          draw_date: formData.draw_date,
          draw_time: formData.draw_time,
          month_number: parseInt(formData.month_number)
        })
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to schedule draw');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="franchise-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div 
        className="franchise-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1b23 0%, #1b2d3d 100%)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>
            Schedule Draw
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Group */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
              Group *
            </label>
            <select
              value={formData.group_id}
              onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
              required
              disabled={loadingGroups}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="">{loadingGroups ? 'Loading...' : 'Select Group'}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name} ({group.current_members}/{group.max_members} members)
                </option>
              ))}
            </select>
          </div>

          {/* Month Number */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
              Month Number *
            </label>
            <input
              type="number"
              value={formData.month_number}
              onChange={(e) => setFormData({ ...formData, month_number: e.target.value })}
              required
              min="1"
              max="11"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
              placeholder="e.g., 1"
            />
          </div>

          {/* Draw Date */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
              Draw Date *
            </label>
            <input
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Draw Time */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600' }}>
              Draw Time *
            </label>
            <input
              type="time"
              value={formData.draw_time}
              onChange={(e) => setFormData({ ...formData, draw_time: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #0891b2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Scheduling...' : 'Schedule Draw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FranchiseDashboardV2;
