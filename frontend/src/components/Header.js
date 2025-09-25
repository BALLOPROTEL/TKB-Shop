import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mock';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems } = useCart();
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
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMenus}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              ChicBoutique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {categories.map(category => (
              <Link
                key={category.id}
                to={category.id === 'tous' ? '/' : `/category/${category.slug}`}
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 text-sm xl:text-base"
              >
                {category.name}
              </Link>
            ))}
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
            <button className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Cart */}
            <Link 
              to="/cart"
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
                  {categories.map(category => (
                    <Link
                      key={category.id}
                      to={category.id === 'tous' ? '/' : `/category/${category.slug}`}
                      className="block py-3 px-2 text-lg text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200 border-b border-gray-100"
                      onClick={closeMenus}
                    >
                      {category.name}
                    </Link>
                  ))}
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