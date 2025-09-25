import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

const HomePage = () => {
  const { products, categories, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products by category
  const filteredProducts = selectedCategory === 'tous' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Get featured products (highest rated)
  const featuredProducts = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nos Catégories
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez notre large gamme de produits sélectionnés avec soin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.slice(1).map((category, index) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 aspect-[4/3] sm:aspect-auto"
              >
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-6 sm:p-8 flex items-center justify-center h-full min-h-[200px] sm:min-h-[240px]">
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {index === 0 ? 'Élégance et praticité' : 
                       index === 1 ? 'Confort et style' : 
                       'Couleur et amusement'}
                    </p>
                    <div className="inline-flex items-center text-pink-600 font-medium text-sm sm:text-base">
                      Découvrir
                      <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Produits Vedettes
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Nos coups de cœur sélectionnés pour vous
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/category/tous"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base"
              >
                Voir Tous les Produits
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Tous nos Produits
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="featured">Recommandés</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <Loader className="animate-spin h-8 w-8 text-pink-500 mx-auto mb-2" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          )}

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {sortedProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg">
                {selectedCategory === 'tous' 
                  ? 'Aucun produit disponible pour le moment.' 
                  : 'Aucun produit trouvé dans cette catégorie.'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;