import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import apiV2 from '../services/apiV2';

const UserLoginV2 = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call our real backend API
      const response = await apiV2.login({
        identifier: formData.identifier,
        password: formData.password,
        role: 'user'
      });

      // Store token and user data
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user_data));

      // Navigate to dashboard
      navigate('/v2/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid phone/email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-light-bg to-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-soft-pink to-soft-rose rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">User Login</h1>
          <p className="text-gray-600">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number or Email</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                disabled={loading}
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-soft-pink focus:border-transparent disabled:opacity-50"
                placeholder="Phone or Email"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Enter your registered phone number or email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                disabled={loading}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-soft-pink focus:border-transparent disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-soft-pink to-soft-rose text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Logging in...' : 'Login'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Email: <span className="font-mono bg-white px-2 py-0.5 rounded">user@millancefurniture.com</span></p>
            <p>MLD ID: <span className="font-mono bg-white px-2 py-0.5 rounded">866257</span></p>
            <p>Password: <span className="font-mono bg-white px-2 py-0.5 rounded">millance</span></p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/login" className="text-soft-rose hover:text-soft-red">Back to main login</a>
        </p>
      </div>
    </div>
  );
};

export default UserLoginV2;
