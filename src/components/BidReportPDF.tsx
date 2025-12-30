import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// --- ESTILOS (CSS DO PDF) ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  brand: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' }, // Azul BidGuard
  meta: { fontSize: 8, color: '#666', textAlign: 'right' },
  
  // SEMÁFORO (O Veredito)
  statusBox: { padding: 15, borderRadius: 5, marginBottom: 15, alignItems: 'center' },
  statusTitle: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  statusValue: { fontSize: 24, fontWeight: 'black' },
  statusDesc: { fontSize: 10, marginTop: 5, textAlign: 'center' },

  // NOTA METODOLÓGICA (Corrigido: Sem emoji para evitar bug de fonte)
  methodologyBox: { 
    marginBottom: 20, 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    backgroundColor: '#F9FAFB', // Cinza muito suave
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  methodologyText: { 
    fontSize: 8, 
    color: '#4B5563', 
    lineHeight: 1.4,
    textAlign: 'left'
  },
  methodologyTitle: {
    fontWeight: 'bold',
    color: '#374151'
  },

  // SEÇÕES
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 15, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 2 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 4 },
  colLabel: { width: '50%', color: '#666' },
  colValue: { width: '50%', textAlign: 'right', fontWeight: 'bold' },

  // TABELA DE AUDITORIA
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9fafb', padding: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tableRow: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  th: { fontSize: 8, fontWeight: 'bold', color: '#444' },
  td: { fontSize: 9 },
  
  // RODAPÉ
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  disclaimerText: { fontSize: 7, color: '#999', textAlign: 'justify', marginBottom: 5 },
  systemSignature: { fontSize: 8, color: '#2563EB', fontWeight: 'bold', textAlign: 'center', marginTop: 5 }
});

// --- HELPER DE FORMATAÇÃO ---
const formatMoney = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// --- COMPONENTE DO DOCUMENTO ---
export const BidReportPDF = ({ data, scope, costs, editedFields, state }: any) => {
  
  // Cores do Semáforo
  const statusColor = 
    data.status === 'DANGER' ? '#FEF2F2' : // Fundo Vermelho Claro
    data.status === 'WARNING' ? '#FEFCE8' : // Fundo Amarelo Claro
    '#F0FDF4'; // Fundo Verde Claro

  const statusTextColor = 
    data.status === 'DANGER' ? '#DC2626' : 
    data.status === 'WARNING' ? '#CA8A04' : 
    '#16A34A';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>BidGuard Audit</Text>
            <Text style={{ fontSize: 9, color: '#666' }}>Relatório de Viabilidade Econômico-Operacional</Text>
          </View>
          <View style={styles.meta}>
            <Text>Data: {new Date().toLocaleDateString()}</Text>
            <Text>Base de Dados: {state} (Ref. ANP/Sindicatos)</Text>
            <Text>ID Auditoria: {Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
          </View>
        </View>

        {/* VEREDITO (SEMÁFORO) */}
        <View style={{ ...styles.statusBox, backgroundColor: statusColor }}>
          <Text style={{ ...styles.statusTitle, color: statusTextColor }}>Nível de Risco Identificado</Text>
          <Text style={{ ...styles.statusValue, color: statusTextColor }}>
            {data.status === 'DANGER' ? 'CRÍTICO ⛔' : data.status === 'WARNING' ? 'ALERTA ⚠️' : 'VIÁVEL ✅'}
          </Text>
          <Text style={{ ...styles.statusDesc, color: statusTextColor }}>
            {data.status === 'DANGER' ? 'Margem projetada insuficiente para cobrir riscos operacionais.' : 
             data.status === 'WARNING' ? 'Margem apertada. Sensível a variações de manutenção.' : 
             'Operação com margem saudável de segurança.'}
          </Text>
        </View>

        {/* NOTA METODOLÓGICA (CORRIGIDA: Sem Emoji) */}
        <View style={styles.methodologyBox}>
          <Text style={styles.methodologyText}>
            <Text style={styles.methodologyTitle}>NOTA METODOLÓGICA (Pior Cenário): </Text>
            Este cálculo não utiliza médias simples. A metodologia considera o topo do intervalo de custos e aplica fatores de stress operacional para proteção do caixa.
          </Text>
        </View>

        {/* RESUMO EXECUTIVO */}
        <Text style={styles.sectionTitle}>1. Resumo da Simulação</Text>
        <View style={styles.row}>
          <Text style={styles.colLabel}>Receita Teto Mensal (Edital)</Text>
          <Text style={styles.colValue}>{formatMoney(scope.revenueCap)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.colLabel}>Custo Operacional Total (Mês)</Text>
          <Text style={{ ...styles.colValue, color: '#DC2626' }}>- {formatMoney(data.totalMonthlyCost)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.colLabel}>Resultado Operacional Projetado</Text>
          <Text style={{ ...styles.colValue, color: data.projectedProfit < 0 ? '#DC2626' : '#16A34A' }}>
            {formatMoney(data.projectedProfit)} ({data.marginPercent.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.colLabel}>Ponto de Equilíbrio (Break-Even)</Text>
          <Text style={styles.colValue}>{formatMoney(data.hourlyCost)} / hora</Text>
        </View>

        {/* AUDITORIA DE PARÂMETROS */}
        <Text style={styles.sectionTitle}>2. Auditoria de Custos (Base x Real)</Text>
        <Text style={{ fontSize: 8, color: '#666', marginBottom: 5 }}>
          Comparativo entre os valores de referência (Banco de Dados) e os valores efetivamente utilizados.
        </Text>
        
        {/* Cabeçalho da Tabela */}
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.th, width: '40%' }}>Item de Custo</Text>
          <Text style={{ ...styles.th, width: '25%', textAlign: 'right' }}>Ref. Sistema ({state})</Text>
          <Text style={{ ...styles.th, width: '25%', textAlign: 'right' }}>Valor Utilizado</Text>
          <Text style={{ ...styles.th, width: '10%', textAlign: 'center' }}>Status</Text>
        </View>

        {/* Linhas da Tabela */}
        {[
          { label: 'Diesel (Litro)', key: 'dieselPrice' },
          { label: 'Salário Base', key: 'operatorSalary' },
          { label: 'Valor Máquina', key: 'machineValue' },
        ].map((row) => {
          const isEdited = editedFields.includes(row.key);
          const sysVal = costs[row.key].system;
          const userVal = costs[row.key].user;
          
          return (
            <View key={row.key} style={styles.tableRow}>
              <Text style={{ ...styles.td, width: '40%' }}>{row.label}</Text>
              <Text style={{ ...styles.td, width: '25%', textAlign: 'right', color: '#666' }}>{formatMoney(sysVal)}</Text>
              <Text style={{ ...styles.td, width: '25%', textAlign: 'right', fontWeight: 'bold' }}>{formatMoney(userVal)}</Text>
              <Text style={{ ...styles.td, width: '10%', textAlign: 'center', fontSize: 8 }}>
                {isEdited ? 'EDITADO' : 'PADRÃO'}
              </Text>
            </View>
          );
        })}

        {/* RODAPÉ E ASSINATURAS */}
        <View style={styles.footer}>
          <Text style={styles.disclaimerText}>
            AVISO LEGAL DE SENSIBILIDADE: Variações relevantes no custo de combustível, índices de manutenção corretiva ou alteração no regime de uso (horas efetivas) podem impactar este resultado.
            Este relatório é uma simulação de viabilidade econômica baseada em parâmetros fornecidos. O BidGuard não garante vitória em licitações nem resultados financeiros futuros. A responsabilidade final pela precificação é exclusivamente da empresa licitante.
          </Text>
          
          <Text style={styles.systemSignature}>
            Relatório gerado automaticamente pelo BidGuard System v1.0 – Metodologia Proprietária de Gestão de Risco.
          </Text>
        </View>
      </Page>
    </Document>
  );
};