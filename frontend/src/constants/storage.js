/**
 * LocalStorage Keys - Centralized storage constants
 * All keys prefixed with 'tkbshop_' for consistency
 */

export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'tkbshop_token',
  AUTH_USER: 'tkbshop_user',
  
  // Cart
  CART_ITEMS: 'tkbshop_cart',
  
  // Favorites
  FAVORITES: 'tkbshop_favorites',
  
  // Preferences
  THEME: 'tkbshop_theme',
  LANGUAGE: 'tkbshop_language',
};

/**
 * Migration helper to rename old keys to new ones
 * Run this once to migrate existing users
 */
export const migrateOldStorageKeys = () => {
  const migrations = [
    { old: 'chicboutique_token', new: STORAGE_KEYS.AUTH_TOKEN },
    { old: 'chicboutique_user', new: STORAGE_KEYS.AUTH_USER },
    { old: 'fashionCart', new: STORAGE_KEYS.CART_ITEMS },
  ];

  migrations.forEach(({ old, new: newKey }) => {
    const oldValue = localStorage.getItem(old);
    if (oldValue) {
      localStorage.setItem(newKey, oldValue);
      localStorage.removeItem(old);
      console.log(`✅ Migrated: ${old} → ${newKey}`);
    }
  });
};

export default STORAGE_KEYS;
