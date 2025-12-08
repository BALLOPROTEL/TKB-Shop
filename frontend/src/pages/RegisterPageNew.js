import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Veuillez accepter les conditions';
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
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });
      
      if (result.success) {
        addToast('Compte créé avec succès ! Bienvenue sur TKB\'Shop !', 'success');
        navigate('/');
      } else {
        addToast(result.error || 'Erreur lors de la création du compte', 'error');
      }
    } catch (error) {
      addToast('Erreur lors de la création du compte', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
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
            <h2 className="text-3xl font-light text-primary-900 mb-2">INSCRIPTION</h2>
            <p className="text-primary-600">Rejoignez la communauté TKB'Shop</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="PRÉNOM"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                placeholder="Votre prénom"
              />
              
              <Input
                label="NOM"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                placeholder="Votre nom"
              />
            </div>

            <Input
              label="ADRESSE EMAIL"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="votre@email.com"
            />

            <Input
              label="TÉLÉPHONE"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+33 6 12 34 56 78"
            />

            <Input
              label="ADRESSE"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Votre adresse complète"
            />

            {/* Password Fields */}
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

            <div className="space-y-1">
              <label className="block text-sm font-medium text-primary-700 uppercase tracking-wide">
                CONFIRMER LE MOT DE PASSE <span className="text-accent-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-3 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : 'border-gray-200 hover:border-primary-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <label className="flex items-start">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1" 
                />
                <span className="ml-3 text-sm text-primary-600 leading-relaxed">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-accent-600 hover:text-accent-700 underline">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="text-accent-600 hover:text-accent-700 underline">
                    politique de confidentialité
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Newsletter Subscription */}
            <label className="flex items-start">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1" />
              <span className="ml-3 text-sm text-primary-600">
                Je souhaite recevoir les actualités et offres exclusives TKB'Shop
              </span>
            </label>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full py-4 text-sm font-medium uppercase tracking-wider"
            >
              {isLoading ? 'Création...' : 'Créer Mon Compte'}
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-primary-600">
              Déjà client TKB'Shop ?{' '}
              <Link
                to="/login"
                className="font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200 uppercase tracking-wide"
              >
                Se connecter
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

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-primary-900">
          <img 
            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="TKB'Shop Atelier"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-800/80" />
          
          {/* Branding Content */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white max-w-md">
              <div className="mb-8">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-accent-500" />
                <h1 className="text-4xl font-light tracking-wider mb-4">BIENVENUE</h1>
                <p className="text-lg opacity-90 leading-relaxed">
                  Découvrez l'élégance française à travers nos créations artisanales
                </p>
              </div>
              
              <div className="space-y-6 text-sm opacity-80">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-12 h-px bg-accent-500"></div>
                  <span>AVANTAGES MEMBRE</span>
                  <div className="w-12 h-px bg-accent-500"></div>
                </div>
                <div className="space-y-3 text-left max-w-sm">
                  <p>✓ Livraison gratuite dès 75€</p>
                  <p>✓ Accès prioritaire aux nouveautés</p>
                  <p>✓ Programme de fidélité exclusif</p>
                  <p>✓ Service client personnalisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;