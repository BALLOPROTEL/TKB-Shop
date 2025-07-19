import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez notre collection de produits et ajoutez vos articles préférés
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
            <p className="text-gray-600 mt-1">
              {items.length} article{items.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer mes achats
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.cartId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Couleur: {item.selectedColor}</p>
                      <p>Taille: {item.selectedSize}</p>
                    </div>
                    
                    {/* Mobile Price */}
                    <div className="lg:hidden mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {item.price.toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden lg:block text-lg font-bold text-gray-900">
                    {item.price.toFixed(2)}€
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Résumé de commande
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">
                    {getTotalPrice().toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-green-600">
                    {getTotalPrice() >= 50 ? 'Gratuite' : '4.99€'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      {(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 4.99)).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {getTotalPrice() < 50 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    Ajoutez {(50 - getTotalPrice()).toFixed(2)}€ pour bénéficier de la livraison gratuite !
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold py-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Procéder au paiement
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Paiement sécurisé</p>
                  <div className="flex justify-center space-x-4 opacity-60">
                    <div className="text-xs text-gray-500">🔒 SSL</div>
                    <div className="text-xs text-gray-500">💳 Stripe</div>
                    <div className="text-xs text-gray-500">🛡️ Sécurisé</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;