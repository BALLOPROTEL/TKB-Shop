import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default options
    const defaultColor = product.colors[0];
    const defaultSize = product.sizes[0];
    
    addToCart(product, defaultColor, defaultSize, 1);
  };

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
              Rupture de stock
            </div>
          )}

          {/* Quick Actions - Desktop only */}
          <div className="hidden sm:flex absolute top-2 sm:top-3 right-2 sm:right-3 flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-orange-50 transition-all duration-200 hover:scale-110 hover:shadow-orange"
            >
              <Heart 
                className={`h-4 w-4 transition-colors duration-200 ${
                  isFavorite(product.id) 
                    ? 'text-orange-500 fill-current' 
                    : 'text-gray-600 hover:text-orange-500'
                }`} 
              />
            </button>
          </div>

          {/* Quick Add Button - Desktop only */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="hidden sm:flex absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:from-orange-600 hover:to-orange-700 items-center justify-center space-x-2 text-sm shadow-orange"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Ajout rapide</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category.replace('-', ' ')}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 text-sm sm:text-base line-clamp-2 flex-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {product.price.toFixed(2)}€
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>

          {/* Colors Preview */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Couleurs:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-200 shadow-sm"
                  style={{ 
                    backgroundColor: color === 'Noir' ? '#000' : 
                                   color === 'Blanc' ? '#fff' :
                                   color === 'Rose' ? '#f472b6' :
                                   color === 'Marron' ? '#8b4513' :
                                   color === 'Beige' ? '#f5f5dc' :
                                   color === 'Rouge' ? '#ef4444' :
                                   color === 'Nude' ? '#d2b48c' :
                                   color === 'Doré' ? '#ffd700' :
                                   '#gray'
                  }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>

          {/* Mobile Quick Add */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="sm:hidden w-full mt-3 bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Ajouter au panier</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;