// Mock Data for the Application

export const mockUser = {
  id: '123456',
  name: 'John Doe',
  phone: '+91 9876543210',
  email: 'john.doe@example.com',
  mldId: '123456',
  joinedDate: '2026-01-15',
  avatar: null
};

export const mockPlans = [
  {
    id: 'plan-500',
    amount: 500,
    name: 'Silver Plan',
    duration: 11,
    totalMembers: 500,
    currentMembers: 487,
    prize: 250000,
    description: 'Entry level monthly draw',
    color: '#94A3B8'
  },
  {
    id: 'plan-1000',
    amount: 1000,
    name: 'Gold Plan',
    duration: 11,
    totalMembers: 1000,
    currentMembers: 923,
    prize: 500000,
    description: 'Premium monthly draw',
    color: '#F59E0B'
  }
];

export const mockUserEnrollments = [
  {
    id: 'enroll-1',
    planId: 'plan-500',
    groupId: 'A1B2',
    groupName: 'Silver Alpha',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    monthlyAmount: 500,
    status: 'active',
    payments: [
      { month: 'Feb 2026', paid: true, date: '2026-02-01', amount: 500 },
      { month: 'Mar 2026', paid: true, date: '2026-03-01', amount: 500 },
      { month: 'Apr 2026', paid: true, date: '2026-04-01', amount: 500 },
      { month: 'May 2026', paid: true, date: '2026-05-01', amount: 500 },
      { month: 'Jun 2026', paid: true, date: '2026-06-01', amount: 500 },
      { month: 'Jul 2026', paid: true, date: '2026-07-01', amount: 500 },
      { month: 'Aug 2026', paid: true, date: '2026-08-01', amount: 500 },
      { month: 'Sep 2026', paid: true, date: '2026-09-01', amount: 500 },
      { month: 'Oct 2026', paid: false, date: null, amount: 500 },
      { month: 'Nov 2026', paid: false, date: null, amount: 500 },
      { month: 'Dec 2026', paid: false, date: null, amount: 500 }
    ]
  }
];

export const mockDrawHistory = [
  {
    id: 'draw-202608',
    month: 'August 2026',
    date: '2026-08-31',
    groupId: 'A1B2',
    planAmount: 500,
    prize: 250000,
    winner: {
      mldId: '234567',
      name: 'Sarah Johnson'
    },
    totalParticipants: 487,
    status: 'completed'
  },
  {
    id: 'draw-202607',
    month: 'July 2026',
    date: '2026-07-31',
    groupId: 'A1B2',
    planAmount: 500,
    prize: 250000,
    winner: {
      mldId: '345678',
      name: 'Mike Wilson'
    },
    totalParticipants: 485,
    status: 'completed'
  },
  {
    id: 'draw-202606',
    month: 'June 2026',
    date: '2026-06-30',
    groupId: 'A1B2',
    planAmount: 500,
    prize: 250000,
    winner: {
      mldId: '456789',
      name: 'Emily Davis'
    },
    totalParticipants: 482,
    status: 'completed'
  }
];

export const mockUpcomingDraw = {
  id: 'draw-202609',
  month: 'September 2026',
  date: '2026-09-30',
  groupId: 'A1B2',
  planAmount: 500,
  prize: 250000,
  totalParticipants: 487,
  status: 'upcoming',
  daysLeft: 0,
  hoursLeft: 12,
  minutesLeft: 30
};

export const mockRecentWinners = [
  { mldId: '234567', name: 'Sarah J.', prize: 250000, date: '2026-08-31' },
  { mldId: '789012', name: 'Robert M.', prize: 500000, date: '2026-08-31' },
  { mldId: '345678', name: 'Mike W.', prize: 250000, date: '2026-07-31' },
  { mldId: '890123', name: 'Lisa K.', prize: 500000, date: '2026-07-31' }
];

export const mockStats = {
  totalMembers: 1500,
  activePlans: 2,
  totalPrizePool: 750000,
  drawsCompleted: 24,
  nextDrawDate: '2026-09-30'
};

export const mockFranchise = {
  id: 'franchise-1',
  name: 'Mumbai Central Branch',
  code: 'MUMB-01',
  admin: 'Rajesh Kumar',
  phone: '+91 9876543210',
  totalGroups: 5,
  totalMembers: 1500,
  revenue: 12500000
};

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'payment',
    title: 'Payment Due',
    message: 'Your October 2026 payment is due in 3 days',
    date: '2026-09-27',
    read: false
  },
  {
    id: 'notif-2',
    type: 'draw',
    title: 'Upcoming Draw',
    message: 'September draw happening today at 8:00 PM',
    date: '2026-09-30',
    read: false
  },
  {
    id: 'notif-3',
    type: 'info',
    title: 'Profile Updated',
    message: 'Your profile information has been updated successfully',
    date: '2026-09-25',
    read: true
  }
];
