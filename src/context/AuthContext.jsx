import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check if user is already logged in on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user_data');
      
      if (token && savedRole && savedUser) {
        // User is logged in - restore state
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(savedRole);
        setIsAuthenticated(true);
        
        // For users only, fetch fresh wallet data in background
        if (savedRole === 'user') {
          fetchFreshUserData();
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreshUserData = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch fresh user data:', error);
      // Don't logout - keep using cached data
    }
  };

  const login = async (identifier, password, userRole = 'user') => {
    try {
      const response = await api.login(identifier, password, userRole);
      const userData = response.user_data;
      const userRoleResponse = response.role;
      
      // Save to state
      setUser(userData);
      setRole(userRoleResponse);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('role', userRoleResponse);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Clear API token
    api.clearToken();
    
    // Clear localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('user_data');
    
    // Clear state
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      const newUser = await api.register(userData);
      // After registration, login automatically
      const loginResult = await login(userData.email, userData.password, 'user');
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const savedRole = localStorage.getItem('role');
      
      if (savedRole === 'user') {
        // Only fetch for user role
        const userData = await api.getCurrentUser();
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        // For admin/franchise, just reload from localStorage
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't logout on error
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      role,
      login, 
      logout, 
      register,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
