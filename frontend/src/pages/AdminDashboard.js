import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Users, ShoppingBag, Package, TrendingUp, 
  Eye, Edit3, Trash2, Plus, Search, Filter, BarChart3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { useProducts } from '../hooks/useProducts';
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
  
  // Data states
  const [products, setProducts] = useState(mockProducts);
  const [users, setUsers] = useState(getAllUsers());
  const [orders, setOrders] = useState(getAllOrders());
  
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

  const allUsers = users;
  const allOrders = orders;

  // CRUD Functions
  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? productData : p));
    } else {
      // Add new product
      setProducts(prev => [...prev, productData]);
    }
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id));
    toast({
      title: "Produit supprimé",
      description: `${product.name} a été supprimé avec succès`,
    });
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? userData : u));
    } else {
      // Add new user
      setUsers(prev => [...prev, userData]);
    }
    setSelectedUser(null);
  };

  const handleDeleteUser = (user) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    toast({
      title: "Utilisateur supprimé",
      description: `${user.firstName} ${user.lastName} a été supprimé avec succès`,
    });
  };

  const handleDeleteOrder = (order) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    toast({
      title: "Commande supprimée",
      description: `La commande ${order.id} a été supprimée avec succès`,
    });
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

  // Statistics
  const stats = {
    totalUsers: allUsers.length,
    totalOrders: allOrders.length,
    totalProducts: products.length,
    totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0)
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Produits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}€</p>
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Gestion des produits</h3>
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
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
              {products.map(product => (
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
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setOrders(prev => prev.map(o => 
                            o.id === order.id ? { ...o, status: newStatus } : o
                          ));
                          toast({
                            title: "Statut mis à jour",
                            description: `Le statut de la commande ${order.id} a été modifié`,
                          });
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium mr-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Connecté en tant que</p>
            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
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