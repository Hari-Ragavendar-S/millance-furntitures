import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@millance.com', 'support@millance.com'],
      color: 'pink-gradient'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 XXXXX XXXXX', '+91 XXXXX XXXXX'],
      color: 'purple-gradient'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Tamil Nadu', 'India'],
      color: 'blue-gradient'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 9AM - 6PM', 'Sunday: Closed'],
      color: 'orange-gradient'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="premium-section pt-32">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="premium-stat-icon mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)', width: '80px', height: '80px' }}>
              <MessageCircle className="w-10 h-10" />
            </div>
            <h1 className="premium-section-title">
              Get In <span className="premium-gradient-text">Touch</span>
            </h1>
            <p className="premium-section-subtitle text-lg">
              Have questions? We're here to help. Reach out to us anytime!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="premium-section">
        <div className="container-premium">
          <div className="premium-features-grid">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`premium-feature-card premium-feature-${info.color} animate-fade-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="premium-feature-icon">
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="premium-feature-title">{info.title}</h3>
                <div className="premium-feature-description space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="premium-section premium-section-alt">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto premium-box border-pink overflow-hidden animate-fade-up">
            <div className="premium-cta-section p-6 md:p-8 rounded-t-2xl" style={{ marginTop: 0, marginBottom: 0 }}>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                Send Us a Message
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="premium-btn premium-btn-primary w-full"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="premium-cta-section">
        <div className="container-premium text-center">
          <Phone className="premium-cta-icon" />
          <h2 className="premium-cta-title">
            Need Immediate Assistance?
          </h2>
          <p className="premium-cta-subtitle">
            Our customer support team is ready to help you
          </p>
          <a
            href="tel:+91XXXXXXXXXX"
            className="premium-btn premium-btn-white inline-flex"
          >
            <Phone className="w-5 h-5" />
            <span>Call Now</span>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Contact;
