import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, ShoppingBag } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000, productInfo = null }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'cart':
        return <ShoppingBag className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'cart':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 w-0 flex-1">
              {productInfo && type === 'cart' ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Produit ajouté au panier !
                  </p>
                  <div className="mt-2 flex items-center space-x-3">
                    {productInfo.image && (
                      <img 
                        src={productInfo.image} 
                        alt={productInfo.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-xs text-gray-600">{productInfo.name}</p>
                      <p className="text-xs text-gray-500">
                        {productInfo.selectedColor && `Couleur: ${productInfo.selectedColor}`}
                        {productInfo.selectedSize && ` • Taille: ${productInfo.selectedSize}`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {message}
                </p>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                onClick={onClose}
              >
                <span className="sr-only">Fermer</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 animate-progress-bar"
            style={{ animation: `progress-bar ${duration}ms linear` }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast Provider for global toast management
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', productInfo = null) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, productInfo };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const contextValue = {
    addToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            productInfo={toast.productInfo}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Toast Context
export const ToastContext = React.createContext();

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;