import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { Gift, Sparkles } from 'lucide-react';
import { TEAMS } from '../../data/prizeData';

const Prizes = () => {
  const [selectedTeam, setSelectedTeam] = useState(0); // 0 = Team 1, 1 = Team 2
  const [selectedMonth, setSelectedMonth] = useState(1); // 1-11

  const currentTeam = TEAMS[selectedTeam];
  const currentMonthData = currentTeam.months.find(m => m.month === selectedMonth);

  // Month border colors (rotating)
  const monthColors = ['pink', 'purple', 'blue', 'cyan', 'green', 'orange', 'pink', 'purple', 'blue', 'cyan', 'gold'];
  const currentColor = monthColors[selectedMonth - 1];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="premium-stat-icon mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)', width: '80px', height: '80px' }}>
              <Gift className="w-10 h-10" />
            </div>
            <h1 className="premium-section-title">
              Monthly <span className="premium-gradient-text">Prizes</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Real rewards. Real monthly draws. 11 months of exciting prizes.
            </p>
          </div>
        </div>
      </section>

      {/* Team Selection */}
      <section className="premium-section" style={{ paddingTop: '2rem' }}>
        <div className="container-premium">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setSelectedTeam(0);
                setSelectedMonth(1);
              }}
              className={`premium-btn ${
                selectedTeam === 0 ? 'premium-btn-primary' : 'premium-btn-secondary'
              } flex items-center gap-2`}
            >
              <span>TEAM 1 — 500</span>
            </button>
            <button
              onClick={() => {
                setSelectedTeam(1);
                setSelectedMonth(1);
              }}
              className={`premium-btn ${
                selectedTeam === 1 ? 'premium-btn-primary' : 'premium-btn-secondary'
              } flex items-center gap-2`}
            >
              <span>TEAM 2 — 1000</span>
            </button>
          </div>

          {/* Month Navigation */}
          <div className="month-navigation">
            <div className="month-scroll-container">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`month-btn ${selectedMonth === month ? 'active' : ''}`}
                  style={{
                    borderColor: selectedMonth === month ? 
                      (monthColors[month - 1] === 'pink' ? '#EC4899' :
                       monthColors[month - 1] === 'purple' ? '#8B5CF6' :
                       monthColors[month - 1] === 'blue' ? '#3B82F6' :
                       monthColors[month - 1] === 'cyan' ? '#06B6D4' :
                       monthColors[month - 1] === 'green' ? '#10B981' :
                       monthColors[month - 1] === 'orange' ? '#F97316' :
                       '#F59E0B') : '#e2e8f0'
                  }}
                >
                  M{month}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prize Display Section */}
      <section className="premium-section section-delay-1 animate-fade-up" style={{ paddingTop: '2rem' }}>
        <div className="container-premium">
          <div 
            className={`premium-box border-${currentColor} animate-fade-up`}
            style={{ 
              padding: '2rem',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {/* Month Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Month {selectedMonth}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentTeam.name} • {currentMonthData.prizes.length} Prizes
                </p>
              </div>
              <div className="premium-stat-icon" style={{ 
                background: currentColor === 'pink' ? 'linear-gradient(135deg, #EC4899, #F472B6)' :
                           currentColor === 'purple' ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)' :
                           currentColor === 'blue' ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' :
                           currentColor === 'cyan' ? 'linear-gradient(135deg, #06B6D4, #22D3EE)' :
                           currentColor === 'green' ? 'linear-gradient(135deg, #10B981, #34D399)' :
                           currentColor === 'orange' ? 'linear-gradient(135deg, #F97316, #FB923C)' :
                           'linear-gradient(135deg, #F59E0B, #FCD34D)'
              }}>
                <Gift className="w-6 h-6" />
              </div>
            </div>

            {/* Prize Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {currentMonthData.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="prize-item animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Prize Image */}
                  <div className="prize-image-container">
                    <img
                      src={prize.image}
                      alt={prize.name}
                      className="prize-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Prize Info */}
                  <div className="prize-info">
                    <h4 className="prize-name">{prize.name}</h4>
                    {prize.value && (
                      <p className="prize-value">{prize.value}</p>
                    )}
                    <p className="prize-quantity">
                      {prize.quantity} {prize.quantity === 1 ? 'Winner' : 'Winners'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section">
        <div className="container-premium text-center">
          <Sparkles className="premium-cta-icon" />
          <h2 className="premium-cta-title">
            Ready to Win These Prizes?
          </h2>
          <p className="premium-cta-subtitle">
            Join {currentTeam.name} and participate in monthly draws
          </p>
          <a href="/teams" className="premium-btn premium-btn-white inline-flex">
            <span>Join {currentTeam.name}</span>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Prizes;
