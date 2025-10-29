import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CATEGORY_COLORS, generateId } from '../utils';

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

interface CategoryState {
  categories: Category[];
  addCategory: (name: string) => boolean;
  updateCategory: (id: string, name: string) => boolean;
  removeCategory: (id: string) => boolean;
  updateCategoryColor: (id: string, color: string) => void;
  getCategoryByName: (name: string) => Category | undefined;
}

// Initialize default categories
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

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: getDefaultCategories(),

      addCategory: (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return false;

        const { categories } = get();

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

        set({ categories: [...categories, newCategory] });
        return true;
      },

      updateCategory: (id: string, name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return false;

        const { categories } = get();

        // Check if name already exists (excluding current category)
        if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === trimmedName.toLowerCase())) {
          return false;
        }

        set({
          categories: categories.map(cat =>
            cat.id === id ? { ...cat, name: trimmedName } : cat
          ),
        });
        return true;
      },

      removeCategory: (id: string) => {
        const { categories } = get();
        const category = categories.find(cat => cat.id === id);

        // Don't allow removing default categories
        if (category?.isDefault) {
          return false;
        }

        set({ categories: categories.filter(cat => cat.id !== id) });
        return true;
      },

      updateCategoryColor: (id: string, color: string) => {
        set(state => ({
          categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, color } : cat
          ),
        }));
      },

      getCategoryByName: (name: string) => {
        const { categories } = get();
        return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
      },
    }),
    {
      name: 'category-store', // localStorage key
    }
  )
);
