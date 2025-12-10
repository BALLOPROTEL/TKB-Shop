import { useState, useMemo } from 'react';

/**
 * Custom hook for client-side pagination
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 12)
 * @returns {Object} - Pagination state and controls
 */
export const usePagination = (items, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Go to previous page
  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Reset to first page (useful when items change)
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    itemsPerPage,
    totalItems: items.length,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

/**
 * Custom hook for server-side pagination
 * 
 * @param {Function} fetchFunction - Async function to fetch data
 * @param {number} itemsPerPage - Items per page (default: 20)
 * @returns {Object} - Pagination state and controls
 */
export const useServerPagination = (fetchFunction, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch data for current page
  const fetchPage = async (page) => {
    try {
      setLoading(true);
      setError(null);
      
      const skip = (page - 1) * itemsPerPage;
      const result = await fetchFunction({ skip, limit: itemsPerPage });
      
      setItems(result.data || result);
      setTotalItems(result.total || result.length);
      setCurrentPage(page);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
      console.error('Pagination error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages || page));
    fetchPage(pageNumber);
  };

  return {
    currentPage,
    totalPages,
    items,
    itemsPerPage,
    totalItems,
    loading,
    error,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    previousPage: () => goToPage(currentPage - 1),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export default usePagination;
