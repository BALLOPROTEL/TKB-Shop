import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, Package, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const CheckoutSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const getUrlParameter = (name) => {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      setError('Vérification du paiement expirée. Vérifiez vos emails pour confirmation.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Échec de la vérification du statut de paiement');
      }

      const data = await response.json();
      
      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        setOrderDetails({
          amount: data.amount_total / 100, // Convert from cents
          currency: data.currency.toUpperCase(),
          sessionId: sessionId,
          metadata: data.metadata
        });
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        setError('Session de paiement expirée. Veuillez réessayer.');
        return;
      }

      // Continue polling if payment is still pending
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de paiement:', error);
      setPaymentStatus('error');
      setError('Erreur lors de la vérification du statut de paiement.');
    }
  };

  useEffect(() => {
    const sessionId = getUrlParameter('session_id');
    if (sessionId) {
      pollPaymentStatus(sessionId);
    } else {
      setPaymentStatus('error');
      setError('ID de session manquant. Paiement invalide.');
    }
  }, []);

  const renderContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <Loader className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vérification du paiement...
            </h1>
            <p className="text-gray-600 mb-8">
              Veuillez patienter pendant que nous confirmons votre paiement.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Paiement réussi !
            </h1>
            <p className="text-gray-600 mb-8">
              Merci pour votre achat. Votre commande a été confirmée et sera traitée sous peu.
            </p>
            
            {orderDetails && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 text-orange-600 mr-2" />
                  Détails de la commande
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant total:</span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.amount.toFixed(2)} {orderDetails.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session ID:</span>
                    <span className="font-mono text-xs text-gray-500">
                      {orderDetails.sessionId.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {isAuthenticated && (
                <Button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center"
                >
                  Voir mes commandes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              <div>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center ml-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </div>
        );

      case 'expired':
      case 'error':
      case 'timeout':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problème de paiement
            </h1>
            <p className="text-red-600 mb-8">
              {error}
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/cart')}
                className="inline-flex items-center"
              >
                Réessayer le paiement
                <ArrowRight className="w-4 w-4 ml-2" />
              </Button>
              
              <div>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center ml-4"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
        
        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-card p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Que faire ensuite ?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Vous recevrez un email de confirmation avec les détails de votre commande</p>
              <p>• Votre commande sera préparée et expédiée dans les 24-48 heures</p>
              <p>• Un email de suivi vous sera envoyé avec le numéro de tracking</p>
              {isAuthenticated && (
                <p>• Suivez l'état de votre commande dans votre espace client</p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Besoin d'aide ? Contactez-nous à{' '}
                <Link to="/contact" className="text-orange-600 hover:text-orange-700">
                  support@tkbshop.com
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;