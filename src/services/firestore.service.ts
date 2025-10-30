import {
  collection,
  doc,
  getDoc,
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
