import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS, migrateOldStorageKeys } from '../constants/storage';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Load user from localStorage and verify with backend on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Migrate old storage keys to new ones
      migrateOldStorageKeys();
      
      const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      
      if (savedToken && savedUser) {
        try {
          // Verify token with backend
          const response = await authAPI.getProfile();
          dispatch({ type: 'LOGIN', payload: { user: response.data } });
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('chicboutique_token', access_token);
      localStorage.setItem('chicboutique_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN', payload: { user } });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur de connexion' 
      };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await authAPI.register(userData);
      const { access_token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('chicboutique_token', access_token);
      localStorage.setItem('chicboutique_user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN', payload: { user } });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur lors de l\'inscription' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = response.data;
      
      localStorage.setItem('chicboutique_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Erreur lors de la mise à jour' 
      };
    }
  };

  const getUserOrders = async (userId) => {
    try {
      // Import ordersAPI
      const { ordersAPI } = await import('../services/api');
      
      // Fetch real orders from backend
      const response = await ordersAPI.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  };

  const getAllOrders = async () => {
    // This will be moved to admin context
    return [];
  };

  const getAllUsers = async () => {
    // This will be moved to admin context
    return [];
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login,
      register,
      logout,
      updateProfile,
      getUserOrders,
      getAllOrders,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};