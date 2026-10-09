import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { Users, ArrowRight, Trophy, Calendar, CheckCircle } from 'lucide-react';
import { TEAMS } from '../../data/prizeData';

const Teams = () => {
  const benefits = [
    'Monthly Lucky Draws for 11 Months',
    'Premium Quality Prizes',
    'Transparent Draw System',
    'Easy Prize Redemption',
    'Secure Payment Options',
    'Dedicated Customer Support',
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="premium-section-title">
              Choose Your <span className="premium-gradient-text">Team</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Select the team that fits your preference. Both teams offer exciting prizes and equal winning opportunities!
            </p>
          </div>
        </div>
      </section>

      {/* Teams Cards */}
      <section className="premium-section section-delay-1 animate-fade-up">
        <div className="container-premium">
          <div className="premium-teams-grid">
            {TEAMS.map((team, index) => (
              <div
                key={index}
                className={`premium-team-card ${index === 0 ? 'premium-team-pink' : 'premium-team-blue'} animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-team-icon">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="premium-team-name">{team.name}</h3>
                <div className="premium-team-badge">{team.totalMembers} Members</div>
                <p className="premium-team-description">
                  {team.group} - 11 Monthly draws with multiple prizes
                </p>
                <Link to="/prizes" className="premium-team-cta">
                  <span>View Prize Details</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="premium-section premium-section-alt section-delay-2 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Why Join <span className="premium-gradient-text">Millance Teams</span>?
            </h2>
            <p className="premium-section-subtitle">
              Enjoy these amazing benefits when you join any team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`premium-box ${
                  index % 3 === 0 ? 'border-pink' : index % 3 === 1 ? 'border-blue' : 'border-purple'
                } flex items-center gap-3 p-4 animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="font-medium text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="premium-section section-delay-3 animate-fade-up">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto premium-box border-pink overflow-hidden">
            <div className="premium-cta-section p-6 md:p-8 rounded-t-2xl" style={{ marginTop: 0, marginBottom: 0 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Team Comparison
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 text-gray-700 font-semibold">Feature</th>
                      <th className="text-center py-4 text-pink-600 font-semibold">Team 1</th>
                      <th className="text-center py-4 text-blue-600 font-semibold">Team 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 text-gray-700">Total Members</td>
                      <td className="py-4 text-center font-bold text-gray-900">500</td>
                      <td className="py-4 text-center font-bold text-gray-900">1000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 text-gray-700">Monthly Draws</td>
                      <td className="py-4 text-center font-bold text-gray-900">11 Months</td>
                      <td className="py-4 text-center font-bold text-gray-900">11 Months</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 text-gray-700">Group</td>
                      <td className="py-4 text-center font-bold text-gray-900">Group A</td>
                      <td className="py-4 text-center font-bold text-gray-900">Group A</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-gray-700">Prize Types</td>
                      <td className="py-4 text-center font-bold text-gray-900">Multiple</td>
                      <td className="py-4 text-center font-bold text-gray-900">Multiple</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section section-delay-4 animate-fade-up">
        <div className="container-premium text-center">
          <h2 className="premium-cta-title">
            Ready to Join Your Team?
          </h2>
          <p className="premium-cta-subtitle">
            Select your preferred team and start your lucky draw journey today
          </p>
          <Link
            to="/login"
            className="premium-btn premium-btn-white inline-flex"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Teams;
