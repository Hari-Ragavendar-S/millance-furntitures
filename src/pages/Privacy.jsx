import { useNavigate } from 'react-router-dom';
import '../styles/Legal.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1>Privacy Policy</h1>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>Information Collection</h2>
          <p>We collect personal information including your name, phone number, email address, and payment details when you register for our lucky draw services.</p>
        </div>

        <div className="legal-section">
          <h2>How We Use Your Information</h2>
          <p>Your information is used to manage your account, process payments, enter you into lucky draws, and communicate important updates about your participation.</p>
        </div>

        <div className="legal-section">
          <h2>Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. All payment data is encrypted and securely stored.</p>
        </div>

        <div className="legal-section">
          <h2>Information Sharing</h2>
          <p>We do not sell or share your personal information with third parties except as required by law or to process payments through our secure payment partners.</p>
        </div>

        <div className="legal-section">
          <h2>Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time by contacting our support team.</p>
        </div>

        <div className="legal-section">
          <h2>Contact Us</h2>
          <p>For any privacy-related questions or concerns, please contact us at privacy@millionairedraw.com</p>
        </div>

        <div className="legal-footer">
          <p>Last Updated: September 30, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
