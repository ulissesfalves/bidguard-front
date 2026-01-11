import { useState } from 'react';
import { X, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Mantivemos a estrutura de props, assumindo que seu Login.tsx usa isOpen/onClose
interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

// Renomeado para "Login" para não quebrar seus imports antigos
export const Login = ({ isOpen, onClose }: LoginProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Conta criada! Verifique seu e-mail para confirmar.'); 
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose(); // Fecha o modal no sucesso
      } else if (mode === 'reset') {
        // --- NOVA LÓGICA DE RESET ---
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin, // Manda o usuário de volta pro site
        });
        if (error) throw error;
        setMessage('Enviamos um link de recuperação para o seu e-mail!');
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'signin' ? 'Acessar Conta' : 
             mode === 'signup' ? 'Criar Nova Conta' : 
             'Recuperar Senha'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo de Email (Sempre aparece) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Campo de Senha (ESCONDIDO no modo reset) */}
            {mode !== 'reset' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? 'Processando...' : 
               mode === 'signin' ? 'Entrar' : 
               mode === 'signup' ? 'Cadastrar' : 
               'Enviar Link de Recuperação'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Rodapé com links de troca de modo */}
          <div className="mt-6 text-center text-sm space-y-2">
            {mode === 'signin' && (
              <>
                <p className="text-slate-600">
                  Ainda não tem conta?{' '}
                  <button onClick={() => {setMode('signup'); setError(null); setMessage(null)}} className="text-blue-600 font-bold hover:underline">
                    Criar conta grátis
                  </button>
                </p>
                {/* Botão Esqueci Minha Senha */}
                <button onClick={() => {setMode('reset'); setError(null); setMessage(null)}} className="text-slate-400 hover:text-slate-600 text-xs flex items-center justify-center gap-1 mx-auto mt-2">
                  <KeyRound size={12} /> Esqueci minha senha
                </button>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-slate-600">
                Já tem cadastro?{' '}
                <button onClick={() => {setMode('signin'); setError(null); setMessage(null)}} className="text-blue-600 font-bold hover:underline">
                  Fazer Login
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <button onClick={() => {setMode('signin'); setError(null); setMessage(null)}} className="text-blue-600 font-bold hover:underline">
                Voltar para Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};