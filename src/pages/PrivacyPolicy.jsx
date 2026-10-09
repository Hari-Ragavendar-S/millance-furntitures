import { ArrowLeft, Shield, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        padding: '20px',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Privacy Policy</h1>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>How we protect your data</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Shield style={{ width: '48px', height: '48px', color: '#3B82F6', margin: '0 auto 12px' }} />
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              Effective Date: October 7, 2026
            </p>
          </div>

          {/* Section 1 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>1.</span> Information We Collect
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              We collect the following information when you register:
            </p>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>Full name, email address, phone number</li>
              <li>Address and location details</li>
              <li>Payment information (processed securely through Cashfree Payment Gateway)</li>
              <li>Profile picture (optional)</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>2.</span> How We Use Your Information
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>To manage your enrollment and participation in monthly draws</li>
              <li>To process payments and credit transactions</li>
              <li>To notify you of draw schedules and results</li>
              <li>To provide customer support and respond to inquiries</li>
            </ul>
          </div>

          {/* Section 3 - Data Security */}
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #10B981'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#10B981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>3.</span> 🔒 Data Security
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>All personal information is stored securely in encrypted databases</li>
              <li>Payment processing is handled by certified payment gateway partners (Cashfree)</li>
              <li>We do not share your data with third parties without consent</li>
              <li>Industry-standard SSL encryption protects data transmission</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>4.</span> Your Rights
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>You have the right to access your personal information at any time</li>
              <li>You can update your profile details through the user panel</li>
              <li>You can request data deletion by contacting us at info@millance.gold</li>
              <li>You can opt-out of promotional communications</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>5.</span> Cookies & Tracking
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              We use essential cookies to maintain your session and improve user experience. We do not use third-party tracking cookies or sell your data to advertisers.
            </p>
          </div>

          {/* Section 6 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>6.</span> Data Retention
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              We retain your personal information as long as your account is active or as needed to provide services. After account closure, data may be retained for legal and regulatory compliance purposes.
            </p>
          </div>

          {/* Section 7 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3B82F6' }}>7.</span> Changes to This Policy
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact Section */}
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #3B82F6'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#3B82F6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>8.</span> Contact Us
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              For privacy-related questions or concerns:
            </p>
            <a 
              href="mailto:info@millance.gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'white',
                borderRadius: '8px',
                color: '#3B82F6',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                border: '1px solid #3B82F6'
              }}
            >
              <Mail style={{ width: '16px', height: '16px' }} />
              info@millance.gold
            </a>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
              Last updated: October 7, 2026
            </p>
            <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
              © 2026 Millance Rewards. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
