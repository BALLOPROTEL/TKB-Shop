import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

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
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-full">
              Rupture de stock
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
            </button>
          </div>

          {/* Quick Add Button */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 left-3 right-3 bg-pink-600 text-white py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-pink-700 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Ajout rapide</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category.replace('-', ' ')}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2)}€
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>

          {/* Colors Preview */}
          <div className="flex items-center space-x-1 mt-3">
            <span className="text-xs text-gray-500">Couleurs:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
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
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;