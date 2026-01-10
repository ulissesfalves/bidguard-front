import { X, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal = ({ isOpen, onClose, onUpgrade }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" /> Desbloqueie o Relatório Oficial
            </h2>
            <p className="text-sm text-slate-500 mt-1">O plano gratuito permite apenas visualização em tela.</p>
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
              <h3 className="font-bold text-blue-900 text-sm">Por que fazer o Upgrade?</h3>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Relatórios em PDF servem como <strong>documento de defesa</strong> em reuniões de diretoria e anexos de licitação. Profissionalize sua entrega.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">O que está incluso no PRO:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Download do PDF de Auditoria sem marcas d'água
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Assinatura digital do sistema (Compliance)
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Histórico de simulações (Em breve)
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <button 
              onClick={onUpgrade}
              className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg shadow-lg hover:bg-green-500 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Liberar Acesso Agora (R$ 29,90)
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3">
              Pagamento único por relatório ou assinatura mensal. Ambiente seguro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};