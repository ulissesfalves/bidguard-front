import { AlertOctagon, ArrowRight, ShieldCheck, Fuel, Wrench, FileWarning } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage = ({ onStart }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="text-blue-600" size={28} />
          <span className="text-xl font-bold tracking-tight">BidGuard</span>
        </div>
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
            Ganhar licitação com prejuízo <span className="text-blue-600">quebra empresa.</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            O BidGuard calcula o custo real da operação e mostra, com números, se o edital vai dar lucro ou prejuízo — antes de você assinar o contrato.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Simular Viabilidade Grátis <ArrowRight size={20} />
            </button>
          </div>
          
          <p className="text-xs text-slate-400 mt-4">
            * Baseado em índices oficiais da ANP, FIPE e Sindicatos.
          </p>
        </div>

        {/* HERO IMAGE (MOCKUP CONCEITUAL) */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 rounded-full"></div>
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Simulando a interface do sistema */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="h-2 w-24 bg-slate-200 rounded"></div>
                <div className="h-2 w-32 bg-slate-200 rounded"></div>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">VIÁVEL ✅</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded border border-slate-100">
                <span className="text-sm font-medium text-slate-500">Receita Edital</span>
                <span className="font-mono font-bold">R$ 45.000,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100">
                <span className="text-sm font-medium text-red-700">Custo Real (BidGuard)</span>
                <span className="font-mono font-bold text-red-700">- R$ 38.450,00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-900">Margem Projetada</span>
                <span className="font-mono font-bold text-green-600 text-xl">14.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION (OS SABOTADORES) */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">
            Os 3 Sabotadores de Margem que o Excel esconde
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Fuel className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">O Diesel da Bomba</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                O edital estima o diesel a R$ 5,80. A bomba cobra R$ 6,30. O BidGuard atualiza esse custo automaticamente pela tabela ANP do estado.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Wrench className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">Manutenção Severa</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Terraplanagem gasta 40% mais pneu que limpeza de pátio. Nosso algoritmo ajusta o custo de manutenção baseado no nível de exigência.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-3">Risco Trabalhista</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Um processo trabalhista leva o lucro de 12 meses. Calculamos os encargos reais e provisionamento para blindar seu caixa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF (DADOS) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
            Auditoria baseada em dados oficiais de mercado
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos representativos em texto estilizado para MVP */}
            <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="bg-yellow-400 h-6 w-6 block rounded-full"></span> ANP
            </div>
            <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="bg-blue-800 h-6 w-6 block rounded"></span> FIPE
            </div>
            <div className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="bg-green-600 h-6 w-6 block rounded-tr-xl"></span> SINDICATOS
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-slate-900 py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pare de chutar. Comece a auditar.
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Junte-se a gestores de frota e engenheiros que pararam de perder dinheiro em contratos mal precificados.
        </p>
        <button 
          onClick={onStart}
          className="px-10 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-500 transition-all"
        >
          Criar Conta Grátis
        </button>
      </section>

      {/* COPYRIGHT */}
      <footer className="bg-slate-950 py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>&copy; {new Date().getFullYear()} BidGuard System. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};