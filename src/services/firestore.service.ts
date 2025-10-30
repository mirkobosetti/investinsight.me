import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { MonthData } from '../types';

// User Profile Type
export interface UserProfile {
  email: string;
  displayName: string | null;
  initialCapital: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', userId, 'profile', 'data');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

/**
 * Create or update user profile
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'profile', 'data');

  // Check if profile exists
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Update existing profile
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new profile
    await setDoc(docRef, {
      email: data.email || '',
      displayName: data.displayName || null,
      initialCapital: data.initialCapital || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

/**
 * Subscribe to months collection (real-time)
 */
export const subscribeToMonths = (
  userId: string,
  callback: (months: MonthData[]) => void
): (() => void) => {
  const monthsRef = collection(db, 'users', userId, 'months');
  const q = query(monthsRef);

  return onSnapshot(q, (snapshot) => {
    const months: MonthData[] = [];
    snapshot.forEach((doc) => {
      months.push({ ...doc.data(), id: doc.id } as MonthData);
    });
    callback(months);
  });
};

/**
 * Add a new month
 */
export const addMonth = async (userId: string, monthData: MonthData): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'months', monthData.id);
  await setDoc(docRef, monthData);
};

/**
 * Update an existing month
 */
export const updateMonth = async (
  userId: string,
  monthId: string,
  monthData: Partial<MonthData>
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'months', monthId);
  await updateDoc(docRef, monthData);
};

/**
 * Delete a month
 */
export const deleteMonth = async (userId: string, monthId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'months', monthId);
  await deleteDoc(docRef);
};

/**
 * Initialize user profile on first sign-up
 */
export const initializeUserProfile = async (
  userId: string,
  email: string,
  displayName: string | null
): Promise<void> => {
  await updateUserProfile(userId, {
    email,
    displayName,
    initialCapital: 0,
  });
};

// ============================================
// CATEGORIES
// ============================================

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

/**
 * Subscribe to categories collection (real-time)
 */
export const subscribeToCategories = (
  userId: string,
  callback: (categories: Category[]) => void
): (() => void) => {
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const q = query(categoriesRef);

  return onSnapshot(q, (snapshot) => {
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({ ...doc.data(), id: doc.id } as Category);
    });
    callback(categories);
  });
};

/**
 * Save categories to Firestore
 */
export const saveCategories = async (userId: string, categories: Category[]): Promise<void> => {
  // Delete all existing categories first
  const categoriesRef = collection(db, 'users', userId, 'categories');
  const snapshot = await getDocs(categoriesRef);

  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Add new categories
  const addPromises = categories.map(category =>
    setDoc(doc(db, 'users', userId, 'categories', category.id), category)
  );
  await Promise.all(addPromises);
};

/**
 * Add a single category
 */
export const addCategory = async (userId: string, category: Category): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'categories', category.id);
  await setDoc(docRef, category);
};

/**
 * Update a single category
 */
export const updateCategory = async (
  userId: string,
  categoryId: string,
  updates: Partial<Category>
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'categories', categoryId);
  await updateDoc(docRef, updates);
};

/**
 * Delete a single category
 */
export const deleteCategory = async (userId: string, categoryId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'categories', categoryId);
  await deleteDoc(docRef);
};

// ============================================
// INVESTMENT CONFIG
// ============================================

export interface InvestmentConfig {
  initialBalance: number;
  monthlyInvestment: number;
  annualROI: number;
  yearsToSimulate: number;
}

/**
 * Get investment config
 */
export const getInvestmentConfig = async (userId: string): Promise<InvestmentConfig | null> => {
  const docRef = doc(db, 'users', userId, 'config', 'investment');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as InvestmentConfig;
  }
  return null;
};

/**
 * Save investment config
 */
export const saveInvestmentConfig = async (
  userId: string,
  config: InvestmentConfig
): Promise<void> => {
  const docRef = doc(db, 'users', userId, 'config', 'investment');
  await setDoc(docRef, config);
};
