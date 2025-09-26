import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '../components/Toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
        item.selectedColor === action.payload.selectedColor &&
        item.selectedSize === action.payload.selectedSize
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id &&
            item.selectedColor === action.payload.selectedColor &&
            item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartId: Date.now() }]
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload.cartId)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { addToast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fashionCart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fashionCart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedColor,
        selectedSize,
        quantity
      }
    });

    // Show toast notification
    addToast('Produit ajouté au panier !', 'cart', {
      name: product.name,
      image: product.image,
      selectedColor,
      selectedSize
    });
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartId } });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};