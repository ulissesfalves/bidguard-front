import { X, CheckCircle2, FileText, ShieldCheck, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string; // Recebe o e-mail para facilitar o checkout
}

export const UpgradeModal = ({ isOpen, onClose, userEmail }: UpgradeModalProps) => {
  if (!isOpen) return null;

  // Seu Link Oficial da Stripe (Atualizado)
  const STRIPE_LINK = "https://buy.stripe.com/eVq5kwe1Ja3Q5jRbhO1sQ00";

  // Função para montar a URL com o e-mail pré-preenchido
  const handleUpgrade = () => {
    let url = STRIPE_LINK;
    
    if (userEmail) {
      // Adiciona o e-mail na URL para o Stripe já saber quem é
      url += `?prefilled_email=${encodeURIComponent(userEmail)}`;
    }
    
    window.open(url, '_blank'); // Abre em nova aba
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Plano PRO
            </h2>
            <p className="text-sm text-slate-500 mt-1">Desbloqueie o poder total da auditoria.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm">Relatório Oficial de Auditoria</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Documento válido juridicamente para defesa de reequilíbrio econômico-financeiro.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incluso no plano:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Download Ilimitado de PDF
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Sem marca d'água
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Suporte Prioritário
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-500 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Liberar Acesso (R$ 29,90/mês)
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3">
              Pagamento processado pela Stripe. Ambiente criptografado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};