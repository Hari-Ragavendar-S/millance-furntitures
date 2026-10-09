import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserLayout from '../../layouts/UserLayout';
import { 
  Bell, CheckCircle, Clock, Calendar, Trophy, 
  DollarSign, AlertCircle, ChevronDown, X 
} from 'lucide-react';

const UserNotifications = () => {
  const navigate = useNavigate();

  // Initial notification data (should come from API/context)
  const [notifications, setNotifications] = useState([
    {
      id: 'N001',
      userId: 'ML001',
      type: 'payment',
      title: 'Payment Received',
      message: 'Your payment of ₹5,000 for Month 6 has been received successfully.',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionRoute: '/user/payments'
    },
    {
      id: 'N002',
      userId: 'ML001',
      type: 'draw',
      title: 'Upcoming Draw',
      message: 'Month 5 draw is scheduled for May 15, 2024. Good luck!',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false,
      actionRoute: '/user/draws'
    },
    {
      id: 'N003',
      userId: 'ML001',
      type: 'reminder',
      title: 'Payment Reminder',
      message: 'Your next payment of ₹5,000 is due on May 20, 2024.',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      actionRoute: '/user/payments'
    },
    {
      id: 'N004',
      userId: 'ML001',
      type: 'result',
      title: 'Draw Result',
      message: 'Month 4 draw results are now available. Check your dashboard.',
      time: '1 week ago',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true,
      actionRoute: '/user/draws'
    },
    {
      id: 'N005',
      userId: 'ML001',
      type: 'payment',
      title: 'Payment Confirmed',
      message: 'Payment of ₹5,000 for Month 5 has been processed.',
      time: '1 week ago',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      read: true,
      actionRoute: '/user/payments'
    },
    {
      id: 'N006',
      userId: 'ML001',
      type: 'draw',
      title: 'Draw Completed',
      message: 'Month 3 draw has been completed. Winners announced.',
      time: '2 weeks ago',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      read: true,
      actionRoute: '/user/draws'
    }
  ]);

  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return DollarSign;
      case 'draw':
        return Calendar;
      case 'reminder':
        return Clock;
      case 'result':
        return Trophy;
      default:
        return Bell;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'payment':
        return 'user-notif-payment';
      case 'draw':
        return 'user-notif-draw';
      case 'reminder':
        return 'user-notif-reminder';
      case 'result':
        return 'user-notif-result';
      default:
        return 'user-notif-default';
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Mark single notification as read and navigate
  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      setNotifications(prev =>
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
    
    // Navigate to action route if exists
    if (notification.actionRoute) {
      navigate(notification.actionRoute);
    }
  };

  // Filter notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.type === selectedFilter);
    }

    // Filter by unread
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <UserLayout>
      <div className="user-dashboard-bubbles-v2">
        <div className="user-bubble-v2 user-bubble-v2-1"></div>
        <div className="user-bubble-v2 user-bubble-v2-2"></div>
        <div className="user-bubble-v2 user-bubble-v2-3"></div>
        <div className="user-bubble-v2 user-bubble-v2-4"></div>
      </div>

      <div className="user-dashboard-compact">
        {/* Page Header */}
        <div className="user-notif-header">
          <div>
            <h1 className="user-notif-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="user-notif-unread-count">
                • {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="user-notif-mark-all-btn"
            >
              <CheckCircle size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-notif-filters"
        >
          {/* Type Filter */}
          <div className="user-notif-filter-group">
            <label className="user-notif-filter-label">Filter by:</label>
            <div className="user-select-wrapper">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="user-notif-select"
              >
                <option value="all">All Notifications</option>
                <option value="payment">Payments</option>
                <option value="draw">Draws</option>
                <option value="reminder">Reminders</option>
                <option value="result">Results</option>
              </select>
              <ChevronDown className="user-select-icon" />
            </div>
          </div>

          {/* Unread Only Toggle */}
          <label className="user-notif-toggle">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="user-notif-checkbox"
            />
            <span className="user-notif-toggle-label">Unread Only</span>
          </label>
        </motion.div>

        {/* Notifications List */}
        <div className="user-notif-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`user-notif-card ${
                    !notification.read ? 'user-notif-unread' : ''
                  } ${colorClass}`}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.read && (
                    <div className="user-notif-unread-dot"></div>
                  )}

                  {/* Icon */}
                  <div className={`user-notif-icon-wrapper ${colorClass}`}>
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div className="user-notif-content">
                    <h4 className="user-notif-card-title">
                      {notification.title}
                    </h4>
                    <p className="user-notif-message">
                      {notification.message}
                    </p>
                    <span className="user-notif-time">
                      <Clock size={12} />
                      {notification.time}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="user-notif-empty"
            >
              <div className="user-notif-empty-icon">
                <Bell size={48} />
              </div>
              <h3 className="user-notif-empty-title">No Notifications</h3>
              <p className="user-notif-empty-text">
                {showUnreadOnly 
                  ? "You're all caught up! No unread notifications."
                  : "You have no notifications at the moment."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserNotifications;
