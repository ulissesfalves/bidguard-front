import { X, Check, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const UpgradeModal = ({ isOpen, onClose, userEmail }: UpgradeModalProps) => {
  if (!isOpen) return null;

  // Seu link de produção
  const STRIPE_LINK = "https://buy.stripe.com/eVq5kwe1Ja3Q5jRbhO1sQ00";

  const handleUpgrade = () => {
    let url = STRIPE_LINK;
    
    // Adiciona o e-mail na URL para o usuário não precisar digitar de novo no Stripe
    if (userEmail) {
      // Verifica se o link já tem parâmetros (?) ou se é o primeiro
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}prefilled_email=${encodeURIComponent(userEmail)}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-slate-200 scale-100 animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/10 hover:bg-black/40 rounded-full p-1 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Logo variant="light" />
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-blue-500">
                AUDIT
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4">Evite o prejuízo invisível.</h2>
            <p className="text-slate-400 text-sm mt-1">Desbloqueie a auditoria completa e o laudo técnico em PDF.</p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded-full text-green-600 mt-0.5 shrink-0">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="text-sm text-slate-600">
                <strong>Edição de Custos:</strong> Ajuste o valor do Diesel e Salário para a sua realidade local.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded-full text-green-600 mt-0.5 shrink-0">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="text-sm text-slate-600">
                <strong>Relatório Oficial (PDF):</strong> Documento pronto para anexar na defesa técnica da licitação.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded-full text-green-600 mt-0.5 shrink-0">
                <Check size={14} strokeWidth={3} />
              </div>
              <p className="text-sm text-slate-600">
                <strong>Análise de Risco:</strong> Detalhamento do impacto da manutenção severa na margem.
              </p>
            </div>
          </div>

          <button 
            onClick={handleUpgrade}
            className="w-full py-4 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-all hover:scale-[1.02] shadow-lg flex flex-col items-center justify-center gap-0.5"
          >
            <span className="text-lg">Liberar Acesso Audit</span>
            <span className="text-[11px] font-normal opacity-80">R$ 49,90/mês • Cancele assim que baixar o relatório</span>
          </button>
          
          <div className="mt-4 text-center">
             <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
               <ShieldCheck size={12}/> Pagamento seguro via Stripe
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};