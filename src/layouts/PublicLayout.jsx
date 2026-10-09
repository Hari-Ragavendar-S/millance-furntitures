import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, Home, Info, HelpCircle, Users, Gift, Sparkles, Award, Phone, LogIn } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const PublicLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Prizes', path: '/prizes', icon: Gift },
    { name: 'Lucky Draw', path: '/draw', icon: Sparkles },
    { name: 'Winners', path: '/winners', icon: Award },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="public-website-wrapper">
      {/* User Panel Style Background */}
      <div className="public-global-bg">
        <div className="public-bg-blob public-blob-1"></div>
        <div className="public-bg-blob public-blob-2"></div>
        <div className="public-bg-blob public-blob-3"></div>
        <div className="public-bg-blob public-blob-4"></div>
        <div className="public-bg-particles"></div>
      </div>

      {/* Navbar */}
      <nav className={`public-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-soft-pink to-soft-rose rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold gradient-text">Millance</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`public-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Login Button & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="public-btn-primary flex items-center gap-2 text-sm md:text-base px-4 md:px-6"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t animate-fade-down">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition ${
                    isActive(item.path) ? 'text-soft-pink bg-pink-50' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Footer */}
      <footer className="public-footer mt-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-soft-pink to-soft-rose rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Millance</span>
              </div>
              <p className="text-gray-400 text-sm">
                ஆரம்பமான அனுமுகம் – அதிர்ஷ்ட பரிசுகள்
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white text-sm transition">About Us</Link>
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white text-sm transition">How It Works</Link>
                <Link to="/teams" className="block text-gray-400 hover:text-white text-sm transition">Teams</Link>
                <Link to="/prizes" className="block text-gray-400 hover:text-white text-sm transition">Prizes</Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block text-gray-400 hover:text-white text-sm transition">Contact Us</Link>
                <Link to="/winners" className="block text-gray-400 hover:text-white text-sm transition">Winners</Link>
                <a href="#terms" className="block text-gray-400 hover:text-white text-sm transition">Terms & Conditions</a>
                <a href="#privacy" className="block text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Email: info@millance.com</p>
                <p>Phone: +91 XXXXX XXXXX</p>
                <p>Address: Tamil Nadu, India</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Millance Lucky Draw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
