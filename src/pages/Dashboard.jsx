import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Home from '../components/dashboard/Home';
import Draw from '../components/dashboard/Draw';
import Rewards from '../components/dashboard/Rewards';
import Wallet from '../components/dashboard/Wallet';
import Profile from '../components/dashboard/Profile';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab') || 'home';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  
  // Update activeTab when URL changes
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab') || 'home';
    setActiveTab(tab);
    
    // Scroll to top on tab change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.search]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'draw':
        return <Draw />;
      case 'rewards':
        return <Rewards />;
      case 'wallet':
        return <Wallet />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {renderContent()}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;
