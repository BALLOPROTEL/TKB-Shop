import React, { createContext, useContext, useState } from 'react';
import { adminAPI } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors du chargement des statistiques');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Users management
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUsers(params);
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await adminAPI.createUser(userData);
      setUsers(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const response = await adminAPI.updateUser(id, updates);
      setUsers(prev => prev.map(u => u.id === id ? response.data : u));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Orders management
  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getOrders(params);
      setOrders(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors du chargement des commandes');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (error) {
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await adminAPI.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    // Stats
    stats,
    fetchStats,
    
    // Users
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Orders
    orders,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    
    // General
    loading,
    error
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};