import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { type User, type UserCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  signUpWithEmail as signUpService,
  signInWithEmail as signInService,
  signInWithGoogle as signInGoogleService,
  signOut as signOutService,
  resetPassword as resetPasswordService,
} from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    try {
      setError(null);
      return await signUpService(email, password, displayName);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      return await signInService(email, password);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      setError(null);
      return await signInGoogleService();
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await signOutService();
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await resetPasswordService(email);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
