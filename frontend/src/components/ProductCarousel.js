import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      id: 1,
      title: "Sacs à Main Élégants",
      description: "Collection de sacs en cuir véritable",
      image: "https://images.unsplash.com/photo-1705909237050-7a7625b47fac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxoYW5kYmFnfGVufDB8fHx8MTc1ODg3OTYyMHww&ixlib=rb-4.1.0&q=85",
      category: "sacs",
      link: "/category/sacs/sac-a-main"
    },
    {
      id: 2,
      title: "Sacs de Luxe",
      description: "Élégance et sophistication",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxoYW5kYmFnfGVufDB8fHx8MTc1ODg3OTYyMHww&ixlib=rb-4.1.0&q=85",
      category: "sacs",
      link: "/category/sacs/sac-a-main"
    },
    {
      id: 3,
      title: "Chaussures Sport",
      description: "Confort et style moderne",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2hvZXN8ZW58MHx8fHwxNzU4ODc5NjI1fDA&ixlib=rb-4.1.0&q=85",
      category: "chaussures",
      link: "/category/chaussures/hommes"
    },
    {
      id: 4,
      title: "Sacs Voyage", 
      description: "Parfaits pour vos escapades",
      image: "https://images.unsplash.com/photo-1682745230951-8a5aa9a474a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxoYW5kYmFnfGVufDB8fHx8MTc1ODg3OTYyMHww&ixlib=rb-4.1.0&q=85",
      category: "sacs",
      link: "/category/sacs/sac-voyage"
    },
    {
      id: 5,
      title: "Chaussures Élégantes",
      description: "Pour toutes les occasions",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwc2hvZXN8ZW58MHx8fHwxNzU4ODc5NjI1fDA&ixlib=rb-4.1.0&q=85",
      category: "chaussures", 
      link: "/category/chaussures/femmes"
    },
    {
      id: 6,
      title: "Sacs École",
      description: "Style et fonctionnalité",
      image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHw0fHxoYW5kYmFnfGVufDB8fHx8MTc1ODg3OTYyMHww&ixlib=rb-4.1.0&q=85",
      category: "sacs",
      link: "/category/sacs/sac-ecole"
    }
  ];

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-2xl group">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselItems.map((item, index) => (
          <div key={item.id} className="relative flex-shrink-0 w-full h-full">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              loading={index <= 2 ? "eager" : "lazy"}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 transform translate-y-0 transition-transform duration-300">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg mb-4 opacity-90 transform translate-y-0 transition-transform duration-300">
                {item.description}
              </p>
              <Link
                to={item.link}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Découvrir
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / carouselItems.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default ProductCarousel;