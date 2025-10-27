import { useState } from 'react';
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
import type { InvestmentConfig } from '../types';
import { calculateInvestmentProjections, formatCurrency, formatPercentage } from '../utils';

interface InvestmentsTabProps {
  config: InvestmentConfig;
  onUpdateConfig: (config: InvestmentConfig) => void;
}

export const InvestmentsTab = ({ config, onUpdateConfig }: InvestmentsTabProps) => {
  const [localConfig, setLocalConfig] = useState(config);

  const projections = calculateInvestmentProjections(localConfig);

  // Prepare chart data
  const chartData = projections.map((month) => ({
    name: `${month.month} ${month.year}`,
    totalInvested: month.totalInvested,
    portfolioValue: month.portfolioValue,
    returns: month.returns,
  }));

  const handleUpdateConfig = () => {
    onUpdateConfig(localConfig);
  };

  const finalMonth = projections[projections.length - 1];
  const totalReturns = finalMonth ? finalMonth.returns : 0;
  const totalInvested = finalMonth ? finalMonth.totalInvested : 0;
  const finalValue = finalMonth ? finalMonth.portfolioValue : 0;
  const roiPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Configuration Form */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Configurazione Investimenti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              💰 Saldo Iniziale (€)
            </label>
            <input
              type="number"
              value={localConfig.initialBalance}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, initialBalance: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              💵 Investimento Mensile (€)
            </label>
            <input
              type="number"
              value={localConfig.monthlyInvestment}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, monthlyInvestment: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📈 ROI Annuo (%)</label>
            <input
              type="number"
              step="0.1"
              value={localConfig.annualROI}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, annualROI: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-400 mt-1">
              ROI mensile: {formatPercentage(localConfig.annualROI / 12)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📅 Anni di Simulazione</label>
            <input
              type="number"
              value={localConfig.yearsToSimulate}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, yearsToSimulate: parseInt(e.target.value) || 1 })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-400 mt-1">
              {localConfig.yearsToSimulate * 12} mesi totali
            </div>
          </div>
        </div>
        <button
          onClick={handleUpdateConfig}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Aggiorna Proiezione
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Capitale Investito</div>
          <div className="text-2xl font-bold text-blue-500">{formatCurrency(totalInvested)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Valore Portafoglio</div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(finalValue)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Rendimento Totale</div>
          <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalReturns)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">ROI %</div>
          <div className="text-2xl font-bold text-yellow-500">
            {formatPercentage(roiPercentage)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Proiezione Portafoglio</h2>
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

            {/* Portfolio value area */}
            <Area
              type="monotone"
              dataKey="portfolioValue"
              fill="#10b981"
              stroke="#10b981"
              fillOpacity={0.3}
              name="Valore Portafoglio"
            />

            {/* Total invested line */}
            <Line
              type="monotone"
              dataKey="totalInvested"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Capitale Investito"
            />

            {/* Returns area */}
            <Area
              type="monotone"
              dataKey="returns"
              fill="#fbbf24"
              stroke="#fbbf24"
              fillOpacity={0.2}
              name="Rendimenti"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table (last 12 months) */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Ultimi 12 Mesi</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4">Mese</th>
                <th className="text-right py-2 px-4">Investito</th>
                <th className="text-right py-2 px-4">Valore Portafoglio</th>
                <th className="text-right py-2 px-4">Rendimenti</th>
              </tr>
            </thead>
            <tbody>
              {projections.slice(-12).map((month, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-4">
                    {month.month} {month.year}
                  </td>
                  <td className="text-right py-2 px-4">{formatCurrency(month.totalInvested)}</td>
                  <td className="text-right py-2 px-4 font-semibold text-green-500">
                    {formatCurrency(month.portfolioValue)}
                  </td>
                  <td className="text-right py-2 px-4 text-yellow-500">
                    {formatCurrency(month.returns)}
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
