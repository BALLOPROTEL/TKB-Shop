import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Users, ShoppingBag, Package, TrendingUp, 
  Eye, Edit3, Trash2, Plus, Search, Filter, BarChart3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../hooks/use-toast';
import ProductModal from '../components/admin/ProductModal';
import UserModal from '../components/admin/UserModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    stats, 
    users = [], 
    orders = [], 
    fetchStats, 
    fetchUsers, 
    fetchOrders,
    createUser,
    updateUser,
    deleteUser,
    updateOrderStatus,
    deleteOrder,
    loading,
    error
  } = useAdmin();
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', item: null });
  
  // Load data on mount
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchOrders();
  }, []);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-4">Seuls les administrateurs peuvent accéder à cette page</p>
          <Link to="/" className="text-pink-600 hover:text-pink-700">
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const allUsers = users || [];
  const allOrders = orders || [];
  const allProducts = products || [];

  // CRUD Functions
  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        await updateProduct(selectedProduct.id, productData);
      } else {
        // Add new product
        await createProduct(productData);
      }
      setSelectedProduct(null);
      toast({
        title: selectedProduct ? "Produit modifié" : "Produit créé",
        description: `${productData.name} a été ${selectedProduct ? 'modifié' : 'créé'} avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du produit",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      await deleteProduct(product.id);
      toast({
        title: "Produit supprimé",
        description: `${product.name} a été supprimé avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du produit",
        variant: "destructive"
      });
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, userData);
      } else {
        // Add new user
        await createUser(userData);
      }
      setSelectedUser(null);
      toast({
        title: selectedUser ? "Utilisateur modifié" : "Utilisateur créé",
        description: `${userData.firstName} ${userData.lastName} a été ${selectedUser ? 'modifié' : 'créé'} avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user.id);
      toast({
        title: "Utilisateur supprimé",
        description: `${user.firstName} ${user.lastName} a été supprimé avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOrder = async (order) => {
    try {
      await deleteOrder(order.id);
      toast({
        title: "Commande supprimée",
        description: `La commande ${order.id} a été supprimée avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la commande",
        variant: "destructive"
      });
    }
  };

  const openDeleteModal = (type, item) => {
    setDeleteTarget({ type, item });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const { type, item } = deleteTarget;
    switch (type) {
      case 'product':
        handleDeleteProduct(item);
        break;
      case 'user':
        handleDeleteUser(item);
        break;
      case 'order':
        handleDeleteOrder(item);
        break;
      default:
        break;
    }
  };

  // Use stats from useAdmin hook or calculate locally if not available
  const localStats = stats || {
    totalUsers: allUsers.length,
    totalOrders: allOrders.length,
    totalProducts: allProducts.length,
    totalRevenue: allOrders.length > 0 ? allOrders.reduce((sum, order) => sum + (order.total || 0), 0) : 0
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
    { id: 'users', label: 'Utilisateurs', icon: Users }
  ];

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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Utilisateurs</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{localStats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{localStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Produits</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{localStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-pink-100 rounded-lg">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm text-gray-600">Chiffre d'affaires</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{localStats.totalRevenue.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Commandes récentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Commande</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.slice(0, 5).map(order => {
                const customer = allUsers.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{customer?.firstName} {customer?.lastName}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">{order.total.toFixed(2)}€</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-bold text-gray-900">Gestion des produits</h3>
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau produit</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Produit</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Prix</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Stock</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 capitalize">{product.category.replace('-', ' ')}</td>
                  <td className="py-4 px-6 font-semibold">{product.price.toFixed(2)}€</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {product.inStock ? 'En stock' : 'Rupture'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsProductModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Modifier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal('product', product)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Toutes les commandes</h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Commande</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Client</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Articles</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Statut</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-900">Total</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map(order => {
                const customer = allUsers.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-semibold">{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {customer?.firstName} {customer?.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{customer?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await updateOrderStatus(order.id, newStatus);
                            toast({
                              title: "Statut mis à jour",
                              description: `Le statut de la commande ${order.id} a été modifié`,
                            });
                          } catch (error) {
                            toast({
                              title: "Erreur",
                              description: "Une erreur est survenue lors de la mise à jour du statut",
                              variant: "destructive"
                            });
                          }
                        }}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-pink-500 ${getStatusColor(order.status)}`}
                      >
                        <option value="processing">En cours</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right font-bold">{order.total.toFixed(2)}€</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openDeleteModal('order', order)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Gestion des utilisateurs</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button 
            onClick={() => {
              setSelectedUser(null);
              setIsUserModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel utilisateur</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Utilisateur</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Rôle</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Date d'inscription</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-900">Commandes</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers
                .filter(user => 
                  user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => {
                  const userOrders = allOrders.filter(order => order.userId === user.id);
                  return (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img src={user.avatar} alt={user.firstName} className="w-10 h-10 rounded-full object-cover mr-3" />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-600">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Client'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(user.joinDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6">{userOrders.length}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUserModalOpen(true);
                            }}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => openDeleteModal('user', user)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium mr-4 sm:mr-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
              <span className="sm:hidden">Retour</span>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-600">Connecté en tant que</p>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && renderUsers()}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget({ type: '', item: null });
        }}
        onConfirm={handleConfirmDelete}
        title={`Supprimer ${deleteTarget.type === 'product' ? 'le produit' : 
                             deleteTarget.type === 'user' ? 'l\'utilisateur' : 
                             'la commande'}`}
        message={`Êtes-vous sûr de vouloir supprimer cet(te) ${
          deleteTarget.type === 'product' ? 'produit' : 
          deleteTarget.type === 'user' ? 'utilisateur' : 
          'commande'
        } ? Cette action ne peut pas être annulée.`}
        itemName={
          deleteTarget.type === 'product' ? deleteTarget.item?.name :
          deleteTarget.type === 'user' ? `${deleteTarget.item?.firstName} ${deleteTarget.item?.lastName}` :
          deleteTarget.item?.id
        }
      />
    </div>
  );
};

export default AdminDashboard;