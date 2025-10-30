import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const DemoWarningBanner = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-amber-600 text-white border-b border-amber-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium text-center">
            Attenzione: I dati visualizzati sono randomici e utilizzati solo a scopo dimostrativo.{' '}
            <Link to="/login" className="underline font-bold hover:text-amber-100 transition-colors">
              Accedi
            </Link>{' '}
            per salvare i tuoi dati.
          </p>
        </div>
      </div>
    </div>
  );
};
