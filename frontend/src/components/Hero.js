import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px] py-12 lg:py-20">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Nouvelle Collection Automne</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Style &{' '}
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Élégance
              </span>
              <br />
              Pour Toutes
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Découvrez notre collection exclusive de sacs à main et chaussures 
              pour femmes et enfants. Qualité premium, style contemporain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/category/sacs-a-main"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/category/chaussures-femmes"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-pink-200 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-300"
              >
                Voir les Chaussures
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-sm text-gray-600">Clientes Satisfaites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Note Moyenne</div>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1608060434411-0c3fa9049e7b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxoYW5kYmFnc3xlbnwwfHx8fDE3NTI5NTIzODl8MA&ixlib=rb-4.1.0&q=85"
                alt="Collection de sacs élégants"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 -right-4 w-72 h-72 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white p-4 rounded-lg shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <div className="text-sm font-semibold text-gray-900">Livraison Gratuite</div>
              <div className="text-xs text-gray-600">Dès 50€ d'achat</div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
              <div className="text-sm font-semibold text-gray-900">Retour 30J</div>
              <div className="text-xs text-gray-600">Satisfait ou remboursé</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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