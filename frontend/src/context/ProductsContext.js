import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Erreur lors du chargement des produits');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        { id: "tous", name: "Tous les produits", slug: "tous" },
        { id: "sacs-a-main", name: "Sacs à Main", slug: "sacs-a-main" },
        { id: "chaussures-femmes", name: "Chaussures Femmes", slug: "chaussures-femmes" },
        { id: "chaussures-enfants", name: "Chaussures Enfants", slug: "chaussures-enfants" }
      ]);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      const response = await productsAPI.getById(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Create product (admin)
  const createProduct = async (productData) => {
    try {
      const response = await productsAPI.create(productData);
      setProducts(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Update product (admin)
  const updateProduct = async (id, updates) => {
    try {
      const response = await productsAPI.update(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Delete product (admin)
  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};