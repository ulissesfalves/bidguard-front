import { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Lock, Calculator, FileText, AlertOctagon, Info, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BidReportPDF } from './BidReportPDF';
import { UpgradeModal } from './UpgradeModal'; //

// --- UTILITÁRIOS ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// --- TIPAGEM PARA CORREÇÃO DO BUILD ---
// Define quais campos são objetos complexos {system, user}
type EditableCostKey = 'dieselPrice' | 'operatorSalary' | 'machineValue';

export const BidCalculator = () => {
  // --- ESTADO (State) ---

  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('SP');

  // ESTADO DO FREEMIUM
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, [session]);

  const checkUserStatus = async () => {
      // 1. Garante que pegamos o usuário atual da sessão
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        console.log("❌ Ninguém logado (ou sem e-mail).");
        return;
      }

      console.log("🕵️ Verificando perfil para:", user.email);

      // 2. Tenta buscar no banco
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Traz tudo para checarmos
        .eq('email', user.email)
        .single();

      // 3. Mostra o resultado real no console
      if (error) {
        console.error("🔥 Erro ao buscar no Supabase:", error);
      } else {
        console.log("✅ Dados recebidos do banco:", data);
      }

      // 4. Aplica a lógica
      if (data?.is_pro === true) {
        console.log("🎉 É PRO! Liberando acesso...");
        setIsPro(true);
      } else {
        console.log("🔒 Não é PRO (ou is_pro é false/null).");
      }
    };
 
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [scope, setScope] = useState({
    contractMonths: 12,
    monthlyHours: 200,
    revenueCap: 45000,
    hasOperator: true,
    hasFuel: true,
  });

  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  const [costs, setCosts] = useState({
    dieselPrice: { system: 0, user: 0 },
    operatorSalary: { system: 0, user: 0 },
    machineValue: { system: 350000, user: 350000 },
    socialCharges: 0.85, // Número simples (não editável diretamente no grid)
    consumption: 9.0,    // Número simples
    maintenanceRate: 0.06 // Número simples
  });

  const [editedFields, setEditedFields] = useState<string[]>([]);

  // --- INTEGRAÇÃO ---

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: costParams, error: costError } = await supabase
          .from('cost_parameters')
          .select('*')
          .eq('state_uf', selectedState)
          .single();

        if (costError) throw costError;

        const { data: machineSpecs, error: specError } = await supabase
          .from('machine_specs')
          .select('*')
          .eq('machine_type', 'Retroescavadeira')
          .single();

        if (specError) throw specError;

        setCosts(prev => ({
          ...prev,
          dieselPrice: { 
            system: costParams.avg_diesel_price, 
            user: costParams.avg_diesel_price 
          },
          operatorSalary: { 
            system: costParams.operator_base_salary, 
            user: costParams.operator_base_salary 
          },
          socialCharges: costParams.social_charges_percent / 100,
          consumption: machineSpecs.avg_consumption_l_h,
          maintenanceRate: machineSpecs.maintenance_rate_percent / 100
        }));

        setEditedFields([]);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao conectar com o banco de dados. Verifique o Console.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedState]);

  // --- LÓGICA DE AUDITORIA (CORRIGIDA) ---
  
  // Agora aceita APENAS as chaves que são objetos editáveis
  const handleCostChange = (field: EditableCostKey, newValue: string) => {
    const numericValue = parseFloat(newValue.replace(/[^0-9.]/g, '')) || 0;
    
    setCosts(prev => ({
      ...prev,
      [field]: { ...prev[field], user: numericValue }
    }));

    if (!editedFields.includes(field)) {
      setEditedFields(prev => [...prev, field]);
    }
  };

  // --- MOTOR DE CÁLCULO ---
  
  const calculation = useMemo(() => {
    if (isLoading) return null;

    let maintMult = 1.0;
    let fuelMult = 1.0;

    if (riskLevel === 'MEDIUM') {
      maintMult = 1.2; 
    } else if (riskLevel === 'HIGH') {
      maintMult = 1.5; 
      fuelMult = 1.1;  
    }

    const operatorCost = scope.hasOperator 
      ? costs.operatorSalary.user * (1 + costs.socialCharges)
      : 0;

    const capitalCostMonthly = (costs.machineValue.user * 0.15) / 12;

    const hourlyFuelCost = costs.dieselPrice.user * costs.consumption * fuelMult;
    const monthlyFuelCost = scope.hasFuel 
      ? hourlyFuelCost * scope.monthlyHours
      : 0;

    const monthlyMaintenance = ((costs.machineValue.user * costs.maintenanceRate) / 12) * maintMult;

    const totalMonthlyCost = operatorCost + capitalCostMonthly + monthlyFuelCost + monthlyMaintenance;
    const hourlyCost = totalMonthlyCost / (scope.monthlyHours || 1); 

    const monthlyRevenue = scope.revenueCap; 
    const projectedProfit = monthlyRevenue - totalMonthlyCost;
    const marginPercent = (projectedProfit / monthlyRevenue) * 100;

    let status: 'DANGER' | 'WARNING' | 'SAFE' = 'SAFE';
    if (marginPercent < 5) status = 'DANGER';
    else if (marginPercent < 15) status = 'WARNING';

    return {
      totalMonthlyCost,
      hourlyCost,
      projectedProfit,
      marginPercent,
      status
    };
  }, [costs, scope, riskLevel, isLoading]);

  // --- RENDERIZAÇÃO ---

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      
      {/* CABEÇALHO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="text-blue-600" /> BidGuard <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">LIVE</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Análise de Viabilidade Econômico-Operacional</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-sm rounded-lg p-2 font-medium cursor-pointer hover:bg-slate-200 transition-colors"
            disabled={isLoading}
          >
            <option value="SP">SP - São Paulo</option>
            <option value="MG">MG - Minas Gerais</option>
            <option value="PR">PR - Paraná</option>
          </select>
          <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            {isLoading ? <Loader2 size={12} className="animate-spin"/> : <Info size={12}/>} 
            {isLoading ? 'Atualizando custos...' : 'Dados reais carregados'}
          </span>
        </div>
      </header>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Consultando Banco de Dados em Tempo Real...</p>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      {!isLoading && calculation && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500">
          
          <div className="md:col-span-7 space-y-6">
            
            {/* CARD 1: ESCOPO */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText size={20} className="text-slate-400"/> Escopo do Edital
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor Teto Mensal (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">R$</span>
                    <input 
                      type="number" 
                      value={scope.revenueCap}
                      onChange={(e) => setScope({...scope, revenueCap: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-2 bg-yellow-50 text-yellow-800 text-xs p-2 rounded border border-yellow-200 flex items-start gap-2">
                    <Lock size={12} className="mt-0.5 shrink-0"/>
                    Este valor limita sua receita máxima. O cálculo assume que não haverá aditivos.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Franquia de Horas</label>
                    <input 
                      type="number" 
                      value={scope.monthlyHours}
                      onChange={(e) => setScope({...scope, monthlyHours: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duração (Meses)</label>
                    <input 
                      type="number" 
                      value={scope.contractMonths}
                      onChange={(e) => setScope({...scope, contractMonths: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-slate-50 w-full">
                    <input 
                      type="checkbox" 
                      checked={scope.hasOperator}
                      onChange={(e) => setScope({...scope, hasOperator: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">Inclui Operador</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-slate-50 w-full">
                    <input 
                      type="checkbox" 
                      checked={scope.hasFuel}
                      onChange={(e) => setScope({...scope, hasFuel: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">Inclui Diesel</span>
                  </label>
                </div>
              </div>
            </section>

            {/* CARD 2: RISCO */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-slate-400"/> Nível de Exigência
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'LOW', label: 'Baixa', desc: 'Limpeza, Pátio', color: 'border-slate-200 hover:border-blue-300' },
                  { id: 'MEDIUM', label: 'Média', desc: 'Obra Civil, Terraplanagem', color: 'border-slate-200 hover:border-yellow-300' },
                  { id: 'HIGH', label: 'Alta', desc: 'Pedreira, 24h, Demolição', color: 'border-red-200 bg-red-50' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setRiskLevel(level.id as any)}
                    className={twMerge(
                      "p-3 rounded-lg border-2 text-left transition-all",
                      riskLevel === level.id 
                        ? (level.id === 'HIGH' ? 'border-red-500 bg-red-100 ring-1 ring-red-500' : 'border-blue-500 bg-blue-50 ring-1 ring-blue-500')
                        : level.color
                    )}
                  >
                    <div className="font-bold text-sm">{level.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* CARD 3: AUDITORIA */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calculator size={20} className="text-slate-400"/> Auditoria de Custos
                </h2>
                {editedFields.length > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                    {editedFields.length} parâmetro(s) ajustado(s)
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {[
                  { key: 'dieselPrice', label: 'Preço Diesel (L)' },
                  { key: 'operatorSalary', label: 'Salário Base (Mês)' },
                  { key: 'machineValue', label: 'Valor Máquina (FIPE)' },
                ].map((item) => {
                  const key = item.key as EditableCostKey; // Type Casting Seguro
                  const isEdited = editedFields.includes(key);
                  const sysVal = costs[key].system;
                  const userVal = costs[key].user;

                  return (
                    <div key={key} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 text-sm text-slate-600 font-medium">{item.label}</div>
                      
                      <div className="col-span-3 text-right pr-4 text-xs text-slate-400 border-r border-slate-100 relative group cursor-help">
                        {isEdited && <span className="line-through">{formatCurrency(sysVal)}</span>}
                        {!isEdited && <span>{formatCurrency(sysVal)}</span>}
                        <span className="hidden group-hover:block absolute bottom-full left-0 bg-slate-800 text-white p-1 text-[10px] rounded mb-1 whitespace-nowrap">
                          Valor vindo do Banco de Dados ({selectedState})
                        </span>
                      </div>

                      <div className="col-span-4 relative">
                        <input
                          type="number"
                          value={userVal}
                          onChange={(e) => handleCostChange(key, e.target.value)}
                          className={twMerge(
                            "w-full text-right py-1.5 px-3 rounded border text-sm focus:ring-2 transition-all font-mono",
                            isEdited 
                              ? "bg-yellow-50 border-yellow-300 text-yellow-900 focus:ring-yellow-500" 
                              : "bg-slate-50 border-slate-200 text-slate-600 focus:ring-blue-500"
                          )}
                        />
                        <div className="absolute right-8 top-2 text-slate-400 pointer-events-none">
                          {isEdited ? <FileText size={12}/> : <Lock size={12}/>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="md:col-span-5">
            <div className="sticky top-6 space-y-4">
              <div className={twMerge(
                "p-6 rounded-xl border-2 text-center shadow-lg transition-all",
                calculation.status === 'DANGER' ? "bg-red-50 border-red-500 text-red-900" :
                calculation.status === 'WARNING' ? "bg-yellow-50 border-yellow-400 text-yellow-900" :
                "bg-green-50 border-green-500 text-green-900"
              )}>
                <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
                  Nível de Risco
                </div>
                <div className="text-3xl font-black mb-1">
                  {calculation.status === 'DANGER' ? "CRÍTICO" :
                   calculation.status === 'WARNING' ? "ALERTA" :
                   "VIÁVEL"}
                </div>
                <p className="text-sm px-4 opacity-90">
                  {calculation.status === 'DANGER' ? "Margem perigosa. Risco real de pagar para trabalhar." :
                   calculation.status === 'WARNING' ? "Margem apertada. Qualquer quebra gera prejuízo." :
                   "Margem saudável. Cobre imprevistos operacionais."}
                </p>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
                  Simulação Financeira (Mês)
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-sm">Receita Teto</span>
                    <span className="text-lg font-mono">{formatCurrency(scope.revenueCap)}</span>
                  </div>
                  
                  <div className="flex justify-between items-end text-red-300">
                    <span className="text-sm flex items-center gap-1">
                      Custo Estimado <Info size={12}/>
                    </span>
                    <span className="text-lg font-mono font-bold">
                      - {formatCurrency(calculation.totalMonthlyCost)}
                    </span>
                  </div>

                  <div className="border-t border-slate-700 pt-3 flex justify-between items-end">
                    <span className={clsx("text-sm font-bold", calculation.projectedProfit < 0 ? "text-red-500" : "text-green-400")}>
                      Resultado Operacional
                    </span>
                    <div className="text-right">
                      <div className={clsx("text-2xl font-mono font-black", calculation.projectedProfit < 0 ? "text-red-500" : "text-green-400")}>
                        {formatCurrency(calculation.projectedProfit)}
                      </div>
                      <div className="text-xs text-slate-500">
                        Margem: {calculation.marginPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">Custo Break-Even / Hora</span>
                <div className="text-xl font-mono text-slate-700 font-bold mt-1">
                  {formatCurrency(calculation.hourlyCost)}
                </div>
              </div>

              {/* CTA INTELIGENTE COM FREEMIUM LOCK */}
              {calculation.status === 'DANGER' ? (
                <button disabled className="w-full py-4 rounded-xl font-bold bg-slate-200 text-slate-500 cursor-not-allowed flex items-center justify-center gap-2">
                  <FileText size={20}/>
                  Risco Crítico: Relatório Bloqueado
                </button>
              ) : isPro ? (
                // USUÁRIO PRO: Baixa direto
                <PDFDownloadLink 
                  document={
                    <BidReportPDF 
                      data={calculation} 
                      scope={scope} 
                      costs={costs} 
                      editedFields={editedFields} 
                      state={selectedState}
                    />
                  }
                  fileName={`BidGuard_Analise_${selectedState}_${new Date().toISOString().split('T')[0]}.pdf`}
                  className="w-full"
                >
                  {({ loading }) => (
                    <button 
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin"/> : <FileText size={20}/>}
                      {loading ? 'Gerando Documento...' : 'Baixar Relatório Oficial (PRO)'}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                // USUÁRIO GRÁTIS: Abre Modal de Venda
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Lock size={20} className="text-yellow-400"/>
                  Desbloquear Relatório de Defesa
                </button>
              )}

              {/* MODAL DE UPGRADE */}
              <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)}
                // onUpgrade={() => alert("Aqui vamos integrar o Checkout (Stripe/Pix) em breve!")}
              />

              <p className="text-[10px] text-center text-slate-400 px-4">
                Esta análise é uma simulação baseada em parâmetros informados. O resultado indica nível de risco, não garantia de lucro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidCalculator;