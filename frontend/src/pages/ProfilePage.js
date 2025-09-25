import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, X, Package, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const ProfilePage = () => {
  const { user, updateProfile, getUserOrders, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const orders = getUserOrders(user?.id);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-orange-600 bg-orange-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      delivered: 'Livré',
      shipped: 'Expédié',
      processing: 'En cours',
      cancelled: 'Annulé'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium mr-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            Se déconnecter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <img
                  src={user?.avatar}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.role === 'admin' ? 'Administrateur' : 'Cliente'}</p>
                <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Membre depuis {new Date(user?.joinDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{orders.length}</div>
                  <div className="text-sm text-gray-600">Commandes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details & Orders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Informations personnelles</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      <span>Sauvegarder</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.lastName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.phone || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.address || 'Non renseignée'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mes commandes</h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande</h4>
                  <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Commande {order.id}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            {order.total.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-gray-900">{item.price.toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;