import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import UserLayout from '../../layouts/UserLayout';
import { 
  Gift, CheckCircle, Download, Printer, X, 
  AlertCircle, Calendar, Award, QrCode 
} from 'lucide-react';

const UserRedeem = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedRedemption, setSelectedRedemption] = useState(null);
  const [redemptions, setRedemptions] = useState([]);

  // User Data
  const userData = {
    userId: 'USER-001',
    name: 'Rajesh Kumar',
    memberId: 'ML001',
    franchiseId: 'FRAN-001',
    teamId: 'TEAM-1',
    groupId: 'GROUP-A'
  };

  // Demo Eligible Rewards (replace with real backend data)
  const eligibleRewards = [
    {
      rewardId: 'REWARD-001',
      prizeName: '43" LED TV',
      prizeImage: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
      month: 5,
      drawDate: '2026-09-15',
      memberId: 'ML001',
      status: 'ELIGIBLE'
    }
  ];

  // Generate unique redemption ID
  const generateRedemptionId = () => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const count = String(redemptions.length + 1).padStart(4, '0');
    return `ML-RDM-${dateStr}-${count}`;
  };

  // Generate verification URL for QR
  const generateVerificationURL = (redemptionId, rewardId, memberId) => {
    // In production, use your actual domain
    const baseURL = window.location.origin;
    const token = btoa(`${redemptionId}:${rewardId}:${memberId}:${Date.now()}`);
    return `${baseURL}/verify-redemption/${redemptionId}?token=${token}`;
  };

  // Handle Redeem Now click
  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setShowConfirmModal(true);
  };

  // Handle Confirm Redemption
  const handleConfirmRedemption = () => {
    if (!selectedReward) return;

    const redemptionId = generateRedemptionId();
    const verificationURL = generateVerificationURL(
      redemptionId,
      selectedReward.rewardId,
      userData.memberId
    );

    const newRedemption = {
      redemptionId,
      rewardId: selectedReward.rewardId,
      prizeName: selectedReward.prizeName,
      prizeImage: selectedReward.prizeImage,
      memberId: userData.memberId,
      memberName: userData.name,
      month: selectedReward.month,
      redeemedOn: new Date().toISOString(),
      status: 'REDEEMED',
      verificationURL,
      qrData: verificationURL
    };

    setRedemptions([newRedemption, ...redemptions]);
    setShowConfirmModal(false);
    setSelectedRedemption(newRedemption);
    setShowQRModal(true);
  };

  // Handle View QR
  const handleViewQR = (redemption) => {
    setSelectedRedemption(redemption);
    setShowQRModal(true);
  };

  // Download QR
  const downloadQR = () => {
    if (!selectedRedemption) return;
    
    const svg = document.getElementById('redemption-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 300;
    canvas.height = 300;
    
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `${selectedRedemption.redemptionId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Print QR
  const printQR = () => {
    window.print();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ELIGIBLE': return 'status-eligible';
      case 'PENDING': return 'status-pending';
      case 'REDEEMED': return 'status-redeemed';
      case 'VERIFIED': return 'status-verified';
      case 'EXPIRED': return 'status-expired';
      default: return 'status-default';
    }
  };

  return (
    <UserLayout>
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      <div className="user-dashboard-compact">
        {/* Header */}
        <div className="user-draw-upcoming-header">
          <Gift className="user-draw-header-icon" />
          <div>
            <h1 className="user-draw-header-title">Redeem Rewards</h1>
            <p className="user-draw-header-subtitle">
              Redeem your eligible rewards securely
            </p>
          </div>
        </div>

        {/* Eligible Rewards */}
        <div className="user-card-compact user-redeem-card">
          <h3 className="user-section-title">Eligible Rewards</h3>
          
          {eligibleRewards.length > 0 ? (
            <div className="user-redeem-rewards-grid">
              {eligibleRewards.map((reward) => (
                <div key={reward.rewardId} className="user-redeem-reward-card">
                  <div className="user-redeem-prize-image-wrapper">
                    <img src={reward.prizeImage} alt={reward.prizeName} className="user-redeem-prize-image" />
                  </div>
                  
                  <div className="user-redeem-reward-details">
                    <h4 className="user-redeem-prize-name">{reward.prizeName}</h4>
                    
                    <div className="user-redeem-info-grid">
                      <div className="user-redeem-info-item">
                        <Calendar className="user-redeem-info-icon" />
                        <div>
                          <span className="user-redeem-info-label">Won in</span>
                          <span className="user-redeem-info-value">Month {reward.month}</span>
                        </div>
                      </div>
                      
                      <div className="user-redeem-info-item">
                        <Award className="user-redeem-info-icon" />
                        <div>
                          <span className="user-redeem-info-label">Winner</span>
                          <span className="user-redeem-info-value">{reward.memberId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`user-redeem-status ${getStatusColor(reward.status)}`}>
                      {reward.status === 'ELIGIBLE' && <CheckCircle size={14} />}
                      {reward.status === 'PENDING' && <AlertCircle size={14} />}
                      <span>{reward.status}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleRedeemClick(reward)}
                      className="user-redeem-now-btn"
                    >
                      Redeem Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="user-empty-state">
              <div className="user-empty-icon-wrapper">
                <Gift size={48} />
              </div>
              <h3 className="user-empty-title">No Rewards to Redeem</h3>
              <p className="user-empty-description">
                Win draws to get rewards that you can redeem
              </p>
            </div>
          )}
        </div>

        {/* Redemption History */}
        {redemptions.length > 0 && (
          <div className="user-card-compact user-redeem-history-card">
            <h3 className="user-section-title">Redemption History</h3>
            
            <div className="user-redeem-history-list">
              {redemptions.map((redemption) => (
                <div key={redemption.redemptionId} className="user-redeem-history-item">
                  <div className="user-redeem-history-image-wrapper">
                    <img src={redemption.prizeImage} alt={redemption.prizeName} />
                  </div>
                  
                  <div className="user-redeem-history-details">
                    <h4 className="user-redeem-history-prize">{redemption.prizeName}</h4>
                    <p className="user-redeem-history-id">{redemption.redemptionId}</p>
                    <p className="user-redeem-history-date">{formatDate(redemption.redeemedOn)}</p>
                  </div>
                  
                  <div className={`user-redeem-status-small ${getStatusColor(redemption.status)}`}>
                    {redemption.status}
                  </div>
                  
                  <button 
                    onClick={() => handleViewQR(redemption)}
                    className="user-redeem-view-qr-btn"
                  >
                    <QrCode size={16} />
                    View QR
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedReward && (
        <div className="user-modal-overlay">
          <div className="user-modal-content user-redeem-confirm-modal">
            <div className="user-modal-header">
              <h3>Redeem Reward</h3>
              <button onClick={() => setShowConfirmModal(false)} className="user-modal-close">
                <X size={20} />
              </button>
            </div>
            
            <div className="user-modal-body">
              <div className="user-redeem-confirm-details">
                <div className="user-redeem-confirm-image">
                  <img src={selectedReward.prizeImage} alt={selectedReward.prizeName} />
                </div>
                
                <div className="user-redeem-confirm-info">
                  <div className="user-redeem-confirm-row">
                    <span className="user-redeem-confirm-label">Prize:</span>
                    <span className="user-redeem-confirm-value">{selectedReward.prizeName}</span>
                  </div>
                  <div className="user-redeem-confirm-row">
                    <span className="user-redeem-confirm-label">Winner:</span>
                    <span className="user-redeem-confirm-value">{userData.name}</span>
                  </div>
                  <div className="user-redeem-confirm-row">
                    <span className="user-redeem-confirm-label">Member ID:</span>
                    <span className="user-redeem-confirm-value">{selectedReward.memberId}</span>
                  </div>
                  <div className="user-redeem-confirm-row">
                    <span className="user-redeem-confirm-label">Draw:</span>
                    <span className="user-redeem-confirm-value">Month {selectedReward.month}</span>
                  </div>
                  <div className="user-redeem-confirm-row">
                    <span className="user-redeem-confirm-label">Status:</span>
                    <span className={`user-redeem-status-small ${getStatusColor(selectedReward.status)}`}>
                      {selectedReward.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="user-modal-footer">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="user-modal-btn user-modal-btn-cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRedemption}
                className="user-modal-btn user-modal-btn-confirm"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && selectedRedemption && (
        <div className="user-modal-overlay">
          <div className="user-modal-content user-redeem-qr-modal">
            <div className="user-modal-header">
              <h3>Redemption QR</h3>
              <button onClick={() => setShowQRModal(false)} className="user-modal-close">
                <X size={20} />
              </button>
            </div>
            
            <div className="user-modal-body">
              <p className="user-redeem-qr-subtitle">
                Show this QR at the authorized Millance location to verify your reward
              </p>
              
              <div className="user-redeem-qr-container">
                <QRCodeSVG
                  id="redemption-qr-code"
                  value={selectedRedemption.qrData}
                  size={220}
                  level="H"
                  includeMargin={true}
                  className="user-redeem-qr-code"
                />
              </div>
              
              <div className="user-redeem-qr-details">
                <div className="user-redeem-qr-detail-row">
                  <span className="user-redeem-qr-label">Redemption ID:</span>
                  <span className="user-redeem-qr-value">{selectedRedemption.redemptionId}</span>
                </div>
                <div className="user-redeem-qr-detail-row">
                  <span className="user-redeem-qr-label">Status:</span>
                  <span className={`user-redeem-status-small ${getStatusColor(selectedRedemption.status)}`}>
                    {selectedRedemption.status}
                  </span>
                </div>
                <div className="user-redeem-qr-detail-row">
                  <span className="user-redeem-qr-label">Prize:</span>
                  <span className="user-redeem-qr-value">{selectedRedemption.prizeName}</span>
                </div>
              </div>
            </div>
            
            <div className="user-modal-footer">
              <button 
                onClick={downloadQR}
                className="user-modal-btn user-modal-btn-download"
              >
                <Download size={16} />
                Download QR
              </button>
              <button 
                onClick={printQR}
                className="user-modal-btn user-modal-btn-print"
              >
                <Printer size={16} />
                Print QR
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserRedeem;
