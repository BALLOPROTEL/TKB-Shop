import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Image from './ui/Image';

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
    <Link to={`/product/${product.id}`} className="block">
      <div className="group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-elegant">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Wishlist Button - Top right */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
            }}
            className="absolute top-4 right-4 p-2 bg-white shadow-luxury opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-elegant"
          >
            <Heart 
              className={`h-5 w-5 transition-colors duration-200 ${
                isFavorite(product.id) 
                  ? 'text-primary-900 fill-current' 
                  : 'text-primary-600 hover:text-primary-900'
              }`} 
            />
          </button>

          {/* Quick Add Button - Desktop hover */}
          {product.inStock && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-4 left-4 right-4 bg-primary-900 text-white py-3 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-primary-800 text-sm uppercase tracking-wider"
            >
              Ajouter au panier
            </button>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-medium px-3 py-1 uppercase tracking-wider">
              Nouveau
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Title */}
          <h3 className="font-light text-primary-900 mb-2 text-lg tracking-wide">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-4">
            <span className="text-xl font-light text-primary-900">
              {product.price.toFixed(2)}€
            </span>
            {product.originalPrice && (
              <span className="text-sm text-primary-400 line-through ml-2">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>

          {/* Colors Preview */}
          <div className="flex justify-center space-x-2">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 border border-primary-200"
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
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;