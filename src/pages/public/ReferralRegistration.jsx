import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Eye, EyeOff, Building2, CheckCircle, AlertCircle } from 'lucide-react';

const ReferralRegistration = () => {
  const { franchiseId, team, group } = useParams();
  const navigate = useNavigate();
  
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memberId, setMemberId] = useState('');

  // Convert URL params to display format
  const getTeamDisplay = () => team === 'team-1' ? 'Team 1' : 'Team 2';
  const getGroupDisplay = () => {
    const groupMap = {
      'group-a': 'Group A',
      'group-b': 'Group B',
      'group-c': 'Group C'
    };
    return groupMap[group] || group;
  };

  useEffect(() => {
    // Load franchise info
    const franchises = JSON.parse(localStorage.getItem('franchises') || '[]');
    const franchise = franchises.find(f => f.id === franchiseId);
    
    if (franchise) {
      setFranchiseInfo(franchise);
    } else {
      // Invalid franchise ID
      setFranchiseInfo(null);
    }
  }, [franchiseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    } else {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some(u => u.phone === formData.phone)) {
        newErrors.phone = 'Phone number already exists';
      }
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Enter valid email address';
      } else {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.some(u => u.email === formData.email)) {
          newErrors.email = 'Email already exists';
        }
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateMemberId = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.length === 0) {
      return 'ML001';
    }
    
    const ids = existingUsers
      .map(u => parseInt(u.memberId.replace('ML', '')))
      .filter(n => !isNaN(n));
    
    const maxId = Math.max(...ids, 0);
    const nextId = maxId + 1;
    return `ML${String(nextId).padStart(3, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newMemberId = generateMemberId();
      
      const newUser = {
        memberId: newMemberId,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || '',
        password: formData.password,
        franchiseId: franchiseId,
        team: getTeamDisplay(),
        group: getGroupDisplay(),
        registrationDate: new Date().toISOString(),
        status: 'Active',
        paid: '₹0',
        pending: '₹10,000',
        month: 5,
        createdBy: 'referral'
      };

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      setMemberId(newMemberId);
      setShowSuccess(true);
      setIsSubmitting(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/user/login');
      }, 3000);
    }, 1000);
  };

  if (!franchiseInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Referral Link</h2>
          <p className="text-gray-400 mb-6">This franchise referral link is not valid or has expired.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-blue-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created Successfully!</h2>
          <p className="text-gray-400 mb-4">Your member ID is</p>
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 rounded-lg p-4 mb-6">
            <p className="text-3xl font-bold text-violet-400">{memberId}</p>
          </div>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join Millance Lucky Draw</h1>
          <p className="text-gray-400">Create your account and start participating</p>
        </div>

        {/* Franchise Info Card */}
        <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Registering under</p>
              <h3 className="text-xl font-bold text-white">{franchiseInfo.name}</h3>
              <p className="text-sm text-violet-400 font-semibold">{franchiseId}</p>
            </div>
          </div>
          
          {/* Team & Group Display */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
              <p className="text-xs text-gray-400 mb-1">Assigned Team</p>
              <p className="text-lg font-bold text-cyan-400">{getTeamDisplay()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-green-500/30">
              <p className="text-xs text-gray-400 mb-1">Assigned Group</p>
              <p className="text-lg font-bold text-green-400">{getGroupDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-900 border ${errors.fullName ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-900 border ${errors.phone ? 'border-red-500' : 'border-blue-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-purple-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-pink-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 bg-slate-900 border ${errors.confirmPassword ? 'border-red-500' : 'border-pink-500'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/user/login')}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRegistration;
