import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Public Pages (Srimathi's Design)
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import Teams from './pages/public/Teams';
import TeamDetail from './pages/public/TeamDetail';
import Prizes from './pages/public/Prizes';
import PublicDraw from './pages/public/Draw';
import Winners from './pages/public/Winners';
import Contact from './pages/public/Contact';
import PublicLogin from './pages/public/Login';
import ReferralRegistration from './pages/public/ReferralRegistration';

// Old Pages (Keep for backward compatibility)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FranchiseDashboard from './pages/FranchiseDashboardV2';
import FranchiseGroupDetails from './pages/FranchiseGroupDetails';
import AdminDashboard from './pages/AdminDashboardV2';
import AdminFranchiseDetails from './pages/AdminFranchiseDetails';
import PaymentPage from './pages/PaymentPage';
import QRScannerPage from './pages/QRScannerPage';
import InviteSplashPage from './pages/InviteSplashPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// V2 User Panel Components
import UserLoginV2 from './pages/UserLoginV2';
import UserDashboard from './pages/user/UserDashboard';
import UserVault from './pages/user/UserVault';
import UserDraws from './pages/user/UserDraws';
import UserRedeem from './pages/user/UserRedeem';
import UserMyPlan from './pages/user/UserMyPlan';
import UserPayments from './pages/user/UserPayments';
import UserProfile from './pages/user/UserProfile';
import UserProfileEdit from './pages/user/UserProfileEdit';
import UserChangePassword from './pages/user/UserChangePassword';
import UserNotifications from './pages/user/UserNotifications';

// Wallet Components
import AddMoney from './components/wallet/AddMoney';
import PaymentCallback from './components/wallet/PaymentCallback';
import TransactionHistory from './components/wallet/TransactionHistory';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// Profile Pages
import ProfileEdit from './pages/ProfileEdit';
import ChangePassword from './pages/ChangePassword';
import ProfileStats from './pages/ProfileStats';
import Settings from './pages/Settings';
import MillanceWallet from './pages/MillanceWallet';
import SavingsWallet from './pages/SavingsWallet';

import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-screen" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--neutral-50)'
      }}>
        <div className="spinner" style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--neutral-200)',
          borderTopColor: 'var(--brand-600)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Wrong role - redirect to login
  if (requiredRole && role !== requiredRole) {
    console.log(`ProtectedRoute: Wrong role (expected: ${requiredRole}, got: ${role}), redirecting to login`);
    return <Navigate to="/login" replace />;
  }
  
  // All good - render children
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* PUBLIC WEBSITE ROUTES (Srimathi's Design) */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/team-1" element={<TeamDetail teamId={1} />} />
          <Route path="/teams/team-2" element={<TeamDetail teamId={2} />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/draw" element={<PublicDraw />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/public-login" element={<PublicLogin />} />
          
          {/* Franchise Referral Registration */}
          <Route path="/join/:franchiseId/:team/:group" element={<ReferralRegistration />} />
          
          {/* OLD ROUTES (Keep for backward compatibility) */}
          <Route path="/login" element={<Login />} />
          <Route path="/franchise" element={<Login />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Invite Link */}
          <Route path="/:franchiseSlug/:inviteCode" element={<InviteSplashPage />} />
          
          {/* Payment & QR Scanner - Public */}
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/scan-qr" element={<QRScannerPage />} />
          
          {/* User Dashboard (Old) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Franchise Dashboard */}
          <Route
            path="/franchise-dashboard"
            element={
              <ProtectedRoute requiredRole="franchise">
                <FranchiseDashboard />
              </ProtectedRoute>
            }
          />

          {/* Franchise Group Details */}
          <Route
            path="/franchise-dashboard/group/:groupId"
            element={
              <ProtectedRoute requiredRole="franchise">
                <FranchiseGroupDetails />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Franchise Details */}
          <Route
            path="/admin-dashboard/franchise/:franchiseId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminFranchiseDetails />
              </ProtectedRoute>
            }
          />

          {/* V2 User Panel Routes (New Design) */}
          <Route path="/v2/login" element={<UserLoginV2 />} />
          <Route path="/v2/dashboard" element={<UserDashboard />} />
          <Route path="/v2/vault" element={<UserVault />} />
          <Route path="/v2/draws" element={<UserDraws />} />
          <Route path="/v2/redeem" element={<UserRedeem />} />
          <Route path="/v2/my-plan" element={<UserMyPlan />} />
          <Route path="/v2/payments" element={<UserPayments />} />
          <Route path="/v2/profile" element={<UserProfile />} />
          <Route path="/v2/profile/edit" element={<UserProfileEdit />} />
          <Route path="/v2/profile/change-password" element={<UserChangePassword />} />
          <Route path="/v2/notifications" element={<UserNotifications />} />

          {/* Wallet Routes */}
          <Route 
            path="/add-money" 
            element={
              <ProtectedRoute requiredRole="user">
                <AddMoney />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-callback" 
            element={
              <ProtectedRoute requiredRole="user">
                <PaymentCallback />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transaction-history" 
            element={
              <ProtectedRoute requiredRole="user">
                <TransactionHistory />
              </ProtectedRoute>
            } 
          />

          {/* Legal Pages - Public Access */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* Profile Pages - Protected */}
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/stats" 
            element={
              <ProtectedRoute>
                <ProfileStats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <MillanceWallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/millance-wallet" 
            element={
              <ProtectedRoute>
                <MillanceWallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/savings-wallet" 
            element={
              <ProtectedRoute>
                <SavingsWallet />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
