import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { initializeUserProfile } from '../services/firestore.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Accesso effettuato con successo!');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Errore durante il login';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

      toast.success('Accesso con Google effettuato!');
      navigate('/');
    } catch (err: any) {
      console.error('Google login error:', err);
      const errorMessage = err.message || 'Errore durante il login con Google';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-xl">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <TrendingUp className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold gradient-text">InvestInsight</span>
          </Link>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Gestisci il tuo{' '}
            <span className="gradient-text">patrimonio</span>
            <br />
            con intelligenza
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Monitora investimenti, analizza flussi di cassa e pianifica il tuo futuro finanziario in un unico posto.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Cash Flow', value: '100%' },
              { label: 'Sicuro', value: '🔒' },
              { label: 'Veloce', value: '⚡' },
            ].map((stat, i) => (
              <Card key={i} variant="glass" padding="sm" className="text-center">
                <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Back Button (Mobile) */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 lg:hidden">
            <ArrowLeft className="h-4 w-4" />
            Torna alla home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold gradient-text">InvestInsight</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Bentornato!</h2>
            <p className="text-muted-foreground">Accedi al tuo account per continuare</p>
          </div>

          <Card variant="glass" padding="lg">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11"
                    placeholder="tuo@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Accedi
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-card text-muted-foreground font-medium">Oppure continua con</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Non hai un account?{' '}
                <Link to="/signup" className="text-primary hover:text-primary-light font-semibold transition-colors">
                  Registrati ora
                </Link>
              </p>
            </div>
          </Card>

          {/* Back to Home (Desktop) */}
          <div className="mt-6 text-center hidden lg:block">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Torna alla homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
