import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ArrowLeft, Users, Trophy, DollarSign, TrendingUp, 
  Calendar, Gift, Phone, Mail, CheckCircle, XCircle,
  Clock, Award, User
} from 'lucide-react';
import '../styles/FranchiseGroupDetails.css';

const FranchiseGroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, winners, non-winners
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const loadGroupDetails = async () => {
    try {
      const response = await api.request(`/franchise/groups/${groupId}/details`);
      setData(response);
    } catch (error) {
      console.error('Failed to load group details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="group-details-loading">
        <div className="franchise-spinner"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="group-details-error">
        <p>Group not found</p>
        <button onClick={() => navigate('/franchise-dashboard')}>Go Back</button>
      </div>
    );
  }

  const { group, plan, prize_pool, statistics, winners_by_month, members } = data;

  // Filter members based on active tab and search
  let filteredMembers = activeTab === 'winners' 
    ? members.filter(m => m.has_won)
    : activeTab === 'non-winners'
    ? members.filter(m => !m.has_won)
    : members;

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredMembers = filteredMembers.filter(m => 
      m.full_name?.toLowerCase().includes(query) ||
      m.mld_id?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.phone?.includes(query) ||
      m.enrollment_status?.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // Create array of all months for winner display
  const allMonths = Array.from({ length: plan?.duration_months || 11 }, (_, i) => i + 1);

  return (
    <div className="group-details-container">
      {/* Header */}
      <div className="group-details-header">
        <button className="back-button" onClick={() => navigate('/franchise-dashboard')}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <div className="group-header-content">
          <div className="group-title-section">
            <div className="group-icon">
              <Users size={32} color="white" />
            </div>
            <div>
              <h1>{group.group_name}</h1>
              <p className="group-subtitle">
                Group ID: {group.group_id} • 
                Status: <span className={`status-badge ${group.status}`}>{group.status}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan & Prize Pool Info */}
      <div className="info-cards-grid">
        {plan && (
          <div className="info-card plan-card">
            <div className="info-card-header">
              <Gift size={24} />
              <h3>Plan Details</h3>
            </div>
            <div className="info-card-body">
              <div className="info-row">
                <span>Plan Name:</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="info-row">
                <span>Monthly Amount:</span>
                <strong className="amount">₹{plan.monthly_amount?.toLocaleString()}</strong>
              </div>
              <div className="info-row">
                <span>Duration:</span>
                <strong>{plan.duration_months} months</strong>
              </div>
              {plan.description && (
                <div className="info-row full">
                  <span>Description:</span>
                  <p>{plan.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {prize_pool && (
          <div className="info-card prizes-card">
            <div className="info-card-header">
              <Award size={24} />
              <h3>Prize Pool: {prize_pool.name}</h3>
            </div>
            <div className="info-card-body prizes-list">
              {prize_pool.prizes?.slice(0, 5).map((prize, idx) => (
                <div key={idx} className="prize-item">
                  <span>{prize.name}</span>
                  <strong className="prize-amount">₹{prize.amount?.toLocaleString()}</strong>
                </div>
              ))}
              {prize_pool.prizes?.length > 5 && (
                <div className="prize-more">+{prize_pool.prizes.length - 5} more prizes</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Members</p>
            <h3 className="stat-value">{statistics.total_members}/{group.max_members}</h3>
            <p className="stat-subtitle">{Math.round(statistics.total_members / group.max_members * 100)}% filled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #059669)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Members</p>
            <h3 className="stat-value">{statistics.active_members}</h3>
            <p className="stat-subtitle">Paying regularly</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Collected</p>
            <h3 className="stat-value">₹{statistics.total_collected?.toLocaleString()}</h3>
            <p className="stat-subtitle">{statistics.collection_percentage}% of expected</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Winners</p>
            <h3 className="stat-value">{statistics.winners_count}/{plan?.duration_months || 11}</h3>
            <p className="stat-subtitle">{statistics.pending_draws} draws pending</p>
          </div>
        </div>
      </div>

      {/* Winners by Month Section */}
      <div className="winners-section">
        <h2 className="section-title">
          <Trophy size={24} />
          Winners by Month
        </h2>
        <div className="winners-grid">
          {allMonths.map((month) => {
            const winner = winners_by_month[month];
            return (
              <div key={month} className={`winner-card ${winner ? 'has-winner' : 'pending'}`}>
                <div className="winner-month">Month {month}</div>
                {winner ? (
                  <>
                    <div className="winner-photo">
                      {winner.winner?.profile_photo ? (
                        <img src={winner.winner.profile_photo} alt={winner.winner.full_name} />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div className="winner-info">
                      <div className="winner-name">{winner.winner?.full_name || 'Unknown'}</div>
                      <div className="winner-id">{winner.winner?.mld_id}</div>
                      <div className="winner-prize">
                        <Gift size={14} />
                        {winner.prize_name}
                      </div>
                      <div className="winner-amount">₹{winner.prize_amount?.toLocaleString()}</div>
                      <div className="winner-date">
                        <Calendar size={12} />
                        {new Date(winner.conducted_at || winner.draw_date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="winner-pending">
                    <Clock size={32} />
                    <p>Draw Pending</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Members Section */}
      <div className="members-section">
        <div className="members-header">
          <h2 className="section-title">
            <Users size={24} />
            Members ({filteredMembers.length})
          </h2>
          
          {/* Tab Buttons */}
          <div className="member-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveTab('all'); setPage(1); setSearchQuery(''); }}
            >
              All Members ({members.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'winners' ? 'active' : ''}`}
              onClick={() => { setActiveTab('winners'); setPage(1); setSearchQuery(''); }}
            >
              Winners ({members.filter(m => m.has_won).length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'non-winners' ? 'active' : ''}`}
              onClick={() => { setActiveTab('non-winners'); setPage(1); setSearchQuery(''); }}
            >
              Non-Winners ({members.filter(m => !m.has_won).length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, MLD ID, email, phone, or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Members List */}
        <div className="members-list">
          {currentMembers.length === 0 ? (
            <div className="no-results">
              <Users size={48} style={{ opacity: 0.3 }} />
              <p>No members found</p>
            </div>
          ) : (
            currentMembers.map((member) => (
              <div 
                key={member.user_id} 
                className="member-card"
                onClick={() => setSelectedMember(member)}
                style={{ cursor: 'pointer' }}
              >
              <div className="member-photo">
                {member.profile_photo ? (
                  <img src={member.profile_photo} alt={member.full_name} />
                ) : (
                  <User size={40} />
                )}
              </div>

              <div className="member-details">
                <div className="member-main-info">
                  <div className="member-name-section">
                    <h3>{member.full_name}</h3>
                    <span className="member-id">{member.mld_id}</span>
                    {member.has_won && (
                      <span className="winner-badge">
                        <Trophy size={14} />
                        Winner - Month {member.won_month}
                      </span>
                    )}
                  </div>
                  <div className={`enrollment-status ${member.enrollment_status}`}>
                    {member.enrollment_status}
                  </div>
                </div>

                <div className="member-contact">
                  <div className="contact-item">
                    <Mail size={14} />
                    {member.email}
                  </div>
                  <div className="contact-item">
                    <Phone size={14} />
                    {member.phone}
                  </div>
                </div>

                <div className="member-payment-info">
                  <div className="payment-stat">
                    <span>Months Paid:</span>
                    <strong>{member.months_paid}/{plan?.duration_months || 11}</strong>
                  </div>
                  <div className="payment-stat">
                    <span>Total Paid:</span>
                    <strong className="amount">₹{member.total_paid?.toLocaleString()}</strong>
                  </div>
                  <div className="payment-stat">
                    <span>Eligible for Draw:</span>
                    <strong className={member.is_eligible_for_draw ? 'eligible' : 'not-eligible'}>
                      {member.is_eligible_for_draw ? (
                        <><CheckCircle size={16} /> Yes</>
                      ) : (
                        <><XCircle size={16} /> No</>
                      )}
                    </strong>
                  </div>
                </div>

                {member.has_won && member.prize_won && (
                  <div className="prize-won-info">
                    <Award size={16} />
                    <span>Won: {member.prize_won.name} - ₹{member.prize_won.amount?.toLocaleString()}</span>
                  </div>
                )}

                <div className="member-enrolled-date">
                  Enrolled: {new Date(member.enrolled_date).toLocaleDateString('en-IN')}
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

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal 
          member={selectedMember}
          plan={plan}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

// Member Details Modal Component
const MemberDetailsModal = ({ member, plan, onClose }) => {
  const monthsArray = Array.from({ length: plan?.duration_months || 11 }, (_, i) => i + 1);

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-content member-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Member Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Member Info */}
          <div className="member-modal-profile">
            <div className="member-modal-photo">
              {member.profile_photo ? (
                <img src={member.profile_photo} alt={member.full_name} />
              ) : (
                <User size={48} />
              )}
            </div>
            <div className="member-modal-info">
              <h3>{member.full_name}</h3>
              <p className="member-modal-id">{member.mld_id}</p>
              <div className={`enrollment-status ${member.enrollment_status}`}>
                {member.enrollment_status}
              </div>
              {member.has_won && (
                <div className="winner-badge">
                  <Trophy size={14} />
                  Winner - Month {member.won_month}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="modal-section">
            <h4>Contact Information</h4>
            <div className="contact-grid">
              <div className="contact-item">
                <Mail size={16} />
                <span>{member.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>{member.phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="modal-section">
            <h4>Payment Summary</h4>
            <div className="payment-summary-grid">
              <div className="summary-item">
                <span>Total Paid</span>
                <strong className="amount">₹{member.total_paid?.toLocaleString()}</strong>
              </div>
              <div className="summary-item">
                <span>Months Paid</span>
                <strong>{member.months_paid}/{plan?.duration_months || 11}</strong>
              </div>
              <div className="summary-item">
                <span>Monthly Amount</span>
                <strong>₹{plan?.monthly_amount?.toLocaleString()}</strong>
              </div>
              <div className="summary-item">
                <span>Eligible for Draw</span>
                <strong className={member.is_eligible_for_draw ? 'eligible' : 'not-eligible'}>
                  {member.is_eligible_for_draw ? (
                    <><CheckCircle size={16} /> Yes</>
                  ) : (
                    <><XCircle size={16} /> No</>
                  )}
                </strong>
              </div>
            </div>
          </div>

          {/* Prize Won */}
          {member.has_won && member.prize_won && (
            <div className="modal-section prize-section">
              <h4>Prize Won</h4>
              <div className="prize-won-display">
                <Award size={24} />
                <div>
                  <div className="prize-name">{member.prize_won.name}</div>
                  <div className="prize-value">₹{member.prize_won.amount?.toLocaleString()}</div>
                  <div className="prize-month">Won in Month {member.won_month}</div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Timeline */}
          <div className="modal-section">
            <h4>Payment Timeline (Month by Month)</h4>
            <div className="payment-timeline">
              {monthsArray.map((month) => {
                const isPaid = month <= member.months_paid;
                const isInitial = month === 1;
                return (
                  <div 
                    key={month} 
                    className={`timeline-month ${isPaid ? 'paid' : 'unpaid'} ${isInitial ? 'initial' : ''}`}
                  >
                    <div className="timeline-month-number">Month {month}</div>
                    <div className="timeline-month-status">
                      {isPaid ? (
                        <>
                          <CheckCircle size={16} />
                          Paid
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          Pending
                        </>
                      )}
                    </div>
                    {isInitial && isPaid && (
                      <div className="initial-badge">Initial Payment</div>
                    )}
                    {isPaid && (
                      <div className="timeline-amount">₹{plan?.monthly_amount?.toLocaleString()}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrollment Date */}
          <div className="modal-section">
            <div className="enrolled-info">
              <Calendar size={16} />
              <span>Enrolled on {new Date(member.enrolled_date).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseGroupDetails;
