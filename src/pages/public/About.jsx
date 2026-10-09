import PublicLayout from '../../layouts/PublicLayout';
import { Shield, Users, Award, Heart, CheckCircle, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency. All draws are conducted fairly with public announcements of winners.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our members are our priority. We build lasting relationships based on trust and mutual respect.',
    },
    {
      icon: Award,
      title: 'Quality Prizes',
      description: 'We offer premium quality prizes including bikes, gold, furniture, and electronics from trusted brands.',
    },
    {
      icon: Heart,
      title: 'Customer Satisfaction',
      description: 'Dedicated customer support ensures every member has an excellent experience with us.',
    },
  ];

  const howItWorks = [
    { step: '01', title: 'Join a Team', desc: 'Choose Team 1 (500 members) or Team 2 (1000 members)' },
    { step: '02', title: 'Pay Monthly', desc: 'Pay ₹1,000 every month for 11 months' },
    { step: '03', title: 'Participate', desc: 'Get automatically entered into monthly lucky draws' },
    { step: '04', title: 'Win Prizes', desc: 'Winners announced on 15th of every month' },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="premium-section-title">
              About <span className="premium-gradient-text">Millance Lucky Draw</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Millance is India's trusted lucky draw platform, bringing joy and excitement to thousands of members through fair and transparent monthly draws.
            </p>
          </div>
        </div>
      </section>

      {/* What is Millance */}
      <section className="premium-section section-delay-1 animate-fade-up">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto premium-box border-pink p-8 md:p-12 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="premium-stat-icon" style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)' }}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What is Millance?</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Millance Lucky Draw is a premium monthly prize scheme where members pay ₹1,000 per month for 11 consecutive months and participate in exciting lucky draws.
              </p>
              <p>
                Every month on the 15th, we conduct transparent lucky draws where lucky winners take home amazing prizes including bikes, gold coins, LED TVs, furniture, and much more!
              </p>
              <p className="font-semibold text-gray-900">
                ஆரம்பமான அனுமுகம் – அதிர்ஷ்ட பரிசுகள்
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="premium-section premium-section-alt section-delay-2 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              How the <span className="premium-gradient-text">Plan Works</span>
            </h2>
            <p className="premium-section-subtitle">
              Simple 4-step process to participate
            </p>
          </div>

          <div className="premium-steps-grid">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className={`premium-step-card ${
                  index === 0 ? 'premium-step-pink' : 
                  index === 1 ? 'premium-step-purple' : 
                  index === 2 ? 'premium-step-blue' : 
                  'premium-step-orange'
                } ${index % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-step-number">{step.step}</div>
                <h3 className="premium-step-title">{step.title}</h3>
                <p className="premium-step-description">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="premium-section section-delay-3 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Our <span className="premium-gradient-text">Core Values</span>
            </h2>
            <p className="premium-section-subtitle">
              The principles that guide everything we do
            </p>
          </div>

          <div className="premium-features-grid">
            {values.map((value, index) => (
              <div
                key={index}
                className={`premium-feature-card ${
                  index === 0 ? 'premium-feature-pink-gradient' : 
                  index === 1 ? 'premium-feature-purple-gradient' : 
                  index === 2 ? 'premium-feature-blue-gradient' : 
                  'premium-feature-orange-gradient'
                } animate-float-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-feature-icon">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-feature-title">{value.title}</h3>
                <p className="premium-feature-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Highlight */}
      <section className="premium-section premium-section-alt section-delay-4 animate-fade-up">
        <div className="container-premium">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="premium-section-title mb-6">
              Amazing <span className="premium-gradient-text">Monthly Prizes</span>
            </h2>
            <p className="premium-section-subtitle mb-8">
              11 months of exciting prizes including bikes, gold, furniture, electronics and more!
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="premium-box border-pink p-6 animate-scale-pop animate-border-glow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team 1 - 500 Members</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span>Car Fund ₹1,00,000 (Month 11)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span>E-Bikes, LED TVs, Gold & Silver</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span>Premium Furniture & Appliances</span>
                  </li>
                </ul>
              </div>

              <div className="premium-box border-blue p-6 animate-scale-pop animate-border-glow" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team 2 - 1000 Members</h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>Car Fund ₹2,00,000 (Month 11)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>TVS Bike, Royal Enfield Fund</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span>More Winners Every Month</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/prizes" className="premium-btn premium-btn-primary inline-flex">
                <span>View All Prizes</span>
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section section-delay-5 animate-fade-up">
        <div className="container-premium text-center">
          <Trophy className="premium-cta-icon" />
          <h2 className="premium-cta-title">
            Ready to Join Millance?
          </h2>
          <p className="premium-cta-subtitle">
            Choose your team and start your journey towards winning amazing prizes
          </p>
          <Link to="/teams" className="premium-btn premium-btn-white inline-flex">
            <span>Join Now</span>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
