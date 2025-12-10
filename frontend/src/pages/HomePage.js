import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader, Filter, Grid, ArrowRight, Star, Heart } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [sortBy, setSortBy] = useState('featured');
  const navigate = useNavigate();

  // Categories definition with proper mapping
  const categories = [
    { id: 'tous', name: 'Tous nos Produits', slug: 'tous' },
    { id: 'sacs', name: 'Sacs', slug: 'sacs', count: 0 },
    { id: 'chaussures', name: 'Chaussures', slug: 'chaussures', count: 0 },
    { id: 'chaines', name: 'Chaînes', slug: 'chaines', count: 0 }
  ];

  // Count products per category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: cat.id === 'tous' 
      ? products.length 
      : products.filter(product => {
          if (cat.id === 'sacs') return product.category?.includes('sac') || product.category === 'sacs-a-main';
          if (cat.id === 'chaussures') return product.category?.includes('chaussures');
          if (cat.id === 'chaines') return product.category?.includes('chaine') || product.category === 'bijoux';
          return false;
        }).length
  }));

  // Filter products by category
  const filteredProducts = selectedCategory === 'tous' 
    ? products 
    : products.filter(product => {
        if (selectedCategory === 'sacs') return product.category?.includes('sac') || product.category === 'sacs-a-main';
        if (selectedCategory === 'chaussures') return product.category?.includes('chaussures');
        if (selectedCategory === 'chaines') return product.category?.includes('chaine') || product.category === 'bijoux';
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

  // Group products by category for display
  const productsByCategory = {
    sacs: products.filter(p => p.category?.includes('sac') || p.category === 'sacs-a-main').slice(0, 8),
    chaussures: products.filter(p => p.category?.includes('chaussures')).slice(0, 8),
    chaines: products.filter(p => p.category?.includes('chaine') || p.category === 'bijoux').slice(0, 4)
  };

  // Handle category filter on homepage
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to products section smoothly
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle navigation to category pages
  const handleCategoryNavigation = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
    window.scrollTo(0, 0);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-primary-600 font-medium">Chargement des collections...</p>
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
      <Hero />

      {/* Categories Navigation Section - Michael Kors Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-primary-900 tracking-wide mb-4">
              NOS COLLECTIONS
            </h2>
            <div className="w-24 h-px bg-accent-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Sacs Category */}
            <div className="group cursor-pointer" onClick={() => navigate('/category/sacs')}>
              <div className="relative overflow-hidden bg-gray-100 aspect-square mb-6">
                <img
                  src="https://images.unsplash.com/photo-1544966503-7cc5ac882d9e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnfGVufDB8fHx8MTc1ODg3OTYyMHww&ixlib=rb-4.1.0&q=85"
                  alt="Collection Sacs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/10 transition-colors duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-light text-white mb-2">SACS</h3>
                  <p className="text-white/90 text-sm mb-4">Maroquinerie d'exception</p>
                  <div className="inline-flex items-center text-white text-sm font-medium">
                    Découvrir <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chaussures Category */}
            <div className="group cursor-pointer" onClick={() => navigate('/category/chaussures')}>
              <div className="relative overflow-hidden bg-gray-100 aspect-square mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvZXN8ZW58MHx8fHwxNzU4ODc5NjI1fDA&ixlib=rb-4.1.0&q=85"
                  alt="Collection Chaussures"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/10 transition-colors duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-light text-white mb-2">CHAUSSURES</h3>
                  <p className="text-white/90 text-sm mb-4">Élégance à chaque pas</p>
                  <div className="inline-flex items-center text-white text-sm font-medium">
                    Découvrir <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chaînes Category */}
            <div className="group cursor-pointer" onClick={() => navigate('/category/chaine')}>
              <div className="relative overflow-hidden bg-gray-100 aspect-square mb-6">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw1fHxqZXdlbHJ5fGVufDB8fHx8MTc1ODg3OTYyNXww&ixlib=rb-4.1.0&q=85"
                  alt="Collection Chaînes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-primary-900/10 transition-colors duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-light text-white mb-2">CHAÎNES</h3>
                  <p className="text-white/90 text-sm mb-4">Bijoux précieux</p>
                  <div className="inline-flex items-center text-white text-sm font-medium">
                    Découvrir <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products by Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Enhanced Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h2 className="text-3xl font-light text-primary-900 tracking-wide mb-2">
                  TOUS NOS PRODUITS
                </h2>
                <p className="text-primary-600">Découvrez notre sélection complète</p>
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

                <Button
                  onClick={() => handleCategoryFilter('tous')}
                  variant={selectedCategory === 'tous' ? 'primary' : 'outline'}
                  className="uppercase tracking-wide"
                >
                  <Grid className="mr-2 h-4 w-4" />
                  Voir Tout ({products.length})
                </Button>
              </div>
            </div>

            {/* Enhanced Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categoriesWithCount.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-6 py-3 border-2 text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:shadow-card ${
                    selectedCategory === category.id
                      ? 'border-primary-900 bg-primary-900 text-white'
                      : 'border-gray-300 text-primary-700 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Products Section with ID for scrolling */}
          <div id="products-section">

          {/* Products Grid */}
          {selectedCategory === 'tous' ? (
            // Display by Categories
            <div className="space-y-16">
              {/* Sacs Section */}
              {productsByCategory.sacs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-light text-primary-900 tracking-wide">SACS</h3>
                    <Link 
                      to="/category/sacs"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 font-medium uppercase tracking-wide transition-colors duration-200"
                    >
                      Voir Tout <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productsByCategory.sacs.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Chaussures Section */}
              {productsByCategory.chaussures.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-light text-primary-900 tracking-wide">CHAUSSURES</h3>
                    <Link 
                      to="/category/chaussures"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 font-medium uppercase tracking-wide transition-colors duration-200"
                    >
                      Voir Tout <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productsByCategory.chaussures.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Chaînes Section */}
              {productsByCategory.chaines.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-light text-primary-900 tracking-wide">CHAÎNES</h3>
                    <Link 
                      to="/category/chaine"
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 font-medium uppercase tracking-wide transition-colors duration-200"
                    >
                      Voir Tout <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productsByCategory.chaines.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Filtered Products Display
            <div>
              <div className="mb-8">
                <p className="text-sm text-primary-600">
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section - Michael Kors Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-primary-900 mb-2">500+</div>
              <div className="text-sm text-primary-600 uppercase tracking-wide">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-primary-900 mb-2">10K+</div>
              <div className="text-sm text-primary-600 uppercase tracking-wide">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-primary-900 mb-2">4.8</div>
              <div className="text-sm text-primary-600 uppercase tracking-wide flex items-center justify-center">
                <Star className="h-3 w-3 mr-1 fill-current text-accent-500" />
                Avis
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-primary-900 mb-2">24H</div>
              <div className="text-sm text-primary-600 uppercase tracking-wide">Livraison</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;