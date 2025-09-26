import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '../components/Toast';

const FavoritesContext = createContext();

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.items.some(item => item.id === action.payload.id)) {
        return state; // Already exists
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    case 'LOAD_FAVORITES':
      return {
        ...state,
        items: action.payload
      };

    case 'CLEAR_FAVORITES':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] });
  const { addToast } = useToast();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('fashionFavorites');
    if (savedFavorites) {
      dispatch({ type: 'LOAD_FAVORITES', payload: JSON.parse(savedFavorites) });
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fashionFavorites', JSON.stringify(state.items));
  }, [state.items]);

  const addToFavorites = (product) => {
    const isAlreadyFavorite = state.items.some(item => item.id === product.id);
    
    if (isAlreadyFavorite) {
      addToast('Déjà dans vos favoris !', 'error');
      return;
    }

    dispatch({
      type: 'ADD_FAVORITE',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      }
    });

    addToast('Ajouté aux favoris !', 'success');
  };

  const removeFromFavorites = (productId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { id: productId } });
    addToast('Retiré des favoris', 'success');
  };

  const toggleFavorite = (product) => {
    const isAlreadyFavorite = state.items.some(item => item.id === product.id);
    
    if (isAlreadyFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
    addToast('Favoris vidés', 'success');
  };

  const getFavoritesCount = () => {
    return state.items.length;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites: state.items,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      getFavoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};