import { ArrowLeft, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
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
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Terms & Conditions</h1>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Millance Rewards Lucky Draw</p>
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
            <FileText style={{ width: '48px', height: '48px', color: '#8B5CF6', margin: '0 auto 12px' }} />
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              Effective Date: October 7, 2026
            </p>
          </div>

          {/* Section 1 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6' }}>1.</span> Program Overview
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              Millance Rewards is a monthly lucky draw program where participants enroll in payment plans and become eligible to win exciting prizes each month.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6' }}>2.</span> Enrollment & Payments
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>Participants must enroll in an 11-month payment plan</li>
              <li>Monthly payments are required to maintain active status and draw eligibility</li>
              <li>All payments are processed through Millance Credits or online payment gateway</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6' }}>3.</span> Monthly Lucky Draws
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>One draw will be conducted every month for each active group</li>
              <li>Draw dates and times will be announced in advance on the Draw page</li>
              <li>Only participants who have made their monthly payments are eligible for that month's draw</li>
              <li>Draw results are final and binding</li>
            </ul>
          </div>

          {/* Section 4 - Winner Benefits */}
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #8B5CF6'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#8B5CF6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>4.</span> 🎉 Winning & Prize Collection
            </h2>
            <div style={{ 
              background: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <p style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '700', margin: '0 0 8px 0' }}>
                ⭐ Important: If you win a prize in any month, your payment obligation ends immediately!
              </p>
              <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.6' }}>
                <strong>Example:</strong> If you win in Month 2, you do NOT need to continue payments until Month 11. Your plan is complete!
              </p>
            </div>
            <p style={{ fontSize: '14px', color: '#666', fontWeight: '600', margin: '0 0 8px 0' }}>
              Winners can collect their prizes by:
            </p>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li><strong>Voucher redemption</strong> at any Millance store location</li>
              <li><strong>Cash conversion</strong> by redeeming Millance Credits at the store</li>
            </ul>
            <p style={{ fontSize: '13px', color: '#666', margin: '12px 0 0 0', fontStyle: 'italic' }}>
              Prize details and values are displayed on the Draw page.
            </p>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6' }}>5.</span> Millance Credits
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>All credits earned or purchased are used exclusively for monthly draw participation</li>
              <li>Credits can be redeemed for cash at Millance store locations</li>
              <li>Credits are non-transferable between users</li>
            </ul>
          </div>

          {/* Section 6 - Cancellation */}
          <div style={{ 
            marginBottom: '24px',
            background: 'rgba(239, 68, 68, 0.05)',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #EF4444'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>6.</span> ⚠️ Cancellation & Refund Policy
            </h2>
            <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li><strong style={{ color: '#EF4444' }}>No refunds will be initiated</strong> under any circumstances</li>
              <li>Once a payment is made, it is non-refundable</li>
              <li>Cancellation of enrollment will result in forfeiture of all paid amounts</li>
              <li>Participants who cancel are not eligible for future draws</li>
            </ul>
          </div>

          {/* Section 7 - Contact */}
          <div style={{ 
            marginBottom: '24px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #3B82F6'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#3B82F6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>7.</span> Contact & Support
            </h2>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.6' }}>
              For any queries, concerns, or support requests, please contact us at:
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

          {/* Section 8 */}
          <div style={{ 
            background: '#F9FAFB',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6' }}>8.</span> Terms Acceptance
            </h2>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              By enrolling in Millance Rewards, you agree to all terms and conditions stated above.
            </p>
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

export default TermsConditions;
