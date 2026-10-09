import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Gift, Trophy, Star, Award, Check, Clock,
  Calendar, Package, ChevronRight
} from 'lucide-react';

const Rewards = () => {
  const { user } = useAuth();
  const [drawStatus, setDrawStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    try {
      const data = await api.getUserDrawStatus();
      setDrawStatus(data);
    } catch (error) {
      console.error('Failed to load rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasWon = drawStatus?.enrollment_status?.has_won;
  const myResults = drawStatus?.my_results || [];
  const wonResults = myResults.filter(r => r.status === 'won');

  if (loading) {
    return (
      <div className="user-dashboard-compact">
        <div className="loading-container" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading rewards...</p>
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
        {/* Page Header */}
        <div className="user-welcome-compact">
          <div>
            <h1 className="user-welcome-title">My Rewards</h1>
            <p className="user-welcome-subtitle">View your prizes and achievements</p>
          </div>
          <div className="user-next-draw-badge">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        {/* Rewards Summary */}
        <div className="user-vault-summary-grid">
          <div className="user-vault-summary-card">
            <Trophy className="user-vault-summary-icon text-yellow-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">{wonResults.length}</span>
              <span className="user-vault-summary-label">Total Wins</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <Gift className="user-vault-summary-icon text-pink-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">
                ₹{wonResults.reduce((sum, r) => sum + (r.prize_amount || 0), 0).toLocaleString()}
              </span>
              <span className="user-vault-summary-label">Prize Value</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <Award className="user-vault-summary-icon text-purple-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">{myResults.length}</span>
              <span className="user-vault-summary-label">Draws Entered</span>
            </div>
          </div>

          <div className="user-vault-summary-card">
            <Star className="user-vault-summary-icon text-blue-500" />
            <div className="user-vault-summary-content">
              <span className="user-vault-summary-value">
                {myResults.length > 0 ? Math.round((wonResults.length / myResults.length) * 100) : 0}%
              </span>
              <span className="user-vault-summary-label">Win Rate</span>
            </div>
          </div>
        </div>

        {/* Current Win (if any) */}
        {hasWon && drawStatus?.enrollment_status && (
          <div className="user-card-compact" style={{ borderColor: '#FBBF24', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)' }}>
            <div className="user-vault-section-header">
              <Trophy className="user-vault-section-icon" style={{ color: '#FBBF24' }} />
              <h2 className="user-vault-section-title">🎉 Current Prize</h2>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(244, 114, 182, 0.05))',
              borderRadius: '12px',
              padding: '20px',
              border: '2px solid rgba(251, 191, 36, 0.3)'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
                {drawStatus.enrollment_status.prize_name || 'Prize'}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Prize Amount</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#FBBF24' }}>
                    ₹{drawStatus.enrollment_status.prize_amount?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Savings</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#34D399' }}>
                    ₹{drawStatus.enrollment_status.savings_accumulated?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Month Won</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                    Month {drawStatus.enrollment_status.prize_won_month}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Status</div>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#16A34A',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <Check className="w-3 h-3" />
                    Won
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '12px',
                background: 'white',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                  Total Benefit
                </div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#F472B6' }}>
                  ₹{((drawStatus.enrollment_status.prize_amount || 0) + (drawStatus.enrollment_status.savings_accumulated || 0)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Rewards History */}
        <div className="user-card-compact">
          <h3 className="user-section-title">Rewards History</h3>
          
          {myResults.length === 0 ? (
            <div className="user-empty-state">
              <div className="user-empty-icon-wrapper">
                <Gift className="user-empty-icon" />
              </div>
              <h4 className="user-empty-title">No Rewards Yet</h4>
              <p className="user-empty-desc">Your rewards will appear here when you win a draw</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myResults.map((result, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: '16px',
                    background: result.status === 'won' ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255, 255, 255, 0.95)',
                    border: `1.5px solid ${result.status === 'won' ? '#FBBF24' : '#E5E7EB'}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: result.status === 'won' ? 'linear-gradient(135deg, #FBBF24, #FB923C)' : 'linear-gradient(135deg, #E5E7EB, #D1D5DB)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {result.status === 'won' ? (
                      <Trophy style={{ width: '24px', height: '24px', color: 'white' }} />
                    ) : (
                      <Clock style={{ width: '24px', height: '24px', color: '#999' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                      Month {result.month} Draw
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {result.status === 'won' ? result.prize_name || 'Prize' : 'Not won this time'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {result.status === 'won' ? (
                      <>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#FBBF24' }}>
                          ₹{result.prize_amount?.toLocaleString()}
                        </div>
                        <div style={{ 
                          marginTop: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          color: '#16A34A',
                          borderRadius: '999px',
                          display: 'inline-block'
                        }}>
                          WON
                        </div>
                      </>
                    ) : (
                      <div style={{ 
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        background: 'rgba(156, 163, 175, 0.1)',
                        color: '#6B7280',
                        borderRadius: '999px'
                      }}>
                        NO WIN
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        {wonResults.length > 0 && (
          <div className="user-card-compact" style={{ borderColor: '#A78BFA' }}>
            <h3 className="user-section-title">🏆 Achievements</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 146, 60, 0.05))',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <Trophy style={{ width: '32px', height: '32px', color: '#FBBF24', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>First Win</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Unlocked!</div>
              </div>

              {wonResults.length >= 2 && (
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(236, 72, 153, 0.05))',
                  border: '2px solid rgba(244, 114, 182, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <Star style={{ width: '32px', height: '32px', color: '#F472B6', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Lucky Streak</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>2+ Wins!</div>
                </div>
              )}

              {myResults.length >= 5 && (
                <div style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.05))',
                  border: '2px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <Package style={{ width: '32px', height: '32px', color: '#60A5FA', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Regular Player</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>5+ Draws</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rewards;
