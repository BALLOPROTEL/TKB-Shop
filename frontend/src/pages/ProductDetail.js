import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { mockProducts } from '../data/mock';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link to="/" className="text-pink-600 hover:text-pink-700">
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner une couleur et une taille",
        variant: "destructive"
      });
      return;
    }

    addToCart(product, selectedColor, selectedSize, quantity);
    toast({
      title: "Produit ajouté !",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Rupture de stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.category.replace('-', ' ')}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    Économisez {(product.originalPrice - product.price).toFixed(2)}€
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Couleur: {selectedColor}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Taille: {selectedSize}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 transform hover:-translate-y-0.5 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>
                  {product.inStock ? 'Ajouter au Panier' : 'Rupture de stock'}
                </span>
              </button>

              <div className="flex space-x-4">
                <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="h-5 w-5" />
                  <span>Ajouter aux favoris</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <Share2 className="h-5 w-5" />
                  <span>Partager</span>
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-gray-100 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Avantages</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Livraison gratuite dès 50€
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Retour gratuit sous 30 jours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Garantie qualité 2 ans
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Service client 7j/7
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;