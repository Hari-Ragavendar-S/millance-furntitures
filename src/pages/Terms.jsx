import { useNavigate } from 'react-router-dom';
import '../styles/Legal.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1>Terms & Conditions</h1>
      </div>

      <div className="legal-content">
        <div className="legal-section">
          <h2>Eligibility</h2>
          <p>Participants must be 18 years or older and residents of India to register and participate in the lucky draw.</p>
        </div>

        <div className="legal-section">
          <h2>Registration</h2>
          <p>Each participant receives a unique permanent MLD ID upon successful registration. This ID is non-transferable and must be kept secure.</p>
        </div>

        <div className="legal-section">
          <h2>Payment Terms</h2>
          <p>Monthly payments must be completed by the due date to be eligible for that month's draw. Plans run for 11 consecutive months from the enrollment date.</p>
        </div>

        <div className="legal-section">
          <h2>Draw Process</h2>
          <p>Lucky draws are conducted at the end of each month. Winners are selected randomly from all eligible participants who have paid for that month.</p>
        </div>

        <div className="legal-section">
          <h2>Prize Distribution</h2>
          <p>Prizes are distributed within 7 business days of the draw date. Winners will be notified via registered phone number and email.</p>
        </div>

        <div className="legal-section">
          <h2>Refund Policy</h2>
          <p>Payments are non-refundable once processed. Participants may cancel future payments but will not be eligible for subsequent draws.</p>
        </div>

        <div className="legal-section">
          <h2>Account Termination</h2>
          <p>We reserve the right to terminate accounts that violate our terms, engage in fraudulent activities, or misuse the platform.</p>
        </div>

        <div className="legal-section">
          <h2>Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
        </div>

        <div className="legal-footer">
          <p>Last Updated: September 30, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
