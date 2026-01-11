import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Atualiza a senha do usuário logado (a sessão temporária do link mágico)
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setSuccess(true);
      
      // Redireciona para a home após 3 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Senha Alterada!</h2>
          <p className="text-slate-600">Sua senha foi atualizada com sucesso. Você será redirecionado para o sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
        
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Definir Nova Senha</h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          Digite sua nova senha segura abaixo para recuperar o acesso à sua conta.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={20} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="No mínimo 6 caracteres"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Salvando...' : 'Atualizar Senha'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};