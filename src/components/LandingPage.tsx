import { ArrowRight, ShieldCheck, Fuel, Wrench, FileWarning } from 'lucide-react';
import { Logo } from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo size="md" /> 
        <button 
          onClick={onStart}
          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          Área do Cliente
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">
            <FileWarning size={14} /> Pare de pagar para trabalhar
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Sua planilha esconde o <span className="text-blue-600">custo real</span> da Linha Amarela.
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            Auditoria de Custos para <strong>Terraplanagem e Pavimentação</strong>. Descubra se o edital paga o Diesel, o Pneu e a Manutenção antes de assinar o contrato.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Fazer Auditoria Grátis <ArrowRight size={20} />
            </button>
          </div>
          
          <p className="text-xs text-slate-400 mt-4">
            * Baseado em índices oficiais da ANP, FIPE e Sindicatos.
          </p>
        </div>

        {/* HERO IMAGE */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 rounded-full"></div>
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Simulando a interface do sistema */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="h-2 w-24 bg-slate-200 rounded"></div>
                <div className="h-2 w-32 bg-slate-200 rounded"></div>
              </div>
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">RISCO CRÍTICO 🚨</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-100">
                <span className="text-sm font-medium text-slate-500">Receita Edital</span>
                <span className="font-mono font-bold">R$ 85.000,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100">
                <span className="text-sm font-medium text-red-700">Custo Real (Audit)</span>
                <span className="font-mono font-bold text-red-700">- R$ 92.450,00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-900">Prejuízo Mensal</span>
                <span className="font-mono font-bold text-red-600 text-xl">- R$ 7.450,00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">
            Os 3 Sabotadores de Margem na Linha Amarela
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Fuel className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">O Diesel da Bomba</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                O edital estima o diesel da tabela ANP Capital. A obra é no interior e a bomba cobra R$ 0,60 a mais. Em 5 máquinas, isso é R$ 20 mil de prejuízo.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Wrench className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">Pneu em Rocha</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sua planilha usa manutenção padrão? Se o solo for rochoso ou abrasivo, o custo de material rodante dobra. O BidGuard ajusta o fator de severidade.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">A Conta não Fecha</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ganhar a licitação é fácil. O difícil é entregar e sobrar dinheiro. Auditamos seus custos antes de você empenhar seu patrimônio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-slate-900 py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pare de chutar. Comece a auditar.
        </h2>
        <button 
          onClick={onStart}
          className="px-10 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-500 transition-all"
        >
          Liberar Relatório Técnico
        </button>
      </section>

      {/* COPYRIGHT */}
      <footer className="bg-slate-950 py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} BidGuard Audit System.</p>
      </footer>
    </div>
  );
};