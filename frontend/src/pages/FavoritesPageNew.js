import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const defaultColor = 'Noir';
    const defaultSize = 'Moyen';
    addToCart(product, defaultColor, defaultSize, 1);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-24 w-24 text-primary-300 mx-auto mb-8" />
            <h1 className="text-3xl font-light text-primary-900 mb-4 tracking-wide">
              LISTE DE SOUHAITS
            </h1>
            <p className="text-primary-600 mb-8 leading-relaxed">
              Sauvegardez vos créations préférées pour ne jamais les perdre de vue
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              variant="primary"
              size="lg"
              className="inline-flex items-center uppercase tracking-wider"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Découvrir nos Créations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-primary-600 hover:text-primary-800 uppercase tracking-wide">
                Accueil
              </Link>
            </li>
            <li className="text-primary-400">/</li>
            <li className="text-primary-800 font-medium uppercase tracking-wide">
              Favoris ({favorites.length})
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white shadow-luxury mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <Heart className="h-8 w-8 text-primary-800" />
                <div>
                  <h1 className="text-3xl font-light text-primary-900 tracking-wide">
                    MES FAVORIS
                  </h1>
                  <p className="text-primary-600 mt-1">
                    {favorites.length} création{favorites.length > 1 ? 's' : ''} sélectionnée{favorites.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {favorites.length > 0 && (
                <div className="flex items-center space-x-4 mt-6 sm:mt-0">
                  <button
                    onClick={clearFavorites}
                    className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 text-sm uppercase tracking-wide"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vider la Liste
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white shadow-luxury overflow-hidden group hover:shadow-elegant transition-all duration-300">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                
                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFromFavorites(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white shadow-luxury opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-elegant hover:scale-110"
                  title="Retirer des favoris"
                >
                  <Heart className="h-5 w-5 text-primary-900 fill-current" />
                </button>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 left-4 right-4 bg-primary-900 text-white py-3 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-primary-800 text-sm uppercase tracking-wider"
                >
                  Ajouter au Panier
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <p className="text-xs text-primary-500 uppercase tracking-wider mb-2">
                  {product.category?.replace('-', ' ') || 'Collection'}
                </p>

                {/* Title */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-primary-900 mb-3 hover:text-primary-700 transition-colors duration-200 text-base leading-tight">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-primary-900">
                    {product.price?.toFixed(2) || '0.00'} €
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 text-sm uppercase tracking-wide"
                    size="sm"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="px-4 py-2 border border-gray-300 text-primary-700 font-medium hover:bg-gray-50 transition-colors duration-200 text-sm uppercase tracking-wide text-center"
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
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            size="lg"
            className="inline-flex items-center uppercase tracking-wider"
          >
            <ArrowLeft className="mr-3 h-4 w-4" />
            Continuer mes Découvertes
          </Button>
        </div>

        {/* Services Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white shadow-luxury">
            <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-3 uppercase tracking-wide">
              Liste Personnelle
            </h3>
            <p className="text-primary-600 leading-relaxed">
              Créez votre sélection unique de créations d'exception pour ne jamais les oublier
            </p>
          </div>
          
          <div className="text-center p-8 bg-white shadow-luxury">
            <ShoppingBag className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900 mb-3 uppercase tracking-wide">
              Ajout Rapide
            </h3>
            <p className="text-primary-600 leading-relaxed">
              Transférez facilement vos coups de cœur vers votre panier en un seul clic
            </p>
          </div>
          
          <div className="text-center p-8 bg-white shadow-luxury">
            <div className="h-12 w-12 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold">∞</span>
            </div>
            <h3 className="text-lg font-medium text-primary-900 mb-3 uppercase tracking-wide">
              Conservation Illimitée
            </h3>
            <p className="text-primary-600 leading-relaxed">
              Vos favoris sont sauvegardés définitivement dans votre espace personnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;