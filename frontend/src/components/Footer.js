import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', newsletterEmail);
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-light text-primary-900 mb-4 tracking-wide">
              RESTEZ INFORMÉ
            </h2>
            <p className="text-primary-600 mb-6 leading-relaxed">
              Soyez le premier à découvrir nos nouvelles collections et nos offres exclusives
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-200 text-center sm:text-left"
                required
              />
              <Button 
                type="submit" 
                className="px-8 py-3 uppercase tracking-wider text-sm"
              >
                S'inscrire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <p className="text-xs text-primary-500 mt-4">
              En vous inscrivant, vous acceptez notre politique de confidentialité
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-wider text-primary-900">TKB'SHOP</span>
            </Link>
            <p className="text-primary-600 mb-8 max-w-sm leading-relaxed text-sm">
              Maison française spécialisée dans l'art de la maroquinerie, de la chaussure et de la joaillerie depuis 2023.
            </p>
            
            {/* Social Media */}
            <div className="mb-8">
              <p className="text-sm font-medium text-primary-800 mb-4 uppercase tracking-wide">
                Suivez-nous
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-primary-500 hover:text-primary-900 transition-colors duration-200" 
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-primary-500 hover:text-primary-900 transition-colors duration-200" 
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-primary-500 hover:text-primary-900 transition-colors duration-200" 
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-primary-500 hover:text-primary-900 transition-colors duration-200" 
                  aria-label="Youtube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-medium text-primary-900 mb-6 uppercase tracking-wide">
              Collections
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/category/sacs/sac-a-main" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Sacs à Main
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/sacs/sac-voyage" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Sacs de Voyage
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/chaussures/femmes" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Chaussures Femmes
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/chaussures/hommes" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Chaussures Hommes
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/chaine/chaine-or" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Chaînes Or
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/chaine/pendentifs" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Pendentifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Client */}
          <div>
            <h3 className="text-sm font-medium text-primary-900 mb-6 uppercase tracking-wide">
              Service Client
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/aide" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Centre d'Aide
                </Link>
              </li>
              <li>
                <Link 
                  to="/livraison" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Livraison & Retours
                </Link>
              </li>
              <li>
                <Link 
                  to="/guide-tailles" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Guide des Tailles
                </Link>
              </li>
              <li>
                <Link 
                  to="/entretien" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Entretien Produits
                </Link>
              </li>
              <li>
                <Link 
                  to="/garantie" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  Garantie & SAV
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-primary-900 mb-6 uppercase tracking-wide">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-primary-600">
                    123 Avenue de la Mode<br />
                    75008 Paris, France
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <a 
                  href="tel:+33142857690" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  +33 1 42 85 76 90
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <a 
                  href="mailto:contact@tkbshop.com" 
                  className="text-sm text-primary-600 hover:text-primary-900 transition-colors duration-200"
                >
                  contact@tkbshop.com
                </a>
              </div>
            </div>

            {/* Horaires */}
            <div className="mt-6">
              <h4 className="text-xs font-medium text-primary-800 mb-3 uppercase tracking-wide">
                Horaires d'ouverture
              </h4>
              <div className="text-xs text-primary-600 space-y-1">
                <p>Lun - Sam : 10h - 19h</p>
                <p>Dimanche : 14h - 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-xs text-primary-500">
                © {currentYear} TKB'Shop. Tous droits réservés.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6 mb-4 md:mb-0">
              <Link 
                to="/mentions-legales" 
                className="text-xs text-primary-500 hover:text-primary-700 transition-colors duration-200"
              >
                Mentions Légales
              </Link>
              <Link 
                to="/confidentialite" 
                className="text-xs text-primary-500 hover:text-primary-700 transition-colors duration-200"
              >
                Confidentialité
              </Link>
              <Link 
                to="/cookies" 
                className="text-xs text-primary-500 hover:text-primary-700 transition-colors duration-200"
              >
                Cookies
              </Link>
              <Link 
                to="/cgv" 
                className="text-xs text-primary-500 hover:text-primary-700 transition-colors duration-200"
              >
                CGV
              </Link>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center text-xs text-primary-500 hover:text-primary-700 transition-colors duration-200"
              aria-label="Retour en haut"
            >
              <span className="mr-2">Haut de page</span>
              <ChevronUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Made with love */}
      <div className="bg-primary-900 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            Développé avec ❤️ par TKB'Shop Team • Design inspiré par l'excellence française
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;