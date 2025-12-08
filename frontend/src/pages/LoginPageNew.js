import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mot de passe minimum 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        addToast('Connexion réussie', 'success');
        navigate(from, { replace: true });
      } else {
        addToast(result.error || 'Erreur de connexion', 'error');
      }
    } catch (error) {
      addToast('Erreur de connexion', 'error');
    }
  };

  // Demo accounts for easy testing
  const demoAccounts = [
    { label: "Compte Admin", email: "admin@tkbshop.com", password: "admin123" },
    { label: "Compte Client", email: "marie@email.com", password: "marie123" }
  ];

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-primary-900">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="TKB'Shop Collection"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-800/80" />
          
          {/* Branding Content */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white max-w-md">
              <div className="mb-8">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-accent-500" />
                <h1 className="text-4xl font-light tracking-wider mb-4">TKB'SHOP</h1>
                <p className="text-lg opacity-90 leading-relaxed">
                  Excellence française dans l'art de la maroquinerie et de la chaussure de luxe
                </p>
              </div>
              
              <div className="space-y-4 text-sm opacity-80">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-12 h-px bg-accent-500"></div>
                  <span>DEPUIS 2023</span>
                  <div className="w-12 h-px bg-accent-500"></div>
                </div>
                <p>Artisanat d'exception • Qualité premium • Service personnalisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-primary-900" />
              <span className="text-2xl font-bold tracking-wider text-primary-900">TKB'SHOP</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-primary-900 mb-2">CONNEXION</h2>
            <p className="text-primary-600">Accédez à votre espace personnel</p>
          </div>

          {/* Demo Accounts - Development */}
          <div className="mb-6 p-4 bg-gray-50 rounded border-l-4 border-accent-500">
            <p className="text-sm text-primary-700 mb-3 font-medium">Comptes de démonstration :</p>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoAccount(account)}
                  className="text-xs text-accent-600 hover:text-accent-700 block hover:underline transition-colors duration-200"
                >
                  {account.label} - {account.email}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="ADRESSE EMAIL"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="votre@email.com"
              className="uppercase tracking-wide"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-primary-700 uppercase tracking-wide">
                MOT DE PASSE <span className="text-accent-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-3 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : 'border-gray-200 hover:border-primary-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-primary-600">Se souvenir de moi</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-accent-600 hover:text-accent-700 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full py-4 text-sm font-medium uppercase tracking-wider"
            >
              {isLoading ? 'Connexion...' : 'Se Connecter'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-primary-500">OU</span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-primary-600">
              Nouveau chez TKB'Shop ?{' '}
              <Link
                to="/register"
                className="font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200 uppercase tracking-wide"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-primary-500 hover:text-primary-700 transition-colors duration-200 uppercase tracking-wide"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;