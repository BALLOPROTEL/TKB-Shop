import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard, Truck, Shield, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 75 ? 0 : 9.90;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="mx-auto h-24 w-24 text-primary-300 mb-8" />
            <h1 className="text-3xl font-light text-primary-900 mb-4 tracking-wide">
              PANIER VIDE
            </h1>
            <p className="text-primary-600 mb-8 leading-relaxed">
              Votre panier attend d'être rempli avec nos créations d'exception
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
              className="inline-flex items-center uppercase tracking-wider"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Explorer la Collection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-primary-600 hover:text-primary-800 uppercase tracking-wide">
                Accueil
              </Link>
            </li>
            <li className="text-primary-400">/</li>
            <li className="text-primary-800 font-medium uppercase tracking-wide">
              Panier ({getTotalItems()})
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-luxury">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-light text-primary-900 tracking-wide">
                  MON PANIER
                </h1>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="p-6">
                    <div className="flex items-start space-x-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-medium text-primary-900 hover:text-primary-700 transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        
                        {/* Variants */}
                        <div className="mt-2 space-y-1">
                          {item.selectedColor && (
                            <p className="text-sm text-primary-600">
                              <span className="font-medium uppercase tracking-wide">Couleur:</span> {item.selectedColor}
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-sm text-primary-600">
                              <span className="font-medium uppercase tracking-wide">Taille:</span> {item.selectedSize}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <p className="mt-2 text-lg font-medium text-primary-900">
                          {item.price.toFixed(2)} €
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, Math.max(1, item.quantity - 1))}
                          className="p-2 text-primary-600 hover:text-primary-800 hover:bg-gray-50 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-12 text-center font-medium text-primary-900">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                          className="p-2 text-primary-600 hover:text-primary-800 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                        className="p-2 text-primary-400 hover:text-red-600 transition-colors duration-200"
                        title="Retirer l'article"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white shadow-luxury">
                <Truck className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium text-primary-900 uppercase tracking-wide">Livraison Express</h3>
                <p className="text-sm text-primary-600 mt-2">Gratuite dès 75€</p>
              </div>
              
              <div className="text-center p-6 bg-white shadow-luxury">
                <Shield className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium text-primary-900 uppercase tracking-wide">Retour Gratuit</h3>
                <p className="text-sm text-primary-600 mt-2">30 jours pour changer d'avis</p>
              </div>
              
              <div className="text-center p-6 bg-white shadow-luxury">
                <CreditCard className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-medium text-primary-900 uppercase tracking-wide">Paiement Sécurisé</h3>
                <p className="text-sm text-primary-600 mt-2">Stripe & 3D Secure</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-luxury sticky top-8">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-light text-primary-900 tracking-wide">
                  RÉCAPITULATIF
                </h2>
              </div>

              {/* Summary Details */}
              <div className="px-6 py-6 space-y-4">
                <div className="flex justify-between text-primary-700">
                  <span>Sous-total ({getTotalItems()} articles)</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between text-primary-700">
                  <span>Livraison</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-accent-600 font-medium">Gratuite</span>
                    ) : (
                      `${shipping.toFixed(2)} €`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-primary-600 bg-gray-50 p-3 rounded">
                    Plus que <strong>{(75 - subtotal).toFixed(2)} €</strong> pour la livraison gratuite !
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-medium text-primary-900">
                    <span className="uppercase tracking-wide">Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="px-6 pb-6">
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/checkout');
                    } else {
                      navigate('/login', { state: { from: { pathname: '/checkout' } } });
                    }
                  }}
                  className="w-full py-4 text-sm font-medium uppercase tracking-wider"
                  size="lg"
                >
                  {isAuthenticated ? 'Passer la Commande' : 'Connexion et Commande'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-primary-600 text-center mt-3">
                    Connectez-vous ou créez un compte pour finaliser votre commande
                  </p>
                )}
              </div>

              {/* Continue Shopping */}
              <div className="px-6 pb-6">
                <Link
                  to="/"
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 text-primary-700 font-medium hover:bg-gray-50 transition-colors duration-200 text-sm uppercase tracking-wide"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuer mes Achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;