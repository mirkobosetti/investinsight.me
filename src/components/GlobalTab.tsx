import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CashFlowData, InvestmentConfig, GlobalMonth } from '../types';
import { calculateInvestmentProjections, formatCurrency } from '../utils';

interface GlobalTabProps {
  cashFlowData: CashFlowData;
  investmentConfig: InvestmentConfig;
}

export const GlobalTab = ({ cashFlowData, investmentConfig }: GlobalTabProps) => {
  // Calculate investment projections
  const investmentProjections = calculateInvestmentProjections(
    investmentConfig,
    cashFlowData.months[0]?.year || 2025
  );

  // Combine cash flow and investment data
  const globalData: GlobalMonth[] = [];
  const maxMonths = Math.max(cashFlowData.months.length, investmentProjections.length);

  for (let i = 0; i < maxMonths; i++) {
    const cashFlowMonth = cashFlowData.months[i];
    const investmentMonth = investmentProjections[i];

    // If we have cash flow data for this month
    const liquidCapital = cashFlowMonth?.cumulativeCapital || 0;

    // If we have investment data for this month
    const investedCapital = investmentMonth?.portfolioValue || 0;

    const totalWealth = liquidCapital + investedCapital;

    globalData.push({
      month: cashFlowMonth?.month || investmentMonth?.month || '',
      year: cashFlowMonth?.year || investmentMonth?.year || 2025,
      liquidCapital,
      investedCapital,
      totalWealth,
    });
  }

  // Prepare chart data
  const chartData = globalData.map((month) => ({
    name: `${month.month} ${month.year}`,
    liquidCapital: month.liquidCapital,
    investedCapital: month.investedCapital,
    totalWealth: month.totalWealth,
  }));

  const finalMonth = globalData[globalData.length - 1];
  const finalLiquidCapital = finalMonth?.liquidCapital || 0;
  const finalInvestedCapital = finalMonth?.investedCapital || 0;
  const finalTotalWealth = finalMonth?.totalWealth || 0;

  const liquidPercentage = finalTotalWealth > 0 ? (finalLiquidCapital / finalTotalWealth) * 100 : 0;
  const investedPercentage = finalTotalWealth > 0 ? (finalInvestedCapital / finalTotalWealth) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Capitale Liquido</div>
          <div className="text-2xl font-bold text-blue-500">{formatCurrency(finalLiquidCapital)}</div>
          <div className="text-xs text-gray-400 mt-1">{liquidPercentage.toFixed(1)}% del totale</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Capitale Investito</div>
          <div className="text-2xl font-bold text-purple-500">
            {formatCurrency(finalInvestedCapital)}
          </div>
          <div className="text-xs text-gray-400 mt-1">{investedPercentage.toFixed(1)}% del totale</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Patrimonio Totale</div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(finalTotalWealth)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Diversificazione</div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Liquido:</span>
              <span className="font-semibold">{liquidPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Investito:</span>
              <span className="font-semibold">{investedPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Simulazione Globale Patrimonio</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="name"
              stroke="#fff"
              interval={Math.floor(chartData.length / 12)}
            />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />

            {/* Total wealth area */}
            <Area
              type="monotone"
              dataKey="totalWealth"
              fill="#10b981"
              stroke="#10b981"
              fillOpacity={0.2}
              name="Patrimonio Totale"
              strokeWidth={3}
            />

            {/* Liquid capital line */}
            <Line
              type="monotone"
              dataKey="liquidCapital"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Capitale Liquido"
            />

            {/* Invested capital line */}
            <Line
              type="monotone"
              dataKey="investedCapital"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              name="Capitale Investito"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Analisi e Consigli</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold">Diversificazione del Portafoglio</div>
              <div className="text-gray-400">
                {liquidPercentage > 70
                  ? 'Hai una grande percentuale di capitale liquido. Considera di investire di più per far crescere il tuo patrimonio.'
                  : investedPercentage > 80
                  ? 'La maggior parte del tuo capitale è investito. Assicurati di avere un fondo di emergenza sufficiente.'
                  : 'La tua diversificazione tra capitale liquido e investito è bilanciata.'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <div className="font-semibold">Crescita Prevista</div>
              <div className="text-gray-400">
                Con un investimento mensile di {formatCurrency(investmentConfig.monthlyInvestment)} e
                un ROI annuo del {investmentConfig.annualROI}%, il tuo portafoglio potrebbe raggiungere{' '}
                {formatCurrency(finalInvestedCapital)} in {investmentConfig.yearsToSimulate} anni.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-semibold">Obiettivo di Patrimonio</div>
              <div className="text-gray-400">
                Il tuo patrimonio totale previsto tra {investmentConfig.yearsToSimulate} anni è di{' '}
                {formatCurrency(finalTotalWealth)}, combinando capitale liquido e investimenti.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table (yearly summary) */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Riepilogo Annuale</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">Anno</th>
                <th className="text-right py-2 px-4">Capitale Liquido</th>
                <th className="text-right py-2 px-4">Capitale Investito</th>
                <th className="text-right py-2 px-4">Patrimonio Totale</th>
              </tr>
            </thead>
            <tbody>
              {globalData
                .filter((_, index) => index % 12 === 11 || index === globalData.length - 1)
                .map((month, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-2 px-4">{month.year}</td>
                    <td className="text-right py-2 px-4 text-blue-500">
                      {formatCurrency(month.liquidCapital)}
                    </td>
                    <td className="text-right py-2 px-4 text-purple-500">
                      {formatCurrency(month.investedCapital)}
                    </td>
                    <td className="text-right py-2 px-4 font-semibold text-green-500">
                      {formatCurrency(month.totalWealth)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
