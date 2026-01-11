import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import BidCalculator from './components/BidCalculator';
import { Loader2, LogOut } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 1. USUÁRIO LOGADO: Mostra o Produto (Calculadora)
  if (session) {
    return (
      <div className="relative animate-in fade-in duration-500">
        {/* Botão de Logout Flutuante */}
        <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-all bg-white/90 hover:bg-red-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm"
          >
            <LogOut size={14} />
            SAIR
          </button>
        </div>
        
        <BidCalculator />
      </div>
    );
  }

  // 2. USUÁRIO DESLOGADO: Mostra Landing Page + Modal de Login (se ativado)
  return (
    <>
      <LandingPage onStart={() => setShowLogin(true)} />
      
      {/* O Login agora é um Modal que abre por cima da Landing Page */}
      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
}

export default App;