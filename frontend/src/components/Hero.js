import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

const Hero = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] sm:min-h-[600px] py-8 sm:py-12 lg:py-20">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 sm:px-4 py-2 rounded-full text-sm font-medium shadow-card hover:shadow-card-hover transition-all duration-300">
              <Sparkles className="h-4 w-4" />
              <span>Nouvelle Collection Automne</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Style &{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                Élégance
              </span>
              <br />
              Pour Toutes
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Découvrez notre collection exclusive de sacs à main et chaussures 
              pour femmes et enfants. Qualité premium, style contemporain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/category/sacs-a-main"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-orange-lg text-sm sm:text-base group"
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/category/chaussures-femmes"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-orange-200 text-orange-700 font-semibold rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 text-sm sm:text-base"
              >
                Voir les Chaussures
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-xs sm:text-sm text-gray-600">Clientes Satisfaites</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">4.8★</div>
                <div className="text-xs sm:text-sm text-gray-600">Note Moyenne</div>
              </div>
            </div>
          </div>
          
          {/* Dynamic Product Carousel */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10">
              <ProductCarousel />
            </div>
            
            {/* Decorative Elements - Hidden on mobile for performance */}
            <div className="hidden sm:block absolute top-4 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-orange-400 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
            
            {/* Floating Cards */}
            <div className="hidden lg:block absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-lg shadow-xl transform rotate-3 hover:rotate-6 transition-all duration-300 hover:shadow-2xl">
              <div className="text-sm font-semibold text-gray-900">Livraison Gratuite</div>
              <div className="text-xs text-gray-600">Dès 50€ d'achat</div>
            </div>
            
            <div className="hidden lg:block absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-xl transform -rotate-3 hover:-rotate-6 transition-all duration-300 hover:shadow-2xl">
              <div className="text-sm font-semibold text-gray-900">Retour 30J</div>
              <div className="text-xs text-gray-600">Satisfait ou remboursé</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Pattern - Hidden on mobile */}
      <div className="hidden lg:block absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;