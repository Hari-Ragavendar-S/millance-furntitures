import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/InviteSplash.css';

function InviteSplashPage() {
  const { franchiseSlug, inviteCode } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInviteData();
  }, []);

  const loadInviteData = async () => {
    try {
      const data = await api.validateInviteLink(franchiseSlug, inviteCode);
      setInviteData(data);
    } catch (err) {
      setError(err.message || 'Invalid invite link');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinNow = () => {
    navigate(`/register?ref=${franchiseSlug}&code=${inviteCode}`);
  };

  if (loading) {
    return (
      <div className="invite-splash">
        <div className="invite-loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invite-splash">
        <div className="invite-error">
          <h2>Invalid Invite Link</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-splash">
      <div className="invite-container">
        <div className="invite-header">
          <div className="invite-badge">🎉 You're Invited!</div>
          <h1>{inviteData.franchise_name}</h1>
        </div>

        <div className="invite-body">
          <div className="invite-group-info">
            <h2>{inviteData.group_name}</h2>
            <p className="invite-subtitle">{inviteData.plan_name}</p>
          </div>

          <div className="invite-details">
            <div className="invite-detail-item">
              <span className="detail-label">Monthly Amount</span>
              <span className="detail-value">₹{inviteData.monthly_amount}</span>
            </div>
            <div className="invite-detail-item">
              <span className="detail-label">Duration</span>
              <span className="detail-value">{inviteData.duration_months} Months</span>
            </div>
            <div className="invite-detail-item">
              <span className="detail-label">Available Spots</span>
              <span className="detail-value">
                {inviteData.max_members - inviteData.current_members} / {inviteData.max_members}
              </span>
            </div>
          </div>

          <div className="invite-prizes">
            <h3>Prize Pool</h3>
            <div className="prize-list">
              {inviteData.prizes.slice(0, 5).map((prize, idx) => (
                prize.name && (
                  <div key={idx} className="prize-item">
                    <span className="prize-name">{prize.name}</span>
                    <span className="prize-amount">₹{prize.amount?.toLocaleString()}</span>
                  </div>
                )
              ))}
              {inviteData.prizes.length > 5 && (
                <div className="prize-more">+ {inviteData.prizes.length - 5} more prizes</div>
              )}
            </div>
          </div>

          <div className="invite-benefits">
            <h3>What You Get</h3>
            <ul>
              <li>✨ Monthly lucky draws</li>
              <li>💰 Win exciting prizes</li>
              <li>🎯 Guaranteed savings wallet</li>
              <li>📱 Easy payment tracking</li>
            </ul>
          </div>

          <button className="invite-join-btn" onClick={handleJoinNow}>
            Join Now
          </button>

          <p className="invite-footer-text">
            By joining, you'll be automatically enrolled in this group
          </p>
        </div>
      </div>
    </div>
  );
}

export default InviteSplashPage;
