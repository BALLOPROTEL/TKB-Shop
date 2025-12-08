import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TKB'SHOP</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Votre destination de choix pour les sacs à main et chaussures de qualité. 
              Style, élégance et confort pour toute la famille.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/category/sacs-a-main" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Sacs à Main
                </Link>
              </li>
              <li>
                <Link to="/category/chaussures-femmes" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Chaussures Femmes
                </Link>
              </li>
              <li>
                <Link to="/category/chaussures-enfants" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Chaussures Enfants
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Client</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Politique de retour
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Guide des tailles
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  Livraison et retours
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nous Contacter</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">contact@tkbshop.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-pink-400 mt-0.5" />
                <span className="text-gray-300">
                  123 Rue de la Mode<br />
                  75001 Paris, France
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Horaires d'ouverture</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Lun - Ven: 9h00 - 19h00</p>
                <p>Sam: 10h00 - 18h00</p>
                <p>Dim: 14h00 - 17h00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
              <p className="text-gray-300">Recevez nos dernières nouveautés et offres exclusives</p>
            </div>
            <div className="flex max-w-sm mx-auto lg:mx-0">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-700 transition-colors duration-200 font-medium">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200">
              Mentions légales
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors duration-200">
              Cookies
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © {currentYear} ChicBoutique. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Développé avec ❤️ par ChicBoutique Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;