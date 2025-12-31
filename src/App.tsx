import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage'; // Importe a Landing
import BidCalculator from './components/BidCalculator';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false); // Novo estado para controlar LP vs Login

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

  // LÓGICA DE NAVEGAÇÃO
  
  // 1. Se tem sessão, vai direto pra Calculadora (Produto)
  if (session) {
    return (
      <div className="relative">
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

  // 2. Se não tem sessão e usuário pediu pra logar, mostra Login
  if (showLogin) {
    return (
      <div>
        {/* Botãozinho pra voltar pra Home caso desista */}
        <button 
          onClick={() => setShowLogin(false)}
          className="absolute top-4 left-4 text-sm text-slate-500 hover:text-blue-600 z-50"
        >
          ← Voltar
        </button>
        <Login />
      </div>
    );
  }

  // 3. Se não tem sessão e nem pediu login, mostra Landing Page (Venda)
  return <LandingPage onStart={() => setShowLogin(true)} />;
}

export default App;