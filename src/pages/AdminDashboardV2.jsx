import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  LayoutDashboard, Users, Building, Gift, FileText, 
  UsersRound, Calendar, Trophy, DollarSign, AlertCircle,
  LogOut, Plus, Search, X, Check, TrendingUp, Wallet
} from 'lucide-react';
import '../styles/AdminDashboardV2.css';

const AdminDashboardV2 = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.getAdminStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'franchises', label: 'Franchises', icon: Building },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'prizes', label: 'Prize Pools', icon: Gift },
    { id: 'plans', label: 'Plans', icon: FileText },
    { id: 'groups', label: 'Groups', icon: UsersRound },
    { id: 'enrollments', label: 'Enrollments', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'draws', label: 'Draws', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  if (loading && !stats) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-loading">
        <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
          <AlertCircle size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
          <p>Unable to load admin data. Please check your connection and refresh.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #9333EA, #EC4899)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-v2">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">A</div>
            <div className="admin-logo-text">
              <h2>ADMIN</h2>
              <p>Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Welcome Header */}
        <div className="admin-welcome-header">
          <div className="admin-welcome-content">
            <div className="admin-welcome-text">
              <h1>Welcome, Administrator</h1>
              <div className="admin-welcome-info">
                <div className="admin-welcome-info-item">
                  <strong>Email:</strong> {user?.email || 'admin@millancefurniture.com'}
                </div>
                <div className="admin-welcome-info-item">
                  <strong>Role:</strong> Super Admin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
        {activeTab === 'franchises' && <FranchisesTab showToast={showToast} />}
        {activeTab === 'users' && <UsersTab showToast={showToast} />}
        {activeTab === 'prizes' && <PrizePoolsTab showToast={showToast} />}
        {activeTab === 'plans' && <PlansTab showToast={showToast} />}
        {activeTab === 'groups' && <GroupsTab showToast={showToast} />}
        {activeTab === 'enrollments' && <EnrollmentsTab showToast={showToast} />}
        {activeTab === 'payments' && <PaymentsTab showToast={showToast} />}
        {activeTab === 'draws' && <DrawsTab showToast={showToast} />}
        {activeTab === 'reports' && <ReportsTab stats={stats} />}
      </main>
    </div>
  );
};

// Dashboard Tab
const DashboardTab = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Users',
      value: ((stats?.total_users || 0)).toLocaleString(),
      subtitle: 'Registered members',
      icon: Users,
      gradient: 'linear-gradient(135deg, #3b82f6, #0891b2)',
      change: '+12%'
    },
    {
      label: 'Total Franchises',
      value: (stats?.total_franchises || 0).toString(),
      subtitle: 'Active franchises',
      icon: Building,
      gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      change: '+5%'
    },
    {
      label: 'Total Revenue',
      value: `₹${((stats?.total_revenue || 0)).toLocaleString()}`,
      subtitle: 'Lifetime earnings',
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #22c55e, #059669)',
      change: '+18%'
    },
    {
      label: 'Active Groups',
      value: (stats?.total_groups || 0).toString(),
      subtitle: 'Running groups',
      icon: UsersRound,
      gradient: 'linear-gradient(135deg, #8b5cf6, #9333ea)',
      change: '+8%'
    },
    {
      label: 'Prize Pools',
      value: (stats?.total_prize_pools || 0).toString(),
      subtitle: 'Available pools',
      icon: Gift,
      gradient: 'linear-gradient(135deg, #ec4899, #e11d48)',
      change: '+3%'
    },
    {
      label: 'Pending Payments',
      value: (stats?.pending_payments || 0).toString(),
      subtitle: 'Awaiting clearance',
      icon: AlertCircle,
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      change: '-2%'
    }
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="admin-stat-card">
            <div className="admin-stat-content">
              <div className="admin-stat-icon" style={{ background: stat.gradient }}>
                <stat.icon />
              </div>
              <div className="admin-stat-details">
                <p className="admin-stat-label">{stat.label}</p>
                <h3 className="admin-stat-value">{stat.value}</h3>
                <div className="admin-stat-footer">
                  <p className="admin-stat-subtitle">{stat.subtitle}</p>
                  <span className={`admin-stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="admin-card-v2">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent Activity</h2>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
              <Users size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">New user registered</p>
              <p className="activity-subtitle">MLD ID: MLD123456 • 2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              <Building size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">New franchise onboarded</p>
              <p className="activity-subtitle">Mumbai Central Branch • 5 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #e11d48)' }}>
              <Gift size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">Prize pool created</p>
              <p className="activity-subtitle">Gold Plan - ₹5,00,000 • Yesterday</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
              <Trophy size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">Draw conducted</p>
              <p className="activity-subtitle">Group Alpha - Month 5 • Yesterday</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
              <DollarSign size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">Payment received</p>
              <p className="activity-subtitle">₹10,000 - User MLD789 • 2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card-v2">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <button className="quick-action-btn" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            <Building size={24} />
            <span>Create Franchise</span>
          </button>
          <button className="quick-action-btn" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
            <Users size={24} />
            <span>Add User</span>
          </button>
          <button className="quick-action-btn" style={{ background: 'linear-gradient(135deg, #ec4899, #e11d48)' }}>
            <Gift size={24} />
            <span>Create Prize Pool</span>
          </button>
          <button className="quick-action-btn" style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
            <Trophy size={24} />
            <span>Schedule Draw</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Franchises Tab
const FranchisesTab = ({ showToast }) => {
  const navigate = useNavigate();
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    loadFranchises();
  }, []);

  const loadFranchises = async () => {
    try {
      const data = await api.getAllFranchises();
      setFranchises(data);
    } catch (error) {
      console.error('Failed to load franchises:', error);
      showToast('Failed to load franchises: ' + error.message, 'error');
      setFranchises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (franchiseId, currentStatus) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this franchise?`)) {
      try {
        await api.updateFranchiseStatus(franchiseId, !currentStatus);
        showToast('Franchise status updated', 'success');
        loadFranchises();
      } catch (error) {
        showToast('Failed to update status', 'error');
      }
    }
  };

  // Filter franchises
  let filteredFranchises = franchises;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredFranchises = franchises.filter(f =>
      f.franchise_name?.toLowerCase().includes(query) ||
      f.franchise_code?.toLowerCase().includes(query) ||
      f.email?.toLowerCase().includes(query) ||
      f.phone?.includes(query)
    );
  }

  const totalPages = Math.ceil(filteredFranchises.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredFranchises.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Franchise Management</h2>
        <button className="admin-create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Franchise
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, code, email, or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Franchises Grid */}
      <div className="admin-grid">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <Building size={48} style={{ opacity: 0.3 }} />
            <p>No franchises found</p>
          </div>
        ) : (
          currentItems.map((franchise) => (
            <div key={franchise.id} className="admin-card-v2 franchise-card">
              <div className="franchise-card-header">
                <div className="franchise-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                  <Building size={28} />
                </div>
                <div className="franchise-info">
                  <h3>{franchise.franchise_name}</h3>
                  <span className="franchise-code">{franchise.franchise_code}</span>
                </div>
                <button
                  className={`toggle-status ${franchise.is_active ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleStatus(franchise.id, franchise.is_active)}
                  title={franchise.is_active ? 'Deactivate' : 'Activate'}
                >
                  {franchise.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="franchise-card-body">
                <div className="franchise-contact">
                  <div className="contact-row">
                    <span className="label">Email:</span>
                    <span className="value">{franchise.email}</span>
                  </div>
                  <div className="contact-row">
                    <span className="label">Phone:</span>
                    <span className="value">{franchise.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="franchise-stats">
                  <div className="stat-item">
                    <UsersRound size={16} />
                    <span>Groups: {franchise.total_groups || 0}</span>
                  </div>
                  <div className="stat-item">
                    <Users size={16} />
                    <span>Members: {franchise.total_members || 0}</span>
                  </div>
                </div>

                <button 
                  className="view-details-btn"
                  onClick={() => navigate(`/admin-dashboard/franchise/${franchise.id}`)}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateFranchiseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadFranchises();
            showToast('Franchise created successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};

// Create Franchise Modal
const CreateFranchiseModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
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

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.franchise_name || !formData.franchise_code || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.createFranchise(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create franchise');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? 'Create Franchise' : 'Confirm Franchise'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="modal-form">
            <div className="input-group">
              <label>Franchise Name *</label>
              <input
                type="text"
                className="input"
                value={formData.franchise_name}
                onChange={(e) => setFormData({ ...formData, franchise_name: e.target.value })}
                placeholder="e.g., Mumbai Central"
                required
              />
            </div>

            <div className="input-group">
              <label>Franchise Code *</label>
              <input
                type="text"
                className="input"
                value={formData.franchise_code}
                onChange={(e) => setFormData({ ...formData, franchise_code: e.target.value })}
                placeholder="e.g., MUMB-001"
                required
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="franchise@example.com"
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
                placeholder="+91 9876543210"
              />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea
                className="input"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Optional address"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="confirmation-content">
              <h3>Please review and confirm</h3>
              
              <div className="confirm-details">
                <div className="confirm-row">
                  <span className="label">Franchise Name:</span>
                  <strong>{formData.franchise_name}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Code:</span>
                  <strong>{formData.franchise_code}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Email:</span>
                  <strong>{formData.email}</strong>
                </div>
                {formData.phone && (
                  <div className="confirm-row">
                    <span className="label">Phone:</span>
                    <strong>{formData.phone}</strong>
                  </div>
                )}
                {formData.address && (
                  <div className="confirm-row">
                    <span className="label">Address:</span>
                    <strong>{formData.address}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
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

// Users Tab
const UsersTab = ({ showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      showToast('Failed to load users: ' + error.message, 'error');
      // Set empty array so UI shows "no users" instead of blank page
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  let filteredUsers = users;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredUsers = users.filter(u =>
      u.full_name?.toLowerCase().includes(query) ||
      u.mld_id?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.includes(query)
    );
  }

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="admin-card-v2" style={{ textAlign: 'center', padding: '48px' }}>
        <div className="admin-spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '16px' }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">User Management</h2>
        <button className="admin-create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create User
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, MLD ID, email, or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Users Grid */}
      <div className="admin-grid">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <Users size={48} style={{ opacity: 0.3 }} />
            <p>No users found</p>
          </div>
        ) : (
          currentItems.map((user) => (
            <div 
              key={user.id} 
              className="admin-card-v2 user-card"
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <div className="user-card-header">
                <div className="user-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
                  <Users size={28} />
                </div>
                <div className="user-info">
                  <h3>{user.full_name}</h3>
                  <span className="user-id">{user.mld_id}</span>
                </div>
              </div>

              <div className="user-card-body">
                <div className="user-contact">
                  <div className="contact-row">
                    <Mail size={14} />
                    <span className="value">{user.email}</span>
                  </div>
                  <div className="contact-row">
                    <Phone size={14} />
                    <span className="value">{user.phone}</span>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="stat-item">
                    <Wallet size={14} />
                    <span>Balance: ₹{(user.wallet_balance || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadUsers();
            showToast('User created successfully!', 'success');
          }}
        />
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

// Prize Pools Tab
const PrizePoolsTab = ({ showToast }) => {
  const [prizePools, setPrizePools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    loadPrizePools();
  }, []);

  const loadPrizePools = async () => {
    try {
      const data = await api.request('/admin/prize-pools');
      setPrizePools(data);
    } catch (error) {
      console.error('Failed to load prize pools:', error);
      showToast('Failed to load prize pools: ' + error.message, 'error');
      setPrizePools([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter prize pools
  let filteredPools = prizePools;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPools = prizePools.filter(p =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredPools.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredPools.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Prize Pool Management</h2>
        <button className="admin-create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Prize Pool
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Prize Pools Grid */}
      <div className="admin-grid">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <Gift size={48} style={{ opacity: 0.3 }} />
            <p>No prize pools found</p>
          </div>
        ) : (
          currentItems.map((pool) => (
            <div key={pool.id} className="admin-card-v2 prize-card">
              <div className="prize-card-header">
                <div className="prize-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #e11d48)' }}>
                  <Gift size={28} />
                </div>
                <div className="prize-info">
                  <h3>{pool.name}</h3>
                  <span className={`status-badge ${pool.is_active ? 'active' : 'inactive'}`}>
                    {pool.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="prize-card-body">
                <p className="prize-description">
                  {pool.description || 'No description'}
                </p>

                {pool.prizes && pool.prizes.length > 0 && (
                  <div className="prizes-list">
                    <p className="prizes-label">Prizes ({pool.prizes.length}):</p>
                    {pool.prizes.slice(0, 3).map((prize, idx) => (
                      <div key={idx} className="prize-item">
                        <span className="prize-name">{prize.name}</span>
                        <span className="prize-amount">₹{prize.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                    {pool.prizes.length > 3 && (
                      <p className="more-prizes">+{pool.prizes.length - 3} more prizes</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePrizePoolModalAdmin
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadPrizePools();
            showToast('Prize pool created successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};

// Plans Tab
const PlansTab = ({ showToast }) => {
  const [plans, setPlans] = useState([]);
  const [prizePools, setPrizePools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, poolsData] = await Promise.all([
        api.request('/admin/plans'),
        api.request('/admin/prize-pools')
      ]);
      setPlans(plansData);
      setPrizePools(poolsData);
    } catch (error) {
      console.error('Failed to load plans:', error);
      showToast('Failed to load plans: ' + error.message, 'error');
      setPlans([]);
      setPrizePools([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter plans
  let filteredPlans = plans;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPlans = plans.filter(p =>
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Plan Management</h2>
        <button className="admin-create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Plan
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Plans Grid */}
      <div className="admin-grid">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <FileText size={48} style={{ opacity: 0.3 }} />
            <p>No plans found</p>
          </div>
        ) : (
          currentItems.map((plan) => {
            const prizePool = prizePools.find(p => p.id === plan.prize_pool_id);
            return (
              <div key={plan.id} className="admin-card-v2 plan-card">
                <div className="plan-card-header">
                  <div className="plan-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #9333ea)' }}>
                    <FileText size={28} />
                  </div>
                  <div className="plan-info">
                    <h3>{plan.name}</h3>
                    <span className={`status-badge ${plan.is_active ? 'active' : 'inactive'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="plan-card-body">
                  {prizePool && (
                    <p className="plan-pool">Prize Pool: {prizePool.name}</p>
                  )}
                  {plan.description && (
                    <p className="plan-description">{plan.description}</p>
                  )}

                  <div className="plan-details">
                    <div className="detail-row">
                      <span className="label">Monthly Amount:</span>
                      <strong className="value">₹{plan.monthly_amount?.toLocaleString()}</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <strong className="value">{plan.duration_months} months</strong>
                    </div>
                    <div className="detail-row">
                      <span className="label">Max Members:</span>
                      <strong className="value">{plan.max_members?.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePlanModalAdmin
          prizePools={prizePools}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
            showToast('Plan created successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};

// Groups Tab
const GroupsTab = ({ showToast }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupsData, franchisesData] = await Promise.all([
        api.request('/admin/groups'),
        api.getAllFranchises()
      ]);
      setGroups(groupsData);
      setFranchises(franchisesData);
    } catch (error) {
      console.error('Failed to load groups:', error);
      showToast('Failed to load groups: ' + error.message, 'error');
      setGroups([]);
      setFranchises([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter groups
  let filteredGroups = groups;
  
  // Franchise filter
  if (franchiseFilter !== 'all') {
    filteredGroups = filteredGroups.filter(g => g.franchise_id === parseInt(franchiseFilter));
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredGroups = filteredGroups.filter(g =>
      g.group_name?.toLowerCase().includes(query) ||
      g.group_id?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Group Management</h2>
      </div>

      {/* Filters */}
      <div className="filters-row">
        {/* Franchise Filter */}
        <div className="filter-group">
          <label>Filter by Franchise:</label>
          <select
            className="filter-select"
            value={franchiseFilter}
            onChange={(e) => {
              setFranchiseFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Franchises</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>
                {f.franchise_name} ({f.franchise_code})
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container" style={{ flex: 1 }}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by group name or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="admin-grid">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <UsersRound size={48} style={{ opacity: 0.3 }} />
            <p>No groups found</p>
          </div>
        ) : (
          currentItems.map((group) => {
            const franchise = franchises.find(f => f.id === group.franchise_id);
            return (
              <div 
                key={group.id} 
                className="admin-card-v2 group-card"
                onClick={() => navigate(`/franchise-dashboard/group/${group.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="group-card-header">
                  <div className="group-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                    <UsersRound size={28} />
                  </div>
                  <div className="group-info">
                    <h3>{group.group_name}</h3>
                    <span className="group-id">{group.group_id}</span>
                  </div>
                </div>

                <div className="group-card-body">
                  {franchise && (
                    <p className="group-franchise">
                      Franchise: {franchise.franchise_name}
                    </p>
                  )}

                  <div className="group-stats">
                    <div className="stat-item">
                      <Users size={14} />
                      <span>{group.current_members || 0}/{group.max_members || 0} members</span>
                    </div>
                    <div className="stat-item">
                      <span className={`status-badge ${group.status}`}>
                        {group.status || 'active'}
                      </span>
                    </div>
                  </div>

                  <div className="view-details-hint">
                    Click to view details →
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Enrollments Tab
const EnrollmentsTab = ({ showToast }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [franchiseFilter, setFranchiseFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsData, franchisesData] = await Promise.all([
        api.request('/admin/enrollments'),
        api.getAllFranchises()
      ]);
      setEnrollments(enrollmentsData);
      setFranchises(franchisesData);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
      showToast('Failed to load enrollments: ' + error.message, 'error');
      setEnrollments([]);
      setFranchises([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter enrollments
  let filteredEnrollments = enrollments;

  // Status filter
  if (statusFilter !== 'all') {
    filteredEnrollments = filteredEnrollments.filter(e => e.enrollment_status === statusFilter);
  }

  // Franchise filter
  if (franchiseFilter !== 'all') {
    filteredEnrollments = filteredEnrollments.filter(e => e.franchise_id === parseInt(franchiseFilter));
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredEnrollments = filteredEnrollments.filter(e =>
      e.full_name?.toLowerCase().includes(query) ||
      e.mld_id?.toLowerCase().includes(query) ||
      e.email?.toLowerCase().includes(query) ||
      e.phone?.includes(query) ||
      e.group_name?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredEnrollments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Enrollment Management</h2>
      </div>

      {/* Filters */}
      <div className="filters-row">
        {/* Status Filter */}
        <div className="filter-group">
          <label>Status:</label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Franchise Filter */}
        <div className="filter-group">
          <label>Franchise:</label>
          <select
            className="filter-select"
            value={franchiseFilter}
            onChange={(e) => {
              setFranchiseFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Franchises</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>
                {f.franchise_name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container" style={{ flex: 1 }}>
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, MLD ID, email, phone, or group..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Enrollments List */}
      <div className="enrollments-list">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <Calendar size={48} style={{ opacity: 0.3 }} />
            <p>No enrollments found</p>
          </div>
        ) : (
          currentItems.map((enrollment) => {
            const franchise = franchises.find(f => f.id === enrollment.franchise_id);
            return (
              <div key={enrollment.id} className="enrollment-row">
                <div className="enrollment-user">
                  <h4>{enrollment.full_name}</h4>
                  <p>{enrollment.mld_id}</p>
                </div>

                <div className="enrollment-details">
                  <div className="detail-item">
                    <Mail size={14} />
                    <span>{enrollment.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={14} />
                    <span>{enrollment.phone}</span>
                  </div>
                  <div className="detail-item">
                    <UsersRound size={14} />
                    <span>{enrollment.group_name}</span>
                  </div>
                  {franchise && (
                    <div className="detail-item">
                      <Building size={14} />
                      <span>{franchise.franchise_name}</span>
                    </div>
                  )}
                </div>

                <div className="enrollment-stats">
                  <div className="stat-box">
                    <span className="stat-label">Total Paid</span>
                    <span className="stat-value">₹{(enrollment.total_paid || 0).toLocaleString()}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Months Paid</span>
                    <span className="stat-value">{enrollment.months_paid || 0}</span>
                  </div>
                </div>

                <div className={`status-badge ${enrollment.enrollment_status}`}>
                  {enrollment.enrollment_status || 'active'}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Payments Tab
const PaymentsTab = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.request('/admin/payments');
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
      showToast('Failed to load payments: ' + error.message, 'error');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter payments by sub-tab
  let filteredPayments = payments;

  if (activeSubTab === 'successful') {
    filteredPayments = payments.filter(p => p.payment_status === 'completed');
  } else if (activeSubTab === 'pending') {
    filteredPayments = payments.filter(p => p.payment_status === 'pending');
  } else if (activeSubTab === 'failed') {
    filteredPayments = payments.filter(p => p.payment_status === 'failed');
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPayments = filteredPayments.filter(p =>
      p.full_name?.toLowerCase().includes(query) ||
      p.mld_id?.toLowerCase().includes(query) ||
      p.payment_id?.toLowerCase().includes(query) ||
      p.transaction_id?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const successfulCount = payments.filter(p => p.payment_status === 'completed').length;
  const pendingCount = payments.filter(p => p.payment_status === 'pending').length;
  const failedCount = payments.filter(p => p.payment_status === 'failed').length;

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Payment Management</h2>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tabs">
        <button
          className={`sub-tab-btn ${activeSubTab === 'all' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('all');
            setPage(1);
          }}
        >
          All Payments ({payments.length})
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'successful' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('successful');
            setPage(1);
          }}
        >
          Successful ({successfulCount})
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'pending' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('pending');
            setPage(1);
          }}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'failed' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('failed');
            setPage(1);
          }}
        >
          Failed ({failedCount})
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, MLD ID, payment ID, or transaction ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Payments List */}
      <div className="payments-list">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <DollarSign size={48} style={{ opacity: 0.3 }} />
            <p>No payments found</p>
          </div>
        ) : (
          currentItems.map((payment) => (
            <div key={payment.id} className="payment-row">
              <div className="payment-user">
                <h4>{payment.full_name || 'Unknown User'}</h4>
                <p>{payment.mld_id}</p>
              </div>

              <div className="payment-details">
                <div className="detail-item">
                  <span className="label">Amount:</span>
                  <strong className="amount">₹{(payment.amount || 0).toLocaleString()}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Payment ID:</span>
                  <span className="value">{payment.payment_id || 'N/A'}</span>
                </div>
                {payment.transaction_id && (
                  <div className="detail-item">
                    <span className="label">Transaction ID:</span>
                    <span className="value">{payment.transaction_id}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {payment.payment_date 
                      ? new Date(payment.payment_date).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className={`status-badge ${payment.payment_status}`}>
                {payment.payment_status || 'pending'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Draws Tab
const DrawsTab = ({ showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('scheduled');
  const [scheduledDraws, setScheduledDraws] = useState([]);
  const [historyDraws, setHistoryDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadDraws();
  }, []);

  const loadDraws = async () => {
    try {
      // Note: Adjust endpoints as needed
      const scheduled = await api.request('/admin/draws/scheduled').catch(() => []);
      const history = await api.request('/admin/draws/history').catch(() => []);
      
      setScheduledDraws(scheduled);
      setHistoryDraws(history);
    } catch (error) {
      console.error('Failed to load draws:', error);
      showToast('Failed to load draws: ' + error.message, 'error');
      setScheduledDraws([]);
      setHistoryDraws([]);
    } finally {
      setLoading(false);
    }
  };

  const draws = activeSubTab === 'scheduled' ? scheduledDraws : historyDraws;
  const totalPages = Math.ceil(draws.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = draws.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="tab-header">
        <h2 className="tab-title">Draw Management</h2>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tabs">
        <button
          className={`sub-tab-btn ${activeSubTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('scheduled');
            setPage(1);
          }}
        >
          Scheduled ({scheduledDraws.length})
        </button>
        <button
          className={`sub-tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('history');
            setPage(1);
          }}
        >
          History ({historyDraws.length})
        </button>
      </div>

      {/* Draws List */}
      <div className="draws-list">
        {currentItems.length === 0 ? (
          <div className="no-results">
            <Trophy size={48} style={{ opacity: 0.3 }} />
            <p>No {activeSubTab === 'scheduled' ? 'scheduled' : 'past'} draws found</p>
          </div>
        ) : (
          currentItems.map((draw) => (
            <div key={draw.id} className="draw-card">
              <div className="draw-header">
                <div className="draw-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                  <Trophy size={24} />
                </div>
                <div className="draw-info">
                  <h3>{draw.group_name || 'Unknown Group'}</h3>
                  <p>Month {draw.month_number} Draw</p>
                </div>
                {draw.status && (
                  <span className={`status-badge ${draw.status}`}>
                    {draw.status}
                  </span>
                )}
              </div>

              <div className="draw-details">
                {draw.winner && (
                  <div className="detail-row">
                    <span className="label">Winner:</span>
                    <strong>{draw.winner.full_name} ({draw.winner.mld_id})</strong>
                  </div>
                )}
                {draw.prize_name && (
                  <div className="detail-row">
                    <span className="label">Prize Won:</span>
                    <strong>{draw.prize_name}</strong>
                  </div>
                )}
                {draw.prize_amount && (
                  <div className="detail-row">
                    <span className="label">Value:</span>
                    <strong className="amount">₹{draw.prize_amount.toLocaleString()}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">{activeSubTab === 'scheduled' ? 'Scheduled For' : 'Conducted On'}:</span>
                  <strong>
                    {draw.draw_date || draw.conducted_at
                      ? new Date(draw.draw_date || draw.conducted_at).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Reports Tab
const ReportsTab = ({ stats }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueReport();
  }, []);

  const loadRevenueReport = async () => {
    try {
      const data = await api.request('/admin/revenue-report');
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to load revenue report:', error);
      // Don't show toast for reports as it's not critical
      setRevenueData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-card-v2"><p style={{ color: 'white' }}>Loading...</p></div>;
  }

  return (
    <div>
      <h2 className="tab-title" style={{ marginBottom: '24px' }}>Reports & Analytics</h2>

      {/* Revenue Stats */}
      <div className="admin-card-v2">
        <h3 className="admin-card-title">Revenue Overview</h3>
        <div className="revenue-grid">
          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
              <DollarSign size={28} />
            </div>
            <div>
              <p className="revenue-label">Total Revenue</p>
              <h3 className="revenue-value">₹{((stats?.total_revenue || 0)).toLocaleString()}</h3>
              <p className="revenue-subtitle">All time</p>
            </div>
          </div>

          {revenueData && revenueData.franchise_breakdown && (
            <>
              <div className="revenue-card">
                <div className="revenue-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
                  <Building size={28} />
                </div>
                <div>
                  <p className="revenue-label">Top Franchise</p>
                  <h3 className="revenue-value">
                    {revenueData.franchise_breakdown[0]?.franchise_name || 'N/A'}
                  </h3>
                  <p className="revenue-subtitle">
                    ₹{(revenueData.franchise_breakdown[0]?.total_revenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
              <Users size={28} />
            </div>
            <div>
              <p className="revenue-label">Total Users</p>
              <h3 className="revenue-value">{(stats?.total_users || 0).toLocaleString()}</h3>
              <p className="revenue-subtitle">Registered members</p>
            </div>
          </div>

          <div className="revenue-card">
            <div className="revenue-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #e11d48)' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="revenue-label">Avg per User</p>
              <h3 className="revenue-value">
                ₹{stats?.total_users > 0 
                  ? Math.round((stats.total_revenue || 0) / stats.total_users).toLocaleString()
                  : 0}
              </h3>
              <p className="revenue-subtitle">Average revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Franchise Breakdown */}
      {revenueData && revenueData.franchise_breakdown && revenueData.franchise_breakdown.length > 0 && (
        <div className="admin-card-v2">
          <h3 className="admin-card-title">Revenue by Franchise</h3>
          <div className="franchise-revenue-list">
            {revenueData.franchise_breakdown.map((franchise, idx) => (
              <div key={idx} className="franchise-revenue-item">
                <div className="franchise-rank">#{idx + 1}</div>
                <div className="franchise-revenue-info">
                  <h4>{franchise.franchise_name}</h4>
                  <p>{franchise.franchise_code}</p>
                </div>
                <div className="franchise-revenue-stats">
                  <div className="stat">
                    <span className="label">Users:</span>
                    <strong>{franchise.total_users || 0}</strong>
                  </div>
                  <div className="stat">
                    <span className="label">Revenue:</span>
                    <strong className="amount">₹{(franchise.total_revenue || 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Stats */}
      <div className="admin-card-v2">
        <h3 className="admin-card-title">System Statistics</h3>
        <div className="system-stats-grid">
          <div className="system-stat">
            <Building size={20} />
            <div>
              <p className="stat-label">Total Franchises</p>
              <p className="stat-value">{stats?.total_franchises || 0}</p>
            </div>
          </div>
          <div className="system-stat">
            <UsersRound size={20} />
            <div>
              <p className="stat-label">Total Groups</p>
              <p className="stat-value">{stats?.total_groups || 0}</p>
            </div>
          </div>
          <div className="system-stat">
            <Gift size={20} />
            <div>
              <p className="stat-label">Prize Pools</p>
              <p className="stat-value">{stats?.total_prize_pools || 0}</p>
            </div>
          </div>
          <div className="system-stat">
            <AlertCircle size={20} />
            <div>
              <p className="stat-label">Pending Payments</p>
              <p className="stat-value">{stats?.pending_payments || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Details Modal
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Details</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div className="user-modal-header">
            <div className="user-modal-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
              <Users size={32} />
            </div>
            <div>
              <h3>{user.full_name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0' }}>{user.mld_id}</p>
            </div>
          </div>

          <div className="modal-section">
            <h4>Contact Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <Mail size={16} />
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{user.email}</p>
                </div>
              </div>
              <div className="info-item">
                <Phone size={16} />
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">{user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4>Wallet Information</h4>
            <div className="wallet-info">
              <Wallet size={20} />
              <div>
                <p className="info-label">Balance</p>
                <p className="info-value">₹{(user.wallet_balance || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {user.address && (
            <div className="modal-section">
              <h4>Address</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>{user.address}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} style={{ width: '100%' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Create User Modal
const CreateUserModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.request('/admin/users/create', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create user');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? 'Create User' : 'Confirm User'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="modal-form">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="input"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
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
                placeholder="+91 9876543210"
              />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <textarea
                className="input"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Optional address"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="confirmation-content">
              <h3>Please review and confirm</h3>
              
              <div className="confirm-details">
                <div className="confirm-row">
                  <span className="label">Full Name:</span>
                  <strong>{formData.full_name}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Email:</span>
                  <strong>{formData.email}</strong>
                </div>
                {formData.phone && (
                  <div className="confirm-row">
                    <span className="label">Phone:</span>
                    <strong>{formData.phone}</strong>
                  </div>
                )}
                {formData.address && (
                  <div className="confirm-row">
                    <span className="label">Address:</span>
                    <strong>{formData.address}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
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

// Create Prize Pool Modal (Admin)
const CreatePrizePoolModalAdmin = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prizes: [{ name: '', amount: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPrize = () => {
    setFormData({
      ...formData,
      prizes: [...formData.prizes, { name: '', amount: '' }]
    });
  };

  const removePrize = (index) => {
    const newPrizes = formData.prizes.filter((_, i) => i !== index);
    setFormData({ ...formData, prizes: newPrizes });
  };

  const updatePrize = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData({ ...formData, prizes: newPrizes });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name) {
      setError('Pool name is required');
      return;
    }
    
    const validPrizes = formData.prizes.filter(p => p.name && p.amount);
    if (validPrizes.length === 0) {
      setError('At least one prize is required');
      return;
    }
    
    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const validPrizes = formData.prizes.filter(p => p.name && p.amount);
      const payload = {
        name: formData.name,
        description: formData.description,
        prizes: validPrizes.map(p => ({
          name: p.name,
          amount: parseFloat(p.amount)
        }))
      };

      await api.createPrizePool(payload);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create prize pool');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? 'Create Prize Pool' : 'Confirm Prize Pool'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="modal-form">
            <div className="input-group">
              <label>Pool Name *</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Gold Prize Pool"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                className="input"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="input-group">
              <label>Prizes *</label>
              {formData.prizes.map((prize, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Prize name"
                    value={prize.name}
                    onChange={(e) => updatePrize(index, 'name', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="Amount"
                    value={prize.amount}
                    onChange={(e) => updatePrize(index, 'amount', e.target.value)}
                    style={{ width: '120px' }}
                  />
                  {formData.prizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrize(index)}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPrize}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  color: '#a855f7',
                  cursor: 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={16} />
                Add Prize
              </button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="confirmation-content">
              <h3>Please review and confirm</h3>
              
              <div className="confirm-details">
                <div className="confirm-row">
                  <span className="label">Pool Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                {formData.description && (
                  <div className="confirm-row">
                    <span className="label">Description:</span>
                    <strong>{formData.description}</strong>
                  </div>
                )}
                <div className="confirm-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="label">Prizes:</span>
                  {formData.prizes.filter(p => p.name && p.amount).map((prize, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      padding: '4px 0'
                    }}>
                      <span>{prize.name}</span>
                      <strong>₹{parseFloat(prize.amount).toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
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

// Create Plan Modal (Admin)
const CreatePlanModalAdmin = ({ prizePools, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prize_pool_id: '',
    monthly_amount: '',
    duration_months: '11',
    max_members: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.prize_pool_id || !formData.monthly_amount || !formData.max_members) {
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
        ...formData,
        prize_pool_id: parseInt(formData.prize_pool_id),
        monthly_amount: parseFloat(formData.monthly_amount),
        duration_months: parseInt(formData.duration_months),
        max_members: parseInt(formData.max_members)
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? 'Create Plan' : 'Confirm Plan'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="modal-form">
            <div className="input-group">
              <label>Plan Name *</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Plan"
                required
              />
            </div>

            <div className="input-group">
              <label>Prize Pool *</label>
              <select
                className="input"
                value={formData.prize_pool_id}
                onChange={(e) => setFormData({ ...formData, prize_pool_id: e.target.value })}
                required
              >
                <option value="">Select Prize Pool</option>
                {prizePools.map(pool => (
                  <option key={pool.id} value={pool.id}>
                    {pool.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Monthly Amount *</label>
              <input
                type="number"
                className="input"
                value={formData.monthly_amount}
                onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                placeholder="1000"
                required
              />
            </div>

            <div className="input-group">
              <label>Duration (months) *</label>
              <input
                type="number"
                className="input"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                placeholder="11"
                required
              />
            </div>

            <div className="input-group">
              <label>Max Members *</label>
              <input
                type="number"
                className="input"
                value={formData.max_members}
                onChange={(e) => setFormData({ ...formData, max_members: e.target.value })}
                placeholder="1000"
                required
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                className="input"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Next
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="confirmation-content">
              <h3>Please review and confirm</h3>
              
              <div className="confirm-details">
                <div className="confirm-row">
                  <span className="label">Plan Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Prize Pool:</span>
                  <strong>{selectedPool?.name}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Monthly Amount:</span>
                  <strong>₹{parseFloat(formData.monthly_amount).toLocaleString()}</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Duration:</span>
                  <strong>{formData.duration_months} months</strong>
                </div>
                <div className="confirm-row">
                  <span className="label">Max Members:</span>
                  <strong>{parseInt(formData.max_members).toLocaleString()}</strong>
                </div>
                {formData.description && (
                  <div className="confirm-row">
                    <span className="label">Description:</span>
                    <strong>{formData.description}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
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

export default AdminDashboardV2;
