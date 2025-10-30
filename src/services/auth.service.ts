import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Google provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update profile with display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  return userCredential;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider);
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
