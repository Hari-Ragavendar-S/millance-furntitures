import PublicLayout from '../../layouts/PublicLayout';
import { Award, Trophy, Calendar, User } from 'lucide-react';

const Winners = () => {
  const winners = [
    { id: 'ML001', name: 'Rajesh Kumar', team: 'Team 1', month: 11, prize: 'Car Fund ₹1,00,000', date: 'Apr 2024', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/coin/e/y/x/24-999-1-kjgc1g-kalamandir-original-imahna7xztcwxahn.jpeg?q=70' },
    { id: 'ML002', name: 'Priya Sharma', team: 'Team 2', month: 10, prize: 'TVS Bike ₹70,000', date: 'Mar 2024', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/coin/e/y/x/24-999-1-kjgc1g-kalamandir-original-imahna7xztcwxahn.jpeg?q=70' },
    { id: 'ML003', name: 'Anand Krishnan', team: 'Team 1', month: 9, prize: 'E-Bike', date: 'Feb 2024', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/home-temple/4/o/u/35-60-35-ht04-old-wolf-furniture-130-original-imahh2mm8ffswh2x.jpeg?q=70' },
    { id: 'ML004', name: 'Lakshmi Devi', team: 'Team 2', month: 8, prize: '1g Gold Coin', date: 'Jan 2024', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/coin/e/y/x/24-999-1-kjgc1g-kalamandir-original-imahna7xztcwxahn.jpeg?q=70' },
    { id: 'ML005', name: 'Vijay Kumar', team: 'Team 1', month: 8, prize: '43" LED TV', date: 'Jan 2024', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70' },
    { id: 'ML006', name: 'Meena Patel', team: 'Team 2', month: 7, prize: '5-Seater Sofa', date: 'Dec 2023', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sofa-sectional/x/h/0/symmetrical-55-black-grey-155-44-jute-no-20-5-seater-crete-sofa-original-imahe92zhszwdzsz.jpeg?q=70' },
    { id: 'ML007', name: 'Suresh Reddy', team: 'Team 1', month: 6, prize: 'Pooja Room Furniture', date: 'Nov 2023', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/home-temple/4/o/u/35-60-35-ht04-old-wolf-furniture-130-original-imahh2mm8ffswh2x.jpeg?q=70' },
    { id: 'ML008', name: 'Divya Iyer', team: 'Team 2', month: 5, prize: '32" LED TV', date: 'Oct 2023', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="premium-stat-icon mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #F59E0B, #FB923C)', width: '80px', height: '80px' }}>
              <Award className="w-10 h-10" />
            </div>
            <h1 className="premium-section-title">
              Recent <span className="premium-gradient-text">Winners</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Congratulations to all our lucky winners! Your success story could be next.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="premium-stats-section">
        <div className="container-premium">
          <div className="premium-stats-grid">
            <div className="premium-stat-card premium-stat-pink-purple animate-scale-pop">
              <div className="premium-stat-icon">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="premium-stat-content">
                <h3 className="premium-stat-value">200+</h3>
                <p className="premium-stat-label">Total Winners</p>
              </div>
            </div>
            <div className="premium-stat-card premium-stat-purple-blue animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="premium-stat-icon">
                <Award className="w-6 h-6" />
              </div>
              <div className="premium-stat-content">
                <h3 className="premium-stat-value">₹50L+</h3>
                <p className="premium-stat-label">Prizes Given</p>
              </div>
            </div>
            <div className="premium-stat-card premium-stat-blue-cyan animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="premium-stat-icon">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="premium-stat-content">
                <h3 className="premium-stat-value">11</h3>
                <p className="premium-stat-label">Draws/Year</p>
              </div>
            </div>
            <div className="premium-stat-card premium-stat-orange-red animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="premium-stat-icon">
                <User className="w-6 h-6" />
              </div>
              <div className="premium-stat-content">
                <h3 className="premium-stat-value">98%</h3>
                <p className="premium-stat-label">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners Gallery */}
      <section className="premium-section">
        <div className="container-premium">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {winners.map((winner, index) => {
              const colors = ['pink', 'gold', 'blue', 'purple', 'cyan', 'orange', 'green', 'red'];
              const color = colors[index % colors.length];
              return (
                <div
                  key={winner.id}
                  className={`premium-box border-${color} overflow-hidden animate-fade-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={winner.image}
                      alt={winner.prize}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="premium-stat-icon" style={{ 
                        background: 'linear-gradient(135deg, #F59E0B, #FB923C)',
                        width: '32px',
                        height: '32px'
                      }}>
                        <Trophy className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="premium-stat-icon flex-shrink-0" style={{ 
                        background: 'linear-gradient(135deg, #EC4899, #F472B6)',
                        width: '40px',
                        height: '40px'
                      }}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{winner.name}</h3>
                        <p className="text-xs text-gray-500">{winner.id}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm font-semibold text-pink-600">{winner.prize}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Month {winner.month} • {winner.date}</span>
                      </div>
                    </div>

                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      winner.team === 'Team 1'
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {winner.team}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section">
        <div className="container-premium text-center">
          <Trophy className="premium-cta-icon" />
          <h2 className="premium-cta-title">
            You Could Be Our Next Winner!
          </h2>
          <p className="premium-cta-subtitle">
            Join Millance Lucky Draw and get a chance to win amazing prizes
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

export default Winners;
