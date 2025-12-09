import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Grid, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import Button from '../components/ui/Button';

const CategoryPage = () => {
  const { slug, subcategory } = useParams();
  const { products, loading, error } = useProducts();
  const [sortBy, setSortBy] = useState('featured');

  // Category mapping
  const categoryMap = {
    'sacs': { name: 'Sacs', filterKey: 'sacs' },
    'chaussures': { name: 'Chaussures', filterKey: 'chaussures' },
    'chaine': { name: 'Chaînes', filterKey: 'chaines' }
  };

  const categoryInfo = categoryMap[slug] || { name: slug, filterKey: slug };

  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (categoryInfo.filterKey === 'sacs') {
      return product.category?.includes('sac') || product.category === 'sacs-a-main';
    }
    if (categoryInfo.filterKey === 'chaussures') {
      return product.category?.includes('chaussures');
    }
    if (categoryInfo.filterKey === 'chaines') {
      return product.category?.includes('chaine') || product.category === 'bijoux';
    }
    return false;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 4.5) - (a.rating || 4.5);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-primary-600 font-medium">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <p className="text-primary-800 mb-4">Erreur lors du chargement des produits</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <h1 className="text-4xl font-light text-primary-900 tracking-wide mb-4">
            {categoryInfo.name.toUpperCase()}
          </h1>
          <div className="w-24 h-px bg-accent-500"></div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              <p className="text-primary-600">
                {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 bg-white text-primary-700 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              >
                <option value="featured">Recommandés</option>
                <option value="name">Nom A-Z</option>
                <option value="price-low">Prix Croissant</option>
                <option value="price-high">Prix Décroissant</option>
                <option value="rating">Mieux Notés</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-primary-600 mb-2">Aucun produit trouvé</p>
              <p className="text-sm text-primary-400 mb-6">
                Nous n'avons pas trouvé de produits dans cette catégorie
              </p>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
