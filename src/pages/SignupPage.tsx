import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { initializeUserProfile } from '../services/firestore.service';

export const SignupPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      return setError('Le password non coincidono');
    }

    if (password.length < 6) {
      return setError('La password deve essere di almeno 6 caratteri');
    }

    setLoading(true);

    try {
      const result = await signUp(email, password, displayName);

      // Initialize user profile
      if (result.user) {
        await initializeUserProfile(result.user.uid, email, displayName);
      }

      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email già registrata');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email non valida');
      } else if (err.code === 'auth/weak-password') {
        setError('Password troppo debole');
      } else {
        setError(err.message || 'Errore durante la registrazione');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      // Initialize profile if new user
      if (result.user) {
        await initializeUserProfile(
          result.user.uid,
          result.user.email || '',
          result.user.displayName
        );
      }

      navigate('/');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Errore durante la registrazione con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">InvestInsight</h1>
          <p className="text-gray-400">Crea il tuo account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="tuo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-400 mt-1">Almeno 6 caratteri</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Conferma Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Oppure</span>
            </div>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-gray-100 disabled:bg-gray-600 text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Registrati con Google
          </button>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-gray-400 text-sm">
              Hai già un account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Accedi
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Torna alla homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
