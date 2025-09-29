import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User, LogIn, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mock';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSacsMenu, setShowSacsMenu] = useState(false);
  const [showChaussuresMenu, setShowChaussuresMenu] = useState(false);
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
    setShowSacsMenu(false);
    setShowChaussuresMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMenus}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg shadow-orange transition-all duration-300 hover:shadow-orange-lg">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                TKB'Shop
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">Tanou Karidja Ballo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 text-sm xl:text-base relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Accueil
            </Link>

            {/* Sacs Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => setShowSacsMenu(true)}
              onMouseLeave={() => setShowSacsMenu(false)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200 text-sm xl:text-base relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full">
                <span>Sacs</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              {showSacsMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{ opacity: 1 }}
                     onMouseEnter={() => setShowSacsMenu(true)}
                     onMouseLeave={() => setShowSacsMenu(false)}
                >
                  <div className="py-2">
                    {categories.find(cat => cat.id === 'sacs')?.subcategories.map(sub => (
                      <Link
                        key={sub.id}
                        to={`/category/sacs/${sub.slug}`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                        onClick={closeMenus}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chaussures Menu */}
            <div 
              className="relative group"
              onMouseEnter={() => setShowChaussuresMenu(true)}
              onMouseLeave={() => setShowChaussuresMenu(false)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 text-sm xl:text-base">
                <span>Chaussures</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showChaussuresMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                     style={{ opacity: 1 }}
                     onMouseEnter={() => setShowChaussuresMenu(true)}
                     onMouseLeave={() => setShowChaussuresMenu(false)}
                >
                  <div className="py-2">
                    {categories.find(cat => cat.id === 'chaussures')?.subcategories.map(sub => (
                      <Link
                        key={sub.id}
                        to={`/category/chaussures/${sub.slug}`}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-200"
                        onClick={closeMenus}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-md mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
            {/* Wishlist */}
            <Link 
              to="/favorites"
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              {getFavoritesCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-medium">
                  {getFavoritesCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart"
              onClick={() => window.scrollTo(0, 0)}
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 lg:p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.firstName}
                    className="h-7 w-7 lg:h-8 lg:w-8 rounded-full object-cover"
                  />
                  <span className="hidden lg:inline font-medium text-sm">{user?.firstName}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Mon profil
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-3" />
                            Dashboard Admin
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogIn className="h-4 w-4 mr-3" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-3 lg:px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center space-x-2">
            {/* Mobile Cart */}
            <Link 
              to="/cart"
              onClick={() => window.scrollTo(0, 0)}
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <ShoppingBag className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.firstName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Mon profil
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingBag className="h-4 w-4 mr-3" />
                            Dashboard Admin
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogIn className="h-4 w-4 mr-3" />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={closeMenus}
            />
            <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-t shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-4 py-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6 relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-4">
                  <Link
                    to="/"
                    className="block py-3 px-2 text-lg text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 border-b border-gray-100"
                    onClick={closeMenus}
                  >
                    Accueil
                  </Link>

                  {/* Mobile Sacs Menu */}
                  <div>
                    <div className="py-3 px-2 text-lg text-gray-700 font-medium border-b border-gray-100">
                      Sacs
                    </div>
                    <div className="pl-4 space-y-2 mt-2">
                      {categories.find(cat => cat.id === 'sacs')?.subcategories.map(sub => (
                        <Link
                          key={sub.id}
                          to={`/category/sacs/${sub.slug}`}
                          className="block py-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                          onClick={closeMenus}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Chaussures Menu */}
                  <div>
                    <div className="py-3 px-2 text-lg text-gray-700 font-medium border-b border-gray-100">
                      Chaussures
                    </div>
                    <div className="pl-4 space-y-2 mt-2">
                      {categories.find(cat => cat.id === 'chaussures')?.subcategories.map(sub => (
                        <Link
                          key={sub.id}
                          to={`/category/chaussures/${sub.slug}`}
                          className="block py-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
                          onClick={closeMenus}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* Mobile Auth Links */}
                {!isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <Link
                      to="/login"
                      className="block w-full py-3 px-4 text-center text-pink-600 hover:text-pink-700 font-semibold border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors duration-200"
                      onClick={closeMenus}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full py-3 px-4 text-center bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 font-semibold"
                      onClick={closeMenus}
                    >
                      Inscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;