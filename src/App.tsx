import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import BidCalculator from './components/BidCalculator';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Verifica sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuta mudanças (Login, Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tela de Carregamento Inicial (enquanto verifica se está logado)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Se não tem sessão, manda pro Login
  if (!session) {
    return <Login />;
  }

  // Se tem sessão, mostra o BidGuard com botão de Sair
  return (
    <div className="relative">
      {/* Botão de Logout Discreto no Topo */}
      <div className="absolute top-4 right-4 z-50 md:top-8 md:right-8">
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm"
        >
          Sair do Sistema
        </button>
      </div>
      
      <BidCalculator />
    </div>
  );
}

export default App;