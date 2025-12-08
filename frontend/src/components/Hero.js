import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

const Hero = () => {
  return (
    <section className="hero-section relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] sm:min-h-[600px] py-8 sm:py-12 lg:py-20">
          {/* Content */}
          <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-primary-800 px-4 py-2 text-sm font-medium uppercase tracking-wider mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Nouvelle Collection</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-primary-900 leading-tight mb-6">
              STYLE INTEMPOREL
              <br />
              <span className="font-normal">& ÉLÉGANCE</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-primary-700 mb-8 max-w-lg mx-auto lg:mx-0">
              Découvrez l&apos;excellence artisanale française à travers notre collection soigneusement sélectionnée de sacs, chaussures et accessoires de luxe.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/category/sacs-a-main"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-900 text-white font-medium hover:bg-primary-800 transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                Explorer la Collection
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
              
              <Link
                to="/category/chaussures-femmes"
                className="inline-flex items-center justify-center px-8 py-4 border border-primary-300 text-primary-800 font-medium hover:bg-primary-50 transition-colors duration-300 text-sm uppercase tracking-wider"
              >
                Chaussures
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
            
            {/* Clean background - no distracting elements */}
          </div>
        </div>
      </div>
      
      {/* Clean background */}
    </section>
  );
};

export default Hero;