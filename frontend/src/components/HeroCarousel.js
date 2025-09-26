import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroImages } from '../data/mock';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] sm:min-h-[600px] py-8 sm:py-12 lg:py-20">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Nouvelle Collection Automne</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Sacs & Chaussures{' '}
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                de Qualité
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl">Chez TKB'Shop</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Découvrez notre collection exclusive de sacs et chaussures pour toute la famille. 
              Style, confort et qualité au rendez-vous.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/category/sacs"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base"
              >
                Découvrir nos Sacs
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              
              <Link
                to="/category/chaussures"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-pink-200 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-all duration-300 text-sm sm:text-base"
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
                <div className="text-xs sm:text-sm text-gray-600">Clients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">4.9★</div>
                <div className="text-xs sm:text-sm text-gray-600">Note Moyenne</div>
              </div>
            </div>
          </div>
          
          {/* Carousel */}
          <div className="relative order-1 lg:order-2">
            <div 
              className="relative z-10"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="flex transition-transform duration-500 ease-in-out"
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {heroImages.map((image, index) => (
                    <div key={image.id} className="w-full flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg sm:text-xl font-bold mb-1">{image.title}</h3>
                        <p className="text-sm opacity-90">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-pink-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 group"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-pink-600" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Decorative Elements - Hidden on mobile for performance */}
            <div className="hidden sm:block absolute top-4 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
            <div className="hidden sm:block absolute -bottom-8 -left-8 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
            
            {/* Floating Cards */}
            <div className="hidden sm:block absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-white p-3 sm:p-4 rounded-lg shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <div className="text-sm font-semibold text-gray-900">Livraison Gratuite</div>
              <div className="text-xs text-gray-600">Dès 50€ d'achat</div>
            </div>
            
            <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white p-3 sm:p-4 rounded-lg shadow-xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
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

export default HeroCarousel;