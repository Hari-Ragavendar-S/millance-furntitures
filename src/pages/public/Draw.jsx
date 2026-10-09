import { useState, useEffect } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { Sparkles, Clock, Users, Gift, Trophy, CheckCircle } from 'lucide-react';

const Draw = () => {
  const [countdown, setCountdown] = useState({
    days: 15,
    hours: 8,
    minutes: 32,
    seconds: 45
  });

  const upcomingDraw = {
    month: 5,
    date: 'May 15, 2024',
    team: 'Team 1',
    participants: 500,
    prizes: [
      { name: '1g Gold Coin', quantity: 1 },
      { name: '32" LED TV', quantity: 3 },
      { name: '25g Silver Coin', quantity: 1 },
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="premium-stat-icon mx-auto mb-6 animate-pulse" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', width: '80px', height: '80px' }}>
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="premium-section-title">
              Upcoming <span className="premium-gradient-text">Lucky Draw</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              The next exciting draw is coming soon. Get ready for amazing prizes!
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="premium-countdown-section">
        <div className="container-premium">
          <div className="premium-countdown-wrapper">
            <div className="premium-countdown-header">
              <Clock className="w-8 h-8" />
              <h2 className="premium-countdown-title">Month {upcomingDraw.month} Draw</h2>
            </div>
            <p className="text-white/90 text-center mb-6">{upcomingDraw.team} • {upcomingDraw.date} • {upcomingDraw.participants} Participants</p>
            <div className="premium-countdown-grid">
              <div className="premium-countdown-box premium-countdown-days">
                <span className="premium-countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                <span className="premium-countdown-label">Days</span>
              </div>
              <div className="premium-countdown-box premium-countdown-hours">
                <span className="premium-countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="premium-countdown-label">Hours</span>
              </div>
              <div className="premium-countdown-box premium-countdown-minutes">
                <span className="premium-countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                <span className="premium-countdown-label">Minutes</span>
              </div>
              <div className="premium-countdown-box premium-countdown-seconds">
                <span className="premium-countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                <span className="premium-countdown-label">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="premium-section">
        <div className="container-premium">
          <div className="premium-section-header">
            <h3 className="premium-section-title">
              Prizes for This <span className="premium-gradient-text">Draw</span>
            </h3>
          </div>
          <div className="premium-features-grid">
            {upcomingDraw.prizes.map((prize, index) => (
              <div
                key={index}
                className={`premium-feature-card ${
                  index === 0 ? 'premium-feature-pink-gradient' : 
                  index === 1 ? 'premium-feature-purple-gradient' : 
                  'premium-feature-blue-gradient'
                } animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-feature-icon">
                  <Gift className="w-8 h-8" />
                </div>
                <h4 className="premium-feature-title">{prize.name}</h4>
                <p className="premium-feature-description">
                  {prize.quantity} {prize.quantity === 1 ? 'Winner' : 'Winners'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Draw Works */}
      <section className="premium-section premium-section-alt">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              How the <span className="premium-gradient-text">Draw Works</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { title: 'Fair Selection', desc: 'All participants have equal chances. Winners are selected randomly using a transparent system.' },
              { title: 'Live Announcement', desc: 'Winners are announced publicly through our platform and social media channels.' },
              { title: 'Instant Notification', desc: 'Winners receive instant notifications via email and SMS about their prize.' },
              { title: 'Easy Redemption', desc: 'Claim your prize through your dashboard. We handle delivery and coordination.' },
            ].map((item, index) => (
              <div
                key={index}
                className={`premium-box ${index % 2 === 0 ? 'border-pink' : 'border-blue'} p-6 flex gap-4 items-start animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-stat-icon flex-shrink-0" style={{ 
                  background: index % 2 === 0 ? 'linear-gradient(135deg, #EC4899, #F472B6)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                  width: '48px',
                  height: '48px'
                }}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section">
        <div className="container-premium text-center">
          <Sparkles className="premium-cta-icon" />
          <h2 className="premium-cta-title">
            Want to Participate?
          </h2>
          <p className="premium-cta-subtitle">
            Join Millance Lucky Draw and participate in upcoming draws
          </p>
          <a
            href="/teams"
            className="premium-btn premium-btn-white inline-flex"
          >
            <span>Join Now</span>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Draw;
