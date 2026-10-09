import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { 
  Trophy, Gift, Users, Sparkles, ArrowRight, Star, Award, 
  TrendingUp, CheckCircle, Zap, Clock, Target, Shield 
} from 'lucide-react';
import { TEAMS } from '../../data/prizeData';

const Home = () => {
  const [countdown, setCountdown] = useState({ days: 15, hours: 10, minutes: 30, seconds: 45 });

  // Countdown timer
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

  const stats = [
    { label: 'Total Members', value: '1500+', icon: Users, gradient: 'pink-purple', delay: '0s' },
    { label: 'Monthly Draws', value: '11', icon: Sparkles, gradient: 'purple-blue', delay: '0.1s' },
    { label: 'Prize Value', value: '₹50L+', icon: Gift, gradient: 'blue-cyan', delay: '0.2s' },
    { label: 'Winners', value: '200+', icon: Trophy, gradient: 'orange-red', delay: '0.3s' },
  ];

  const features = [
    {
      icon: Trophy,
      title: 'Premium Prizes',
      description: 'Win bikes, TVs, gold, furniture, electronics and more every month',
      gradient: 'pink-gradient'
    },
    {
      icon: Shield,
      title: 'Transparent System',
      description: 'Fair and transparent lucky draw with public winner announcements',
      gradient: 'purple-gradient'
    },
    {
      icon: Users,
      title: 'Two Team Options',
      description: 'Choose Team 1 (500 members) or Team 2 (1000 members)',
      gradient: 'blue-gradient'
    },
    {
      icon: Target,
      title: 'Monthly Draws',
      description: '11 exciting draws with multiple winners each month',
      gradient: 'orange-gradient'
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Join Plan',
      description: 'Select your team and register',
      icon: Users,
      color: 'pink'
    },
    {
      step: '02',
      title: 'Pay Monthly',
      description: 'Pay ₹1,000 every month for 11 months',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      step: '03',
      title: 'Participate',
      description: 'Get entered into monthly lucky draws',
      icon: Sparkles,
      color: 'blue'
    },
    {
      step: '04',
      title: 'Win Rewards',
      description: 'Win amazing prizes every month',
      icon: Trophy,
      color: 'orange'
    },
  ];

  const prizes = [
    { name: '43" LED TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300', color: 'pink' },
    { name: 'Gold Coin 10g', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=300', color: 'gold' },
    { name: 'Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300', color: 'blue' },
    { name: 'Premium Sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', color: 'purple' },
    { name: 'Refrigerator', image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300', color: 'cyan' },
    { name: 'Wooden Bed', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=300', color: 'orange' },
  ];

  return (
    <PublicLayout>
      {/* Animated Background */}
      <div className="premium-bg-wrapper">
        <div className="premium-bg-bubble premium-bubble-1"></div>
        <div className="premium-bg-bubble premium-bubble-2"></div>
        <div className="premium-bg-bubble premium-bubble-3"></div>
        <div className="premium-bg-bubble premium-bubble-4"></div>
        <div className="premium-bg-particle"></div>
      </div>

      {/* Hero Section */}
      <section className="premium-hero section-delay-0">
        <div className="container-premium">
          <div className="premium-hero-grid">
            {/* Left Content */}
            <div className="premium-hero-content">
              <div className="premium-badge animate-fade-down">
                <Star className="w-4 h-4 fill-current" />
                <span>India's Most Trusted Lucky Draw</span>
              </div>

              <h1 className="premium-hero-title animate-fade-up">
                Win Amazing Prizes
                <span className="premium-gradient-text">Every Month!</span>
              </h1>

              <p className="premium-hero-subtitle animate-fade-up" style={{ animationDelay: '0.1s' }}>
                ஆரம்பமான அனுமுகம் – அதிர்ஷ்ட பரிசுகள்<br />
                Join Millance and win bikes, gold, furniture, electronics & more
              </p>

              <div className="premium-hero-buttons animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/teams" className="premium-btn premium-btn-primary">
                  <span>Join Lucky Draw</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/prizes" className="premium-btn premium-btn-secondary">
                  <span>View All Prizes</span>
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="premium-hero-visual">
              <div className="premium-hero-prize-float premium-float-1">
                <Gift className="w-6 h-6" />
                <span>Bikes & Cars</span>
              </div>
              <div className="premium-hero-prize-float premium-float-2">
                <Trophy className="w-6 h-6" />
                <span>Gold & Silver</span>
              </div>
              <div className="premium-hero-prize-float premium-float-3">
                <Sparkles className="w-6 h-6" />
                <span>Electronics</span>
              </div>
              <div className="premium-hero-prize-float premium-float-4">
                <Award className="w-6 h-6" />
                <span>Furniture</span>
              </div>
              <div className="premium-hero-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="premium-stats-section section-delay-1 animate-fade-up">
        <div className="container-premium">
          <div className="premium-stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`premium-stat-card premium-stat-${stat.gradient} animate-scale-pop`}
                style={{ animationDelay: stat.delay }}
              >
                <div className="premium-stat-icon">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="premium-stat-content">
                  <h3 className="premium-stat-value">{stat.value}</h3>
                  <p className="premium-stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="premium-section section-delay-2 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              How It <span className="premium-gradient-text">Works</span>
            </h2>
            <p className="premium-section-subtitle">
              Simple 4-step process to start your lucky draw journey
            </p>
          </div>

          <div className="premium-steps-grid">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className={`premium-step-card premium-step-${step.color} ${index % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-step-number">{step.step}</div>
                <div className="premium-step-icon">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-step-title">{step.title}</h3>
                <p className="premium-step-description">{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="premium-step-arrow">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="premium-section premium-section-alt section-delay-3 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Why Choose <span className="premium-gradient-text">Millance</span>
            </h2>
            <p className="premium-section-subtitle">
              Trusted by thousands for transparent and exciting lucky draws
            </p>
          </div>

          <div className="premium-features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`premium-feature-card premium-feature-${feature.gradient} animate-float-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-feature-icon">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-feature-title">{feature.title}</h3>
                <p className="premium-feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Showcase */}
      <section className="premium-section">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Amazing <span className="premium-gradient-text">Prizes</span>
            </h2>
            <p className="premium-section-subtitle">
              Win exciting prizes worth lakhs every month
            </p>
          </div>

          <div className="premium-prizes-grid">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className={`premium-prize-card premium-prize-${prize.color} animate-scale-pop animate-border-glow`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="premium-prize-image">
                  <img src={prize.image} alt={prize.name} />
                </div>
                <h4 className="premium-prize-name">{prize.name}</h4>
              </div>
            ))}
          </div>

          <div className="premium-section-cta">
            <Link to="/prizes" className="premium-btn premium-btn-outline">
              <span>View All Prizes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Next Draw Countdown */}
      <section className="premium-countdown-section">
        <div className="container-premium">
          <div className="premium-countdown-wrapper">
            <div className="premium-countdown-header">
              <Clock className="w-8 h-8" />
              <h2 className="premium-countdown-title">Next Lucky Draw</h2>
            </div>
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

      {/* Teams CTA */}
      <section className="premium-section">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Choose Your <span className="premium-gradient-text">Team</span>
            </h2>
            <p className="premium-section-subtitle">
              Select the team that fits your preference
            </p>
          </div>

          <div className="premium-teams-grid">
            {TEAMS.map((team, index) => (
              <Link
                key={index}
                to={`/teams/team-${index + 1}`}
                className={`premium-team-card premium-team-${index === 0 ? 'pink' : 'blue'} animate-3d-lift animate-float-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-team-icon">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="premium-team-name">{team.name}</h3>
                <div className="premium-team-badge">{team.totalMembers} Members</div>
                <p className="premium-team-description">
                  11 Monthly draws with multiple prizes
                </p>
                <div className="premium-team-cta">
                  <span>View Details</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="premium-cta-section">
        <div className="container-premium">
          <div className="premium-cta-wrapper">
            <Sparkles className="premium-cta-icon" />
            <h2 className="premium-cta-title">
              Ready to Win Amazing Prizes?
            </h2>
            <p className="premium-cta-subtitle">
              Join thousands of happy members and start your lucky draw journey today
            </p>
            <div className="premium-cta-buttons">
              <Link to="/teams" className="premium-btn premium-btn-white">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/how-it-works" className="premium-btn premium-btn-outline-white">
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
