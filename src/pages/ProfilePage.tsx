import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, type UserProfile } from '../services/firestore.service';

export const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [initialCapital, setInitialCapital] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profileData = await getUserProfile(user.uid);
      if (profileData) {
        setProfile(profileData);
        setInitialCapital(profileData.initialCapital);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Errore nel caricamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCapital = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateUserProfile(user.uid, { initialCapital });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving capital:', err);
      setError('Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Profilo</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Informazioni Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Nome</label>
                <div className="text-lg">{user?.displayName || 'Non impostato'}</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <div className="text-lg">{user?.email}</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Account creato</label>
                <div className="text-lg">
                  {profile?.createdAt
                    ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('it-IT')
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Initial Capital Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Capitale Iniziale</h2>
            <p className="text-gray-400 text-sm mb-4">
              Imposta il tuo capitale di partenza. Questo valore verrà utilizzato come base per
              calcolare il capitale cumulativo nei mesi.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
                Capitale salvato con successo!
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capitale Iniziale (€)
                </label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSaveCapital}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {saving ? 'Salvataggio...' : 'Salva'}
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Capitale attuale impostato:</span>
                <span className="text-2xl font-bold text-green-500">
                  {new Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(profile?.initialCapital || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Azioni Account</h2>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
