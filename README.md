# Millance Lucky Draw - Full Stack Application

Complete Lucky Draw Management System built with React + Vite frontend and FastAPI backend.

## 🚀 Live Demo

**Production URL**: https://millancefurniture.com

## 📋 Features

### User Panel
- ✅ User Registration & Login
- ✅ Dashboard with stats and quick actions
- ✅ Plan enrollment and group selection
- ✅ Dual wallet system (Millance + Savings)
- ✅ Monthly payment tracking
- ✅ Draw countdown timer with auto next-month display
- ✅ Prize rewards and redemption
- ✅ Profile management with photo upload
- ✅ Transaction history
- ✅ Cashfree payment integration
- ✅ Referral system

### Franchise Panel V2
- ✅ Modern dashboard with Srimathi UI/UX
- ✅ Prize Pool management
- ✅ Plan creation with prize pool linking
- ✅ Group management with member tracking
- ✅ Draw scheduling system
- ✅ Draw history with winner tracking
- ✅ Member enrollments view
- ✅ Referral link generator with QR code
- ✅ Earnings breakdown by group
- ✅ Group details page with:
  - Complete member list
  - Winners by month (all 11 months)
  - Payment tracking
  - Search and filters

### Admin Panel V2 (NEW!)
- ✅ Complete dashboard with statistics
- ✅ **10 Management Tabs**:
  1. Dashboard - Overview stats, activity, quick actions
  2. Franchises - CRUD, search, status toggle, details page
  3. Users - Grid view, search, user details modal
  4. Prize Pools - Create with multiple prizes
  5. Plans - Create linked to prize pools
  6. Groups - Filter by franchise, click to details
  7. Enrollments - Status & franchise filters
  8. Payments - 3 sub-tabs (All/Successful/Pending/Failed)
  9. Draws - Scheduled & History tabs
  10. Reports - Revenue breakdown, franchise stats
- ✅ **Admin Franchise Details Page**:
  - Overview, Groups, Members tabs
  - Search functionality
  - 20 items per page pagination
- ✅ All creation modals with 2-step confirmation
- ✅ Toast notifications (top-right, auto-dismiss)
- ✅ Srimathi color gradients throughout
- ✅ Glassmorphism design with dark theme
- ✅ Fully responsive (320px+)

### Login Pages (Srimathi UI)
- ✅ **Admin Login** - Dark mode, Blue/Purple gradient
- ✅ **Franchise Login** - Light mode, Orange/Red gradient
- ✅ **User Login** - Light mode, Pink/Red gradient
- ✅ Icon-based inputs with smooth animations
- ✅ Loading states and error handling
- ✅ Responsive across all devices

### Public Website
- ✅ Homepage with hero section
- ✅ About page
- ✅ How It Works
- ✅ Teams showcase
- ✅ Prizes display
- ✅ Live draw countdown
- ✅ Winners gallery
- ✅ Contact form
- ✅ Referral registration

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Routing
- **Lucide React** - Icons
- **Tailwind CSS** - Utility-first CSS
- **Custom CSS** - Component styling
- **Axios** - HTTP client

### Backend (Not in this repo)
- **FastAPI** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Cashfree** - Payment gateway

## 📁 Project Structure

```
millionaire-draw/
├── src/
│   ├── assets/           # Images and static assets
│   ├── components/       # Reusable components
│   │   ├── dashboard/    # Dashboard components
│   │   └── wallet/       # Wallet components
│   ├── context/          # React Context (Auth, etc.)
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   │   ├── public/       # Public website pages
│   │   ├── user/         # User panel pages
│   │   ├── AdminDashboardV2.jsx
│   │   ├── AdminFranchiseDetails.jsx
│   │   ├── FranchiseDashboardV2.jsx
│   │   └── FranchiseGroupDetails.jsx
│   ├── services/         # API services
│   ├── styles/           # CSS files
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Public assets
├── .env                  # Environment variables
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running (separate repository)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Hari-Ragavendar-S/millance-furntitures.git
cd millance-furntitures
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `.env` file:
```env
VITE_API_URL=https://millancefurniture.com/api
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

## 🎨 Design System - Srimathi Colors

### Color Gradients
- **Pink/Rose**: `#EC4899 → #E11D48` (Franchises, Prize Pools)
- **Purple/Violet**: `#A855F7 → #7C3AED` (Groups, Plans)
- **Blue/Cyan**: `#3B82F6 → #0891B2` (Users, Stats)
- **Green/Emerald**: `#22C55E → #059669` (Success, Active)
- **Gold/Orange**: `#FBBF24 → #F59E0B` (Revenue, Earnings)
- **Red/Pink**: `#EF4444 → #DB2777` (Warnings, Issues)

### Dark Theme
- Background: `linear-gradient(135deg, #0f0c1d, #1a1333)`
- Welcome Header: `linear-gradient(to right, #9333EA, #EC4899)`
- Cards: Glassmorphism with backdrop blur

## 🔐 Authentication

### Login Credentials

**Admin**
```
Email: admin@millancefurniture.com
Password: millance
URL: /admin
```

**Franchise**
```
Email: franchise@millancefurniture.com
Password: millance
URL: /franchise
```

**User**
```
Email/Phone/MLD ID: [user specific]
Password: [user specific]
URL: /login
```

## 🌐 Deployment

### Frontend Deployment
```bash
# Build
npm run build

# Deploy dist folder to:
# /var/www/rewards/frontend/
```

### Backend API
- Location: `/var/www/rewards/backend/`
- Port: 8002
- Nginx reverse proxy configured

### Domain
- Production: https://millancefurniture.com
- API: https://millancefurniture.com/api

## 📱 Responsive Design

- **Mobile First**: Designed for 320px+ screens
- **Touch Friendly**: Minimum 48px button heights
- **Flexible Sizing**: Uses `clamp()` for all sizing
- **Breakpoints**:
  - Mobile: 320px - 768px
  - Tablet: 769px - 1024px
  - Desktop: 1025px+

## 🎯 Key Features Implemented

### Recent Updates (Latest)
1. ✅ Admin Panel V2 - Complete 10-tab system
2. ✅ Admin Franchise Details page
3. ✅ All tabs with search, pagination (20 per page)
4. ✅ Create modals with 2-step confirmation
5. ✅ Toast notifications system
6. ✅ Srimathi login UI for all roles
7. ✅ Error handling across all pages
8. ✅ Loading states for better UX

### Franchise Panel
1. ✅ Group Details page with all members
2. ✅ Winners by month display
3. ✅ Payment tracking timeline
4. ✅ Search and filter functionality
5. ✅ Referral system with QR codes

### User Panel
1. ✅ Countdown timer (auto next month)
2. ✅ Profile photo upload
3. ✅ Dual wallet system
4. ✅ Cashfree payment integration
5. ✅ Scroll to top on navigation

## 🐛 Known Issues

None currently. All major bugs fixed.

## 📞 Support

For issues or questions:
- **Domain**: millancefurniture.com
- **GitHub**: https://github.com/Hari-Ragavendar-S/millance-furntitures

## 📄 License

Proprietary - Millance Furniture

## 👥 Credits

- **Design System**: Srimathi Colors & UI/UX
- **Development**: Techneysoft Team
- **Client**: Millance Furniture

---

**Last Updated**: January 2025
**Version**: 2.0.0
**Status**: Production Ready ✅
