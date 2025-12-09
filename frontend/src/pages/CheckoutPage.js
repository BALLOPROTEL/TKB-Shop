import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Check, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { addToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: user?.phone || ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [enableBnpl, setEnableBnpl] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email valide requis';
    }
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Prénom requis';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Nom requis';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Adresse requise';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'Ville requise';
    }
    
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Code postal requis';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    
    setIsProcessing(true);

    try {
      // Prepare checkout data
      const checkoutData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          quantity: item.quantity
        })),
        shippingAddress: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        }
      };

      // Get current origin for success/cancel URLs
      const currentOrigin = window.location.origin;
      
      // Add BNPL parameter to URL
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/session${enableBnpl ? '?enable_bnpl=true' : ''}`;
      
      // Add origin to request headers
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': currentOrigin,
          ...(isAuthenticated ? {
            'Authorization': `Bearer ${localStorage.getItem('chicboutique_token')}`
          } : {})
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      addToast(error.message || 'Erreur lors de l\'initialisation du paiement', 'error');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <Link to="/" className="text-orange-600 hover:text-orange-700">
            Retourner aux produits
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mr-8 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-orange">1</div>
                  Informations de contact
                </h2>
                
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-orange">2</div>
                  Adresse de livraison
                </h2>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="Ville"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Code postal"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-300 transition-all duration-200 hover:border-orange-200"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-orange">3</div>
                  Méthode de paiement
                </h2>
                
                <div className="space-y-4">
                  <div className="border-2 border-orange-500 bg-orange-50 rounded-lg p-4 transition-all duration-200 hover:shadow-orange">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-orange-600 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">Carte bancaire</p>
                          <p className="text-sm text-gray-600">Paiement sécurisé via Stripe</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-orange">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                loading={isProcessing}
                size="xl"
                className="w-full py-4 px-6 text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Redirection vers Stripe...
                  </div>
                ) : (
                  `Payer ${total.toFixed(2)}€`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Votre commande
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.cartId} className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <p>{item.selectedColor} • {item.selectedSize}</p>
                        <p>Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vos avantages</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">Livraison rapide 24-48h</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-600">Retour gratuit 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;