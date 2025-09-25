import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

// Mock users data
export const mockUsers = [
  {
    id: 1,
    email: "admin@chicboutique.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "ChicBoutique", 
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    phone: "01 23 45 67 89",
    address: "123 Rue de la Mode, 75001 Paris",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    email: "marie@email.com",
    password: "marie123",
    firstName: "Marie",
    lastName: "Dupont",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    phone: "06 12 34 56 78",
    address: "456 Avenue des Champs, 75008 Paris",
    joinDate: "2024-03-20"
  },
  {
    id: 3,
    email: "sophie@email.com", 
    password: "sophie123",
    firstName: "Sophie",
    lastName: "Martin",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    phone: "07 98 76 54 32",
    address: "789 Boulevard Saint-Germain, 75007 Paris",
    joinDate: "2024-06-10"
  }
];

export const mockOrders = [
  {
    id: "CMD001",
    userId: 2,
    date: "2024-07-15",
    status: "delivered",
    total: 159.98,
    items: [
      { productId: "1", name: "Sac à Main Élégant Noir", quantity: 1, price: 89.99 },
      { productId: "5", name: "Escarpins Classiques Noirs", quantity: 1, price: 79.99 }
    ],
    address: "456 Avenue des Champs, 75008 Paris"
  },
  {
    id: "CMD002",
    userId: 2,
    date: "2024-07-10",
    status: "processing",
    total: 65.99,
    items: [
      { productId: "2", name: "Sac Bandoulière Rose", quantity: 1, price: 65.99 }
    ],
    address: "456 Avenue des Champs, 75008 Paris"
  },
  {
    id: "CMD003",
    userId: 3,
    date: "2024-07-18",
    status: "shipped", 
    total: 135.98,
    items: [
      { productId: "6", name: "Baskets Blanches Tendance", quantity: 1, price: 69.99 },
      { productId: "2", name: "Sac Bandoulière Rose", quantity: 1, price: 65.99 }
    ],
    address: "789 Boulevard Saint-Germain, 75007 Paris"
  }
];

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chicboutique_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN', payload: { user } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('chicboutique_user', JSON.stringify(userWithoutPassword));
      dispatch({ type: 'LOGIN', payload: { user: userWithoutPassword } });
      return { success: true };
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: 'Un compte avec cet email existe déjà' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('chicboutique_user', JSON.stringify(userWithoutPassword));
    dispatch({ type: 'LOGIN', payload: { user: userWithoutPassword } });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('chicboutique_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem('chicboutique_user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  const getUserOrders = (userId) => {
    return mockOrders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return mockOrders;
  };

  const getAllUsers = () => {
    return mockUsers.map(({ password, ...user }) => user);
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