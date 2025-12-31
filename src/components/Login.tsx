import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertOctagon, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Alterna entre Login e Criar Conta
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // Fluxo de Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Conta criada! Você já pode entrar.' });
        setIsSignUp(false); // Volta para tela de login
      } else {
        // Fluxo de Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Se der certo, o App.tsx vai detectar a mudança de sessão automaticamente
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao autenticar.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Cabeçalho da Box */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-900/50">
              <AlertOctagon size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">BidGuard System</h1>
          <p className="text-blue-200 text-sm mt-2">Acesso Restrito ao Ambiente de Auditoria</p>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center ${
                message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Criar Conta Grátis' : 'Acessar Sistema')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
              className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              {isSignUp ? 'Já tem uma conta? Faça Login' : 'Não tem acesso? Crie uma conta'}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Lock size={10} /> Conexão Segura e Criptografada
          </p>
        </div>
      </div>
    </div>
  );
};