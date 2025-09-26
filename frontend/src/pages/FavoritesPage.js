import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const defaultColor = 'Noir'; // Default color
    const defaultSize = 'Moyen'; // Default size
    addToCart(product, defaultColor, defaultSize, 1);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vos Favoris</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Vous n'avez pas encore ajouté de produits à vos favoris. 
              Explorez notre collection et ajoutez vos coups de cœur !
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-pink-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Mes Favoris ({favorites.length})
            </h1>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Vider les favoris</span>
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg group">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                
                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {product.category.replace('-', ' ')}
                </p>

                {/* Title */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors duration-200 text-sm line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price.toFixed(2)}€
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 text-sm"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;