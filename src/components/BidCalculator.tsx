import { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Lock, Calculator, FileText, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BidReportPDF } from './BidReportPDF';
import { UpgradeModal } from './UpgradeModal';
import { Logo } from './Logo';

// --- UTILITÁRIOS ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// --- TIPAGEM ---
type EditableCostKey = 'dieselPrice' | 'operatorSalary' | 'machineValue';

export const BidCalculator = () => {
  // --- ESTADO (State) ---
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('SP');
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Verifica Status PRO
  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;
      const { data } = await supabase.from('profiles').select('is_pro').eq('email', user.email).single();
      if (data?.is_pro) setIsPro(true);
    };
    checkUserStatus();
  }, []);

  // Escopo (Aberto para todos)
  const [scope, setScope] = useState({
    contractMonths: 12,
    monthlyHours: 200,
    revenueCap: 45000,
    hasOperator: true,
    hasFuel: true,
  });

  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  // Custos (Bloqueados para Free)
  const [costs, setCosts] = useState({
    dieselPrice: { system: 0, user: 0 },
    operatorSalary: { system: 0, user: 0 },
    machineValue: { system: 350000, user: 350000 },
    socialCharges: 0.85,
    consumption: 9.0,
    maintenanceRate: 0.06
  });

  const [editedFields, setEditedFields] = useState<string[]>([]);

  // Busca dados (ANP/FIPE)
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: costParams } = await supabase.from('cost_parameters').select('*').eq('state_uf', selectedState).single();
        const { data: machineSpecs } = await supabase.from('machine_specs').select('*').eq('machine_type', 'Retroescavadeira').single();

        if (costParams && machineSpecs) {
          setCosts(prev => ({
            ...prev,
            dieselPrice: { system: costParams.avg_diesel_price, user: costParams.avg_diesel_price },
            operatorSalary: { system: costParams.operator_base_salary, user: costParams.operator_base_salary },
            socialCharges: costParams.social_charges_percent / 100,
            consumption: machineSpecs.avg_consumption_l_h,
            maintenanceRate: machineSpecs.maintenance_rate_percent / 100
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedState]);

  // Handler de Edição
  const handleCostChange = (field: EditableCostKey, newValue: string) => {
    if (!isPro) return; // Bloqueia edição se não for PRO
    const numericValue = parseFloat(newValue.replace(/[^0-9.]/g, '')) || 0;
    setCosts(prev => ({ ...prev, [field]: { ...prev[field], user: numericValue } }));
    if (!editedFields.includes(field)) setEditedFields(prev => [...prev, field]);
  };

  // --- MOTOR DE CÁLCULO ---
  const calculation = useMemo(() => {
    if (isLoading) return null;
    let maintMult = riskLevel === 'MEDIUM' ? 1.2 : riskLevel === 'HIGH' ? 1.5 : 1.0;
    let fuelMult = riskLevel === 'HIGH' ? 1.1 : 1.0;

    const operatorCost = scope.hasOperator ? costs.operatorSalary.user * (1 + costs.socialCharges) : 0;
    const capitalCostMonthly = (costs.machineValue.user * 0.15) / 12;
    const hourlyFuelCost = costs.dieselPrice.user * costs.consumption * fuelMult;
    const monthlyFuelCost = scope.hasFuel ? hourlyFuelCost * scope.monthlyHours : 0;
    const monthlyMaintenance = ((costs.machineValue.user * costs.maintenanceRate) / 12) * maintMult;

    const totalMonthlyCost = operatorCost + capitalCostMonthly + monthlyFuelCost + monthlyMaintenance;
    const projectedProfit = scope.revenueCap - totalMonthlyCost;
    const marginPercent = (projectedProfit / scope.revenueCap) * 100;

    let status: 'DANGER' | 'WARNING' | 'SAFE' = 'SAFE';
    if (marginPercent < 5) status = 'DANGER';
    else if (marginPercent < 15) status = 'WARNING';

    return { totalMonthlyCost, projectedProfit, marginPercent, status };
  }, [costs, scope, riskLevel, isLoading]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <Logo showBadge={true} />
          <p className="text-sm text-slate-500 mt-1">Auditoria de Custos: Linha Amarela</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-sm rounded-lg p-2 font-medium"
            disabled={isLoading}
          >
            <option value="SP">SP - Base ANP/Sindicato</option>
            <option value="MG">MG - Base ANP/Sindicato</option>
            <option value="PR">PR - Base ANP/Sindicato</option>
          </select>
        </div>
      </header>

      {!isLoading && calculation && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          <div className="md:col-span-7 space-y-6">
            
            {/* CARD 1: ESCOPO (Aberto) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText size={20} className="text-slate-400"/> Dados do Edital
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teto Mensal (R$)</label>
                  <input 
                    type="number" 
                    value={scope.revenueCap}
                    onChange={(e) => setScope({...scope, revenueCap: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horas/Mês</label>
                    <input 
                      type="number" 
                      value={scope.monthlyHours}
                      onChange={(e) => setScope({...scope, monthlyHours: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contrato (Meses)</label>
                    <input 
                      type="number" 
                      value={scope.contractMonths}
                      onChange={(e) => setScope({...scope, contractMonths: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer border p-2 rounded w-full hover:bg-slate-50">
                    <input type="checkbox" checked={scope.hasOperator} onChange={(e) => setScope({...scope, hasOperator: e.target.checked})} />
                    <span className="text-sm">Com Operador</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer border p-2 rounded w-full hover:bg-slate-50">
                    <input type="checkbox" checked={scope.hasFuel} onChange={(e) => setScope({...scope, hasFuel: e.target.checked})} />
                    <span className="text-sm">Com Diesel</span>
                  </label>
                </div>
              </div>
            </section>

            {/* CARD 2: RISCO */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-slate-400"/> Severidade (Desgaste)
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level as any)}
                    className={twMerge(
                      "p-3 rounded-lg border text-sm font-bold transition-all",
                      riskLevel === level ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {level === 'LOW' ? 'Leve' : level === 'MEDIUM' ? 'Médio' : 'Severo'}
                  </button>
                ))}
              </div>
            </section>

            {/* CARD 3: AUDITORIA (BLOQUEADO/BORRADO SE NÃO FOR PRO) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calculator size={20} className="text-slate-400"/> Custos Base (ANP/FIPE)
                </h2>
                {isPro ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Modo Edição Ativo</span>
                ) : (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Lock size={10} /> Padrão Sistema
                  </span>
                )}
              </div>

              {/* OVERLAY DE BLOQUEIO */}
              {!isPro && (
                <div className="absolute inset-0 top-14 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                  <Lock className="text-slate-400 mb-2" size={32} />
                  <h3 className="font-bold text-slate-800">Detalhamento Bloqueado</h3>
                  <p className="text-sm text-slate-600 mb-4 max-w-xs">
                    Estamos usando os custos oficiais (ANP/Sindicato). Para ver o detalhe ou editar, libere o Laudo Técnico.
                  </p>
                  <button onClick={() => setShowUpgradeModal(true)} className="text-sm font-bold text-blue-600 hover:underline">
                    Liberar Acesso Audit &rarr;
                  </button>
                </div>
              )}

              <div className={twMerge("space-y-4", !isPro && "opacity-50 select-none")}>
                {[
                  { key: 'dieselPrice', label: 'Diesel S10 (Litro)' },
                  { key: 'operatorSalary', label: 'Salário Base + Encargos' },
                  { key: 'machineValue', label: 'Valor Máquina (FIPE)' },
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <input
                      type="text"
                      disabled={!isPro}
                      value={formatCurrency(costs[item.key as EditableCostKey].user)}
                      onChange={(e) => handleCostChange(item.key as EditableCostKey, e.target.value)}
                      className="text-right w-32 bg-transparent font-mono text-sm font-bold text-slate-700 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-5">
            <div className="sticky top-6 space-y-4">
              
              {/* RESULTADO (O SUSTO) */}
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                  Resultado da Auditoria
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-sm">Receita</span>
                    <span className="text-lg font-mono">{formatCurrency(scope.revenueCap)}</span>
                  </div>
                  
                  <div className="flex justify-between items-end text-red-300">
                    <span className="text-sm">Custo Real</span>
                    <span className="text-lg font-mono font-bold">
                      - {formatCurrency(calculation.totalMonthlyCost)}
                    </span>
                  </div>

                  <div className="border-t border-slate-700 pt-4 text-center">
                    <span className={clsx("text-sm font-bold uppercase block mb-1", calculation.projectedProfit < 0 ? "text-red-500" : "text-green-400")}>
                      {calculation.projectedProfit < 0 ? "PREJUÍZO MENSAL ESTIMADO" : "LUCRO OPERACIONAL"}
                    </span>
                    <div className={clsx("font-mono font-black", calculation.projectedProfit < 0 ? "text-4xl text-red-500" : "text-3xl text-green-400")}>
                      {formatCurrency(calculation.projectedProfit)}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTÃO CTA */}
              {isPro ? (
                <PDFDownloadLink 
                  document={<BidReportPDF data={calculation} scope={scope} costs={costs} editedFields={editedFields} state={selectedState}/>}
                  fileName="Laudo_Tecnico_BidGuard.pdf"
                  className="w-full"
                >
                  {({ loading }) => (
                    <button disabled={loading} className="w-full py-4 rounded-xl font-bold shadow-lg bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="animate-spin"/> : <FileText size={20}/>}
                      Baixar Laudo Técnico
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-4 rounded-xl font-bold shadow-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 animate-pulse"
                >
                  <Lock size={20}/>
                  Liberar Relatório Técnico
                </button>
              )}

              <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidCalculator;