import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { Users, ArrowLeft, Calendar, Gift, Award } from 'lucide-react';
import { TEAMS } from '../../data/prizeData';

const TeamDetail = ({ teamId }) => {
  const team = TEAMS[teamId - 1];

  if (!team) {
    return (
      <PublicLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Team not found</h1>
          <Link to="/teams" className="text-soft-rose hover:underline mt-4 inline-block">
            Back to Teams
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="public-section bg-gradient-to-br from-light-bg to-white pt-24">
        <div className="container-custom">
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-soft-rose hover:text-soft-red transition mb-8 fade-up"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Teams</span>
          </Link>

          <div className="max-w-4xl mx-auto text-center fade-up">
            <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${
              teamId === 1 ? 'from-soft-pink to-soft-rose' : 'from-soft-orange to-soft-red'
            } rounded-3xl flex items-center justify-center shadow-lg`}>
              <Users className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {team.name}
            </h1>
            <p className="text-xl text-soft-rose font-semibold mb-6">{team.group}</p>

            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Users className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{team.totalMembers}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Overview */}
      <section className="public-section">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-soft-rose" />
              <p className="text-2xl font-bold text-gray-900">{team.months.length}</p>
              <p className="text-sm text-gray-600">Months</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Gift className="w-8 h-8 mx-auto mb-3 text-soft-orange" />
              <p className="text-2xl font-bold text-gray-900">
                {team.months.reduce((total, month) => total + month.prizes.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Prize Types</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Award className="w-8 h-8 mx-auto mb-3 text-soft-violet" />
              <p className="text-2xl font-bold text-gray-900">
                {team.months.reduce((total, month) => 
                  total + month.prizes.reduce((sum, prize) => sum + prize.quantity, 0), 0
                )}
              </p>
              <p className="text-sm text-gray-600">Total Winners</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Users className="w-8 h-8 mx-auto mb-3 text-gold" />
              <p className="text-2xl font-bold text-gray-900">{team.totalMembers}</p>
              <p className="text-sm text-gray-600">Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Prize Cards */}
      <section className="public-section bg-gradient-to-br from-light-bg to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Monthly <span className="gradient-text">Prize Structure</span>
            </h2>
            <p className="text-lg text-gray-600">
              Exciting prizes waiting for you every month
            </p>
          </div>

          <div className="space-y-12">
            {team.months.map((monthData, monthIndex) => (
              <div
                key={monthIndex}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden fade-up"
                style={{ animationDelay: `${monthIndex * 0.1}s` }}
              >
                {/* Month Header */}
                <div className={`bg-gradient-to-r ${
                  teamId === 1 ? 'from-soft-pink to-soft-rose' : 'from-soft-orange to-soft-red'
                } p-6 md:p-8`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        Month {monthData.month}
                      </h3>
                      <p className="text-white/90">
                        {monthData.prizes.reduce((sum, prize) => sum + prize.quantity, 0)} Winners • {monthData.prizes.length} Prize Types
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Prizes Grid */}
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {monthData.prizes.map((prize, prizeIndex) => (
                      <div
                        key={prizeIndex}
                        className="public-prize-card"
                      >
                        {/* Prize Image */}
                        <div className="aspect-square bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-2">
                          <img
                            src={prize.image}
                            alt={prize.name}
                            className="public-prize-image"
                            loading="lazy"
                          />
                        </div>

                        {/* Prize Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                            {prize.name}
                          </h4>
                          {prize.value && (
                            <p className="text-soft-rose font-bold text-sm mb-1">{prize.value}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {prize.quantity} {prize.quantity === 1 ? 'Winner' : 'Winners'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-soft-pink via-soft-orange to-soft-violet">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join {team.name}?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Start your journey and get a chance to win amazing prizes every month
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-soft-rose font-semibold rounded-xl hover:shadow-xl transition"
            >
              <span>Join Now</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
            <Link
              to="/teams"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white/30 font-semibold rounded-xl hover:bg-white/20 transition"
            >
              <span>Compare Teams</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TeamDetail;
