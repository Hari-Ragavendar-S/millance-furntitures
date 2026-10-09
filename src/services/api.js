// API Service for Millance Rewards
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://millancefurniture.com/api';

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Server returned HTML or plain text (likely an error page)
        const text = await response.text();
        console.error('❌ Server returned non-JSON response:', text.substring(0, 500));
        console.error('📍 Failed endpoint:', endpoint);
        console.error('📍 Status code:', response.status);
        
        // If it's /users/me that's failing, we can still continue for other operations
        if (endpoint === '/users/me') {
          console.warn('⚠️ /users/me endpoint failed - backend needs to be updated');
          throw new Error('User profile endpoint error. Please contact admin to update backend.');
        }
        
        throw new Error(`Server error (${response.status}). Backend may need updates.`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error Response:', data);
        console.error('📍 Endpoint:', endpoint);
        console.error('📍 Status:', response.status);
        console.error('📍 Detail:', data.detail);
        
        // If detail is an array, log each error
        if (Array.isArray(data.detail)) {
          console.error('📍 Validation Errors:');
          data.detail.forEach((err, idx) => {
            console.error(`  ${idx + 1}.`, err);
          });
        }
        
        throw new Error(data.detail || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(identifier, password, role = 'user') {
    console.log('🔐 API Login Request:', { identifier, role, passwordLength: password?.length });
    const requestBody = { identifier, password, role };
    console.log('📦 Request Body:', JSON.stringify(requestBody));
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    console.log('✅ API Login Response:', { role: data.role, user: data.user_data });
    this.setToken(data.access_token);
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateProfile(profileData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getWallet() {
    return this.request('/users/wallet');
  }

  async depositToWallet(walletType, amount) {
    return this.request('/users/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ wallet_type: walletType, amount }),
    });
  }

  async getTransactions() {
    return this.request('/users/transactions');
  }

  // Plan endpoints
  async getAllPlans() {
    return this.request('/plans');
  }

  async getPlanDetails(planId) {
    return this.request(`/plans/${planId}`);
  }

  // Group endpoints
  async getGroupDetails(groupId) {
    return this.request(`/groups/${groupId}`);
  }

  async getGroupsByPlan(planId) {
    return this.request(`/plans/${planId}/groups`);
  }

  // Enrollment endpoints
  async enrollInPlan(planId, groupId, walletType) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId, group_id: groupId, wallet_type: walletType }),
    });
  }

  async getMyEnrollments() {
    return this.request('/enrollments/my');
  }

  async payMonth(enrollmentId, paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        month: paymentData.month,
        wallet_type: paymentData.wallet_type
      })
    });
  }

  // Payment endpoints
  async makePayment(enrollmentId, walletType, month) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify({ enrollment_id: enrollmentId, wallet_type: walletType, month }),
    });
  }

  async getMyPayments() {
    return this.request('/payments/my');
  }

  // Franchise endpoints
  async createPrizePool(prizePoolData) {
    return this.request('/franchise/prize-pools', {
      method: 'POST',
      body: JSON.stringify(prizePoolData),
    });
  }

  async getFranchisePrizePools() {
    return this.request('/franchise/prize-pools');
  }

  async createPlan(planData) {
    return this.request('/franchise/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async getFranchisePlans() {
    return this.request('/franchise/plans');
  }

  async createGroup(groupData) {
    return this.request('/franchise/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async getFranchiseGroups() {
    return this.request('/franchise/groups');
  }

  async getFranchiseStats() {
    return this.request('/franchise/stats');
  }

  async getFranchiseEnrollments() {
    return this.request('/franchise/enrollments');
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers(skip = 0, limit = 100) {
    return this.request(`/admin/users?skip=${skip}&limit=${limit}`);
  }

  async getAllFranchises() {
    return this.request('/admin/franchises');
  }

  async createFranchise(franchiseData) {
    return this.request('/admin/franchises', {
      method: 'POST',
      body: JSON.stringify(franchiseData),
    });
  }

  async updateUserStatus(userId, isActive) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async updateFranchiseStatus(franchiseId, isActive) {
    return this.request(`/admin/franchises/${franchiseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  async getAllEnrollments(skip = 0, limit = 100) {
    return this.request(`/admin/enrollments?skip=${skip}&limit=${limit}`);
  }

  async getAllPayments(skip = 0, limit = 100) {
    return this.request(`/admin/payments?skip=${skip}&limit=${limit}`);
  }

  async getRevenueReport() {
    return this.request('/admin/revenue-report');
  }

  // Admin Franchise Operations
  async getAdminPrizePools() {
    return this.request('/admin/prize-pools');
  }

  async createAdminPrizePool(prizePoolData) {
    return this.request('/admin/prize-pools', {
      method: 'POST',
      body: JSON.stringify(prizePoolData),
    });
  }

  async getAdminPlans() {
    return this.request('/admin/plans');
  }

  async createAdminPlan(planData) {
    return this.request('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async getAdminGroups() {
    return this.request('/admin/groups');
  }

  async createAdminGroup(groupData) {
    return this.request('/admin/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  // Draw Management endpoints (Franchise)
  async scheduleDrawForGroup(drawData) {
    return this.request('/franchise/draws/schedule', {
      method: 'POST',
      body: JSON.stringify(drawData),
    });
  }

  async getScheduledDraws() {
    return this.request('/franchise/draws/scheduled');
  }

  async conductDraw(drawId) {
    return this.request(`/franchise/draws/${drawId}/conduct`, {
      method: 'POST',
    });
  }

  async getDrawHistory() {
    return this.request('/franchise/draws/history');
  }

  // User Draw & Redemption endpoints
  async getUserDrawStatus() {
    return this.request('/users/draws/status');
  }

  async getDrawLiveStatus(groupId) {
    return this.request(`/users/draws/live-status?group_id=${groupId}`);
  }

  async getUserRedemptions() {
    return this.request('/users/redemptions');
  }

  // PIN Management
  async setPIN(mldId, pin) {
    return this.request('/users/pin/set-public', {
      method: 'POST',
      body: JSON.stringify({ mld_id: mldId, pin }),
    });
  }

  async setPINAuthenticated(pin) {
    return this.request('/users/pin/set', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  async changePIN(newPin) {
    return this.request('/users/pin/change', {
      method: 'POST',
      body: JSON.stringify({ new_pin: newPin }),
    });
  }

  async verifyPIN(mldId, pin) {
    return this.request('/users/pin/verify', {
      method: 'POST',
      body: JSON.stringify({ mld_id: mldId, pin }),
    });
  }

  async verifyPINAuthenticated(pin) {
    return this.request('/users/pin/verify-auth', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  async getPINStatus() {
    return this.request('/users/pin/status');
  }

  async getWalletBalance() {
    return this.request('/users/wallet');
  }

  // Wallet Payment
  async walletPayment(mldId, amount, pin, walletType) {
    return this.request('/users/wallet/pay', {
      method: 'POST',
      body: JSON.stringify({
        mld_id: mldId,
        amount: parseFloat(amount),
        pin,
        wallet_type: walletType,
      }),
    });
  }

  async walletPaymentAuthenticated(amount, pin, walletType) {
    return this.request('/users/wallet/pay-auth', {
      method: 'POST',
      body: JSON.stringify({
        amount: parseFloat(amount),
        pin,
        wallet_type: walletType,
      }),
    });
  }

  // Password Change
  async changePassword(newPassword) {
    return this.request('/users/password/change', {
      method: 'POST',
      body: JSON.stringify({ new_password: newPassword }),
    });
  }

  // Transactions with filter
  async getTransactions(filter = 'all') {
    const params = filter && filter !== 'all' ? `?transaction_type=${filter}` : '';
    return this.request(`/users/transactions${params}`);
  }

  async redeemSavings(enrollmentId, amount) {
    return this.request('/users/redeem-savings', {
      method: 'POST',
      body: JSON.stringify({ enrollment_id: enrollmentId, amount }),
    });
  }

  // Referral System
  async validateInviteLink(franchiseSlug, inviteCode) {
    return this.request(`/invite/${franchiseSlug}/${inviteCode}`);
  }

  async registerWithInvite(userData) {
    return this.request('/auth/register-with-invite', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getFranchiseReferrals(page = 1, limit = 20) {
    return this.request(`/franchise/referrals?page=${page}&limit=${limit}`);
  }

  async getReferralUserDetails(userId) {
    return this.request(`/franchise/referrals/${userId}`);
  }

  async getFranchiseEarnings() {
    return this.request('/franchise/earnings');
  }

  // ============== CASHFREE PAYMENT ENDPOINTS ==============
  
  /**
   * Create a new payment order
   * @param {number} amount - Amount in INR (min: 1, max: 10000)
   * @returns {Promise} Payment order details with session ID
   */
  async createPaymentOrder(amount) {
    return this.request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });
  }

  /**
   * Verify payment status after user completes payment
   * @param {string} orderId - Order ID from our system
   * @returns {Promise} Verification result with wallet credit status
   */
  async verifyPayment(orderId) {
    return this.request('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  /**
   * Get user's payment history (wallet recharges)
   * @returns {Promise} List of Cashfree payments
   */
  async getPaymentHistory() {
    return this.request('/payments/history');
  }

  /**
   * Get specific payment details
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  async getPaymentDetails(paymentId) {
    return this.request(`/payments/${paymentId}`);
  }
}

const apiService = new APIService();

export default apiService;

// Named exports for convenience
export const { 
  validateInviteLink, 
  registerWithInvite,
  getFranchiseReferrals,
  getReferralUserDetails,
  getFranchiseEarnings
} = apiService;
