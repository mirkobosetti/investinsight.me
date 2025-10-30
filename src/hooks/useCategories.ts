import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  subscribeToCategories,
  addCategory as addCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  saveCategories as saveCategoriesService,
  type Category,
} from '../services/firestore.service';
import { CATEGORY_COLORS, generateId } from '../utils';

// Default categories
const getDefaultCategories = (): Category[] => [
  { id: generateId(), name: 'Affitto', color: CATEGORY_COLORS[0], isDefault: true },
  { id: generateId(), name: 'Cibo', color: CATEGORY_COLORS[1], isDefault: true },
  { id: generateId(), name: 'Bollette', color: CATEGORY_COLORS[2], isDefault: true },
  { id: generateId(), name: 'Trasporti', color: CATEGORY_COLORS[3], isDefault: true },
  { id: generateId(), name: 'Svago', color: CATEGORY_COLORS[4], isDefault: true },
  { id: generateId(), name: 'Vacanze', color: CATEGORY_COLORS[5], isDefault: true },
  { id: generateId(), name: 'Regali', color: CATEGORY_COLORS[6], isDefault: true },
  { id: generateId(), name: 'Salute', color: CATEGORY_COLORS[7], isDefault: true },
  { id: generateId(), name: 'Abbigliamento', color: CATEGORY_COLORS[5], isDefault: true },
  { id: generateId(), name: 'Ristoranti', color: CATEGORY_COLORS[6], isDefault: true },
];

export const useCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>(getDefaultCategories());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load and subscribe to categories
  useEffect(() => {
    if (!user) {
      // Use default categories for non-logged users
      setCategories(getDefaultCategories());
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const loadCategories = async () => {
      try {
        setLoading(true);

        // Subscribe to categories
        unsubscribe = subscribeToCategories(user.uid, async (firestoreCategories) => {
          if (firestoreCategories.length === 0) {
            // Initialize with default categories if user has none
            const defaultCats = getDefaultCategories();
            await saveCategoriesService(user.uid, defaultCats);
            setCategories(defaultCats);
          } else {
            setCategories(firestoreCategories);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    loadCategories();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // Add category
  const addCategory = useCallback(
    async (name: string): Promise<boolean> => {
      const trimmedName = name.trim();
      if (!trimmedName) return false;

      // Check if category already exists
      if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
        return false;
      }

      const newCategory: Category = {
        id: generateId(),
        name: trimmedName,
        color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
        isDefault: false,
      };

      if (user) {
        try {
          await addCategoryService(user.uid, newCategory);
          return true;
        } catch (err) {
          console.error('Error adding category:', err);
          setError(err as Error);
          return false;
        }
      } else {
        // For non-logged users, update local state
        setCategories([...categories, newCategory]);
        return true;
      }
    },
    [user, categories]
  );

  // Update category
  const updateCategoryName = useCallback(
    async (id: string, name: string): Promise<boolean> => {
      const trimmedName = name.trim();
      if (!trimmedName) return false;

      // Check if name already exists (excluding current category)
      if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === trimmedName.toLowerCase())) {
        return false;
      }

      if (user) {
        try {
          await updateCategoryService(user.uid, id, { name: trimmedName });
          return true;
        } catch (err) {
          console.error('Error updating category:', err);
          setError(err as Error);
          return false;
        }
      } else {
        // For non-logged users
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, name: trimmedName } : cat
        ));
        return true;
      }
    },
    [user, categories]
  );

  // Update category color
  const updateCategoryColor = useCallback(
    async (id: string, color: string) => {
      if (user) {
        try {
          await updateCategoryService(user.uid, id, { color });
        } catch (err) {
          console.error('Error updating category color:', err);
          setError(err as Error);
        }
      } else {
        // For non-logged users
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, color } : cat
        ));
      }
    },
    [user, categories]
  );

  // Remove category
  const removeCategory = useCallback(
    async (id: string): Promise<boolean> => {
      const category = categories.find(cat => cat.id === id);

      // Don't allow removing default categories
      if (category?.isDefault) {
        return false;
      }

      if (user) {
        try {
          await deleteCategoryService(user.uid, id);
          return true;
        } catch (err) {
          console.error('Error removing category:', err);
          setError(err as Error);
          return false;
        }
      } else {
        // For non-logged users
        setCategories(categories.filter(cat => cat.id !== id));
        return true;
      }
    },
    [user, categories]
  );

  // Get category by name
  const getCategoryByName = useCallback(
    (name: string): Category | undefined => {
      return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    },
    [categories]
  );

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategoryName,
    updateCategoryColor,
    removeCategory,
    getCategoryByName,
  };
};
