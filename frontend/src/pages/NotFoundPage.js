import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-light text-primary-900 leading-none">
            404
          </h1>
          <div className="w-32 h-px bg-accent-500 mx-auto"></div>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-light text-primary-900 mb-4 tracking-wide">
          PAGE INTROUVABLE
        </h2>

        {/* Description */}
        <p className="text-lg text-primary-600 mb-12 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée. 
          Nous vous invitons à retourner à l'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="flex items-center uppercase tracking-wide">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Button>
          </Link>

          <Link to="/category/sacs">
            <Button 
              variant="outline" 
              className="flex items-center uppercase tracking-wide"
            >
              <Search className="mr-2 h-5 w-5" />
              Découvrir nos produits
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-16">
          <p className="text-sm text-primary-600 mb-4 uppercase tracking-wide">
            Pages populaires
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/category/sacs" 
              className="text-sm text-primary-700 hover:text-accent-600 transition-colors duration-200"
            >
              Sacs
            </Link>
            <Link 
              to="/category/chaussures" 
              className="text-sm text-primary-700 hover:text-accent-600 transition-colors duration-200"
            >
              Chaussures
            </Link>
            <Link 
              to="/category/chaine" 
              className="text-sm text-primary-700 hover:text-accent-600 transition-colors duration-200"
            >
              Chaînes
            </Link>
            <Link 
              to="/favorites" 
              className="text-sm text-primary-700 hover:text-accent-600 transition-colors duration-200"
            >
              Favoris
            </Link>
            <Link 
              to="/cart" 
              className="text-sm text-primary-700 hover:text-accent-600 transition-colors duration-200"
            >
              Panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
