import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, Building, Users, Gift, FileText, UsersRound, 
  DollarSign, Mail, Phone, MapPin, Calendar, TrendingUp,
  Award, CheckCircle, XCircle, Search, X
} from 'lucide-react';
import '../styles/AdminFranchiseDetails.css';

const AdminFranchiseDetails = () => {
  const { franchiseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [franchise, setFranchise] = useState(null);
  const [stats, setStats] = useState(null);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadFranchiseDetails();
  }, [franchiseId]);

  const loadFranchiseDetails = async () => {
    setLoading(true);
    try {
      // Get franchise info
      const franchises = await api.getAllFranchises();
      const franchiseData = franchises.find(f => f.id === parseInt(franchiseId));
      setFranchise(franchiseData);

      // Get groups for this franchise
      const allGroups = await api.request('/admin/groups');
      const franchiseGroups = allGroups.filter(g => g.franchise_id === parseInt(franchiseId));
      setGroups(franchiseGroups);

      // Get members for this franchise
      const enrollments = await api.request('/admin/enrollments');
      const franchiseMembers = enrollments.filter(e => e.franchise_id === parseInt(franchiseId));
      setMembers(franchiseMembers);

      // Calculate stats
      const totalRevenue = franchiseMembers.reduce((sum, m) => sum + (m.total_paid || 0), 0);
      const activeMembers = franchiseMembers.filter(m => m.enrollment_status === 'active').length;
      
      setStats({
        totalGroups: franchiseGroups.length,
        totalMembers: franchiseMembers.length,
        activeMembers: activeMembers,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Failed to load franchise details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="franchise-details-error">
        <p>Franchise not found</p>
        <button onClick={() => navigate('/admin-dashboard')}>Go Back</button>
      </div>
    );
  }

  // Filter data based on search
  let filteredData = activeTab === 'groups' ? groups : members;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    if (activeTab === 'groups') {
      filteredData = groups.filter(g =>
        g.group_name?.toLowerCase().includes(query) ||
        g.group_id?.toLowerCase().includes(query)
      );
    } else {
      filteredData = members.filter(m =>
        m.full_name?.toLowerCase().includes(query) ||
        m.mld_id?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.phone?.includes(query)
      );
    }
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="admin-franchise-details">
      {/* Header */}
      <div className="franchise-details-header">
        <button className="back-button" onClick={() => navigate('/admin-dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <div className="franchise-header-content">
          <div className="franchise-icon-large">
            <Building size={48} />
          </div>
          <div className="franchise-title-section">
            <h1>{franchise.franchise_name}</h1>
            <div className="franchise-subtitle">
              <span className="franchise-code">{franchise.franchise_code}</span>
              <span className={`status-badge ${franchise.is_active ? 'active' : 'inactive'}`}>
                {franchise.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-info-grid">
        <div className="info-card">
          <Mail size={20} />
          <div>
            <p className="info-label">Email</p>
            <p className="info-value">{franchise.email}</p>
          </div>
        </div>
        <div className="info-card">
          <Phone size={20} />
          <div>
            <p className="info-label">Phone</p>
            <p className="info-value">{franchise.phone || 'N/A'}</p>
          </div>
        </div>
        <div className="info-card">
          <MapPin size={20} />
          <div>
            <p className="info-label">Address</p>
            <p className="info-value">{franchise.address || 'N/A'}</p>
          </div>
        </div>
        <div className="info-card">
          <Calendar size={20} />
          <div>
            <p className="info-label">Created</p>
            <p className="info-value">
              {franchise.created_at 
                ? new Date(franchise.created_at).toLocaleDateString('en-IN')
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            <UsersRound size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Groups</p>
            <h3 className="stat-value">{stats?.totalGroups || 0}</h3>
            <p className="stat-subtitle">All groups</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Members</p>
            <h3 className="stat-value">{stats?.totalMembers || 0}</h3>
            <p className="stat-subtitle">Enrolled users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Members</p>
            <h3 className="stat-value">{stats?.activeMembers || 0}</h3>
            <p className="stat-subtitle">Currently active</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
            <p className="stat-subtitle">Lifetime earnings</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="details-tabs-section">
        <div className="tabs-header">
          <div className="tabs-buttons">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setSearchQuery('');
                setPage(1);
              }}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('groups');
                setSearchQuery('');
                setPage(1);
              }}
            >
              Groups ({groups.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('members');
                setSearchQuery('');
                setPage(1);
              }}
            >
              Members ({members.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <OverviewTabContent 
              franchise={franchise}
              groups={groups}
              members={members}
              stats={stats}
            />
          )}

          {activeTab === 'groups' && (
            <>
              {/* Search Bar */}
              <div className="search-bar-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search groups by name or ID..."
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

              {/* Groups Grid */}
              <div className="details-grid">
                {currentItems.length === 0 ? (
                  <div className="no-results">
                    <UsersRound size={48} style={{ opacity: 0.3 }} />
                    <p>No groups found</p>
                  </div>
                ) : (
                  currentItems.map(group => (
                    <div key={group.id} className="detail-card group-card">
                      <div className="card-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                        <UsersRound size={24} />
                      </div>
                      <div className="card-content">
                        <h3>{group.group_name}</h3>
                        <p className="card-id">ID: {group.group_id}</p>
                        <div className="card-stats">
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
            </>
          )}

          {activeTab === 'members' && (
            <>
              {/* Search Bar */}
              <div className="search-bar-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search members by name, MLD ID, email, or phone..."
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

              {/* Members List */}
              <div className="members-list">
                {currentItems.length === 0 ? (
                  <div className="no-results">
                    <Users size={48} style={{ opacity: 0.3 }} />
                    <p>No members found</p>
                  </div>
                ) : (
                  currentItems.map(member => (
                    <div key={member.id} className="member-row">
                      <div className="member-info">
                        <h4>{member.full_name}</h4>
                        <p>{member.mld_id}</p>
                      </div>
                      <div className="member-contact">
                        <div className="contact-item">
                          <Mail size={14} />
                          <span>{member.email}</span>
                        </div>
                        <div className="contact-item">
                          <Phone size={14} />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="member-stats">
                        <span className="stat-label">Total Paid:</span>
                        <span className="stat-value">₹{(member.total_paid || 0).toLocaleString()}</span>
                      </div>
                      <div className={`status-badge ${member.enrollment_status}`}>
                        {member.enrollment_status || 'active'}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTabContent = ({ franchise, groups, members, stats }) => {
  return (
    <div className="overview-content">
      {/* Recent Groups */}
      <div className="overview-section">
        <h3>Recent Groups</h3>
        {groups.length === 0 ? (
          <p className="empty-message">No groups created yet</p>
        ) : (
          <div className="recent-items">
            {groups.slice(0, 5).map(group => (
              <div key={group.id} className="recent-item">
                <div className="recent-icon">
                  <UsersRound size={20} />
                </div>
                <div className="recent-info">
                  <h4>{group.group_name}</h4>
                  <p>{group.group_id} • {group.current_members || 0}/{group.max_members || 0} members</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Members */}
      <div className="overview-section">
        <h3>Recent Members</h3>
        {members.length === 0 ? (
          <p className="empty-message">No members enrolled yet</p>
        ) : (
          <div className="recent-items">
            {members.slice(0, 5).map(member => (
              <div key={member.id} className="recent-item">
                <div className="recent-icon">
                  <Users size={20} />
                </div>
                <div className="recent-info">
                  <h4>{member.full_name}</h4>
                  <p>{member.mld_id} • ₹{(member.total_paid || 0).toLocaleString()} paid</p>
                </div>
                <div className={`status-badge ${member.enrollment_status}`}>
                  {member.enrollment_status || 'active'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="overview-section">
        <h3>Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <TrendingUp size={20} />
            <div>
              <p className="summary-label">Average per Member</p>
              <p className="summary-value">
                ₹{stats?.totalMembers > 0 
                  ? Math.round((stats.totalRevenue || 0) / stats.totalMembers).toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
          <div className="summary-item">
            <Award size={20} />
            <div>
              <p className="summary-label">Active Rate</p>
              <p className="summary-value">
                {stats?.totalMembers > 0
                  ? Math.round(((stats.activeMembers || 0) / stats.totalMembers) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFranchiseDetails;
