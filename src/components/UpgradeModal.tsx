import { X, FileText, ShieldCheck, Zap, Lock } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const UpgradeModal = ({ isOpen, onClose, userEmail }: UpgradeModalProps) => {
  if (!isOpen) return null;

  // const STRIPE_LINK = "https://buy.stripe.com/test_8x27sE0aL6Q07n38mgebu00";
  const STRIPE_LINK = "https://buy.stripe.com/test_eVq5kwe1Ja3Q5jRbhO1sQ00";
  const handleUpgrade = () => {
    let url = STRIPE_LINK;
    if (userEmail) {
      url += `?prefilled_email=${encodeURIComponent(userEmail)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Cabeçalho Premium */}
        <div className="bg-slate-900 p-6 flex justify-between items-start border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Recomendado</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              BidGuard <span className="text-yellow-400">PRO</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">Ferramentas de auditoria para quem joga sério.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Corpo da Oferta */}
        <div className="p-8 space-y-8">
          
          {/* O Preço */}
          <div className="text-center">
            <div className="flex items-end justify-center gap-1 text-slate-900">
              <span className="text-4xl font-black">R$ 49,90</span>
              <span className="text-lg text-slate-500 font-medium mb-1">/mês</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Cancele quando quiser. Sem fidelidade.</p>
          </div>

          {/* Benefícios Visuais */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                <FileText className="text-blue-600" size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Relatórios Oficiais (PDF)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Gere documentos ilimitados com validade técnica para anexar em processos licitatórios.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                <ShieldCheck className="text-green-600" size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Auditoria de Combustível (ANP)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Acesso exclusivo à base de dados semanal ponderada para cálculo de defasagem.</p>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="pt-2 space-y-3">
            <button 
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" /> Assinar Agora
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <Lock size={10} /> Pagamento seguro via Stripe • Acesso liberado imediatamente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};