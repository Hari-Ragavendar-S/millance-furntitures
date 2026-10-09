import PublicLayout from '../../layouts/PublicLayout';
import { UserPlus, FileText, CreditCard, Sparkles, Award, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Join Millance',
      description: 'Register and create your account with basic details. Choose your preferred team based on member capacity.',
      color: 'from-soft-pink to-soft-rose'
    },
    {
      number: '02',
      icon: FileText,
      title: 'Select Your Plan',
      description: 'Choose between Team 1 (500 members) or Team 2 (1000 members). Review the monthly prize structure.',
      color: 'from-soft-orange to-soft-red'
    },
    {
      number: '03',
      icon: CreditCard,
      title: 'Complete Payment',
      description: 'Make secure payment for your selected plan. Easy monthly installment options available.',
      color: 'from-soft-violet to-soft-blue'
    },
    {
      number: '04',
      icon: Sparkles,
      title: 'Monthly Draws',
      description: 'Participate automatically in exciting monthly lucky draws. 11 months of thrilling opportunities.',
      color: 'from-gold to-soft-orange'
    },
    {
      number: '05',
      icon: Award,
      title: 'Winner Announcement',
      description: 'Winners are announced publicly with full transparency. Check your dashboard for draw results.',
      color: 'from-soft-pink to-soft-violet'
    },
    {
      number: '06',
      icon: Gift,
      title: 'Claim Your Prize',
      description: 'If you win, redeem your prize easily through your dashboard. We deliver prizes to your doorstep.',
      color: 'from-soft-blue to-soft-rose'
    },
  ];

  const faqs = [
    {
      question: 'How are winners selected?',
      answer: 'Winners are selected through a fair and transparent lucky draw system. All members have equal chances based on their team selection.'
    },
    {
      question: 'When are the draws conducted?',
      answer: 'Draws are conducted monthly for 11 consecutive months. Exact dates are announced in advance on our platform.'
    },
    {
      question: 'How do I claim my prize?',
      answer: 'Winners can claim prizes through their dashboard. We coordinate delivery or collection based on the prize type.'
    },
    {
      question: 'Can I participate in both teams?',
      answer: 'Yes! You can join both Team 1 and Team 2 to increase your chances of winning amazing prizes.'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="premium-section pt-32 section-delay-0">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="premium-section-title">
              How <span className="premium-gradient-text">It Works</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Simple, transparent, and exciting! Join Millance Lucky Draw in 6 easy steps and start your journey towards winning amazing prizes.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="premium-section section-delay-1 animate-fade-up">
        <div className="container-premium">
          <div className="premium-steps-grid">
            {steps.slice(0, 4).map((step, index) => (
              <div
                key={index}
                className={`premium-step-card ${
                  index === 0 ? 'premium-step-pink' : 
                  index === 1 ? 'premium-step-purple' : 
                  index === 2 ? 'premium-step-blue' : 
                  'premium-step-orange'
                } animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-step-number">{step.number}</div>
                <div className="premium-step-icon">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-step-title">{step.title}</h3>
                <p className="premium-step-description">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="premium-steps-grid mt-8">
            {steps.slice(4).map((step, index) => (
              <div
                key={index + 4}
                className={`premium-step-card ${
                  index === 0 ? 'premium-step-pink' : 'premium-step-blue'
                } animate-slide-up`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className="premium-step-number">{step.number}</div>
                <div className="premium-step-icon">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-step-title">{step.title}</h3>
                <p className="premium-step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="premium-section premium-section-alt section-delay-2 animate-fade-up">
        <div className="container-premium">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="premium-box border-pink p-8 text-center animate-scale-in">
              <div className="premium-stat-icon mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)' }}>
                <span className="text-2xl font-bold">11</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Draws</h3>
              <p className="text-gray-600 text-sm">
                11 exciting monthly draws with multiple winners each month
              </p>
            </div>

            <div className="premium-box border-purple p-8 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="premium-stat-icon mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Teams Available</h3>
              <p className="text-gray-600 text-sm">
                Choose Team 1 (500) or Team 2 (1000) based on your preference
              </p>
            </div>

            <div className="premium-box border-blue p-8 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="premium-stat-icon mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                <span className="text-2xl font-bold">100%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600 text-sm">
                Fair lucky draw system with public winner announcements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="premium-section section-delay-3 animate-fade-up">
        <div className="container-premium">
          <div className="premium-section-header">
            <h2 className="premium-section-title">
              Frequently Asked <span className="premium-gradient-text">Questions</span>
            </h2>
            <p className="premium-section-subtitle">
              Got questions? We've got answers!
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`premium-box ${index % 2 === 0 ? 'border-pink' : 'border-blue'} p-6 md:p-8 animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta-section section-delay-4 animate-fade-up">
        <div className="container-premium text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="premium-cta-title">
              Ready to Get Started?
            </h2>
            <p className="premium-cta-subtitle">
              Join Millance Lucky Draw today and be part of our winning community
            </p>
            <Link
              to="/teams"
              className="premium-btn premium-btn-white inline-flex"
            >
              <span>Choose Your Team</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HowItWorks;
