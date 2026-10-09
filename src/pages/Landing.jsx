import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import { mockStats, mockRecentWinners } from '../mockData';

const Landing = () => {
  const navigate = useNavigate();
  const [activeWinner, setActiveWinner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWinner((prev) => (prev + 1) % mockRecentWinners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">MLD</span>
              <span className="logo-text">Millionaire Draw</span>
            </div>
            <nav className="nav-links">
              <button onClick={() => navigate('/login')} className="btn btn-outline">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Join Now
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="particles"></div>
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Your Monthly
              <span className="gradient-text"> Millionaire</span>
              <br />
              Opportunity
            </h1>
            <p className="hero-subtitle">
              Join thousands of members in our exclusive monthly lucky draw.
              <br />
              Pay monthly, enter draws, win big prizes.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/register')} className="btn btn-accent btn-large">
                Get Started
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-secondary btn-large">
                Member Login
              </button>
            </div>
            
            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">{mockStats.totalMembers}+</div>
                <div className="stat-label">Active Members</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">Rs {(mockStats.totalPrizePool / 100000).toFixed(1)}L</div>
                <div className="stat-label">Prize Pool</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{mockStats.drawsCompleted}</div>
                <div className="stat-label">Draws Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card slide-up">
              <div className="step-number">01</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3>Register Account</h3>
              <p>Sign up and get your permanent MLD ID</p>
            </div>

            <div className="step-card slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="step-number">02</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3>Choose Plan</h3>
              <p>Select Rs 500 or Rs 1000 monthly plan</p>
            </div>

            <div className="step-card slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="step-number">03</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Pay Monthly</h3>
              <p>Make monthly payments for 11 months</p>
            </div>

            <div className="step-card slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="step-number">04</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3>Enter Draw</h3>
              <p>Automatic entry after successful payment</p>
            </div>

            <div className="step-card slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="step-number">05</div>
              <div className="step-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3>Win Prizes</h3>
              <p>Win up to Rs 5 Lakhs every month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Plans */}
      <section className="plans-section">
        <div className="container">
          <h2 className="section-title">Available Plans</h2>
          <div className="plans-grid">
            <div className="plan-card card-premium">
              <div className="plan-badge">Silver</div>
              <div className="plan-amount">Rs 500</div>
              <div className="plan-period">per month</div>
              <div className="plan-prize">Prize: Rs 2.5 Lakhs</div>
              <ul className="plan-features">
                <li>11 Months Duration</li>
                <li>500 Members per Group</li>
                <li>Monthly Lucky Draw</li>
                <li>Permanent MLD ID</li>
                <li>Secure Payments</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn btn-accent btn-full">
                Join Silver Plan
              </button>
            </div>

            <div className="plan-card card-premium">
              <div className="plan-badge badge-gold">Gold</div>
              <div className="plan-amount">Rs 1,000</div>
              <div className="plan-period">per month</div>
              <div className="plan-prize">Prize: Rs 5 Lakhs</div>
              <ul className="plan-features">
                <li>11 Months Duration</li>
                <li>1000 Members per Group</li>
                <li>Monthly Lucky Draw</li>
                <li>Permanent MLD ID</li>
                <li>Priority Support</li>
              </ul>
              <button onClick={() => navigate('/register')} className="btn btn-accent btn-full">
                Join Gold Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="winners-section">
        <div className="container">
          <h2 className="section-title">Recent Winners</h2>
          <div className="winners-carousel">
            <div className="winner-card" key={mockRecentWinners[activeWinner].mldId}>
              <div className="winner-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="winner-id">MLD: {mockRecentWinners[activeWinner].mldId}</div>
              <div className="winner-name">{mockRecentWinners[activeWinner].name}</div>
              <div className="winner-prize">Won Rs {(mockRecentWinners[activeWinner].prize / 100000).toFixed(1)} Lakhs</div>
              <div className="winner-date">{new Date(mockRecentWinners[activeWinner].date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          <div className="carousel-dots">
            {mockRecentWinners.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeWinner ? 'active' : ''}`}
                onClick={() => setActiveWinner(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">MLD</span>
                <span className="logo-text">Millionaire Draw</span>
              </div>
              <p className="footer-text">Your trusted platform for monthly lucky draws</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => navigate('/privacy')}>Privacy Policy</a></li>
                <li><a href="#" onClick={() => navigate('/terms')}>Terms & Conditions</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Member Area</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => navigate('/login')}>User Login</a></li>
                <li><a href="#" onClick={() => navigate('/franchise')}>Franchise Login</a></li>
                <li><a href="#" onClick={() => navigate('/admin')}>Admin Login</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Millionaire Draw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
