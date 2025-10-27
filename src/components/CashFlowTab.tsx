import { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { CashFlowData, MonthData } from '../types'
import { formatCurrency, CATEGORY_COLORS, generateId, calculateCumulativeCapital } from '../utils'

interface CashFlowTabProps {
  data: CashFlowData
  onUpdateData: (data: CashFlowData) => void
}

export const CashFlowTab = ({ data, onUpdateData }: CashFlowTabProps) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0)
  const [newExpenseCategory, setNewExpenseCategory] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')

  const selectedMonth = data.months[selectedMonthIndex]

  // Prepare chart data
  const chartData = data.months.map((month) => {
    const totalExpenses = month.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const expensesByCategory = month.expenses.reduce((acc, exp) => {
      acc[exp.category] = exp.amount
      return acc
    }, {} as Record<string, number>)

    return {
      name: `${month.month} ${month.year}`,
      ...expensesByCategory,
      netSalary: month.netSalary,
      grossSalary: month.grossSalary,
      cumulativeCapital: month.cumulativeCapital,
      totalExpenses
    }
  })

  // Get all unique categories
  const allCategories = Array.from(
    new Set(data.months.flatMap((m) => m.expenses.map((e) => e.category)))
  )

  const handleAddExpense = () => {
    if (!newExpenseCategory || !newExpenseAmount) return

    const amount = parseFloat(newExpenseAmount)
    if (isNaN(amount) || amount <= 0) return

    const updatedMonths = [...data.months]
    const colorIndex = updatedMonths[selectedMonthIndex].expenses.length % CATEGORY_COLORS.length

    updatedMonths[selectedMonthIndex] = {
      ...updatedMonths[selectedMonthIndex],
      expenses: [
        ...updatedMonths[selectedMonthIndex].expenses,
        {
          id: generateId(),
          category: newExpenseCategory,
          amount,
          color: CATEGORY_COLORS[colorIndex]
        }
      ]
    }

    const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
    onUpdateData({ ...data, months: recalculated })

    setNewExpenseCategory('')
    setNewExpenseAmount('')
  }

  const handleRemoveExpense = (expenseId: string) => {
    const updatedMonths = [...data.months]
    updatedMonths[selectedMonthIndex] = {
      ...updatedMonths[selectedMonthIndex],
      expenses: updatedMonths[selectedMonthIndex].expenses.filter((e) => e.id !== expenseId)
    }

    const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
    onUpdateData({ ...data, months: recalculated })
  }

  const handleUpdateExpense = (expenseId: string, amount: number) => {
    const updatedMonths = [...data.months]
    const expenseIndex = updatedMonths[selectedMonthIndex].expenses.findIndex(
      (e) => e.id === expenseId
    )

    if (expenseIndex !== -1) {
      updatedMonths[selectedMonthIndex].expenses[expenseIndex].amount = amount
      const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
      onUpdateData({ ...data, months: recalculated })
    }
  }

  const handleUpdateSalary = (type: 'net' | 'gross', value: number) => {
    const updatedMonths = [...data.months]
    if (type === 'net') {
      updatedMonths[selectedMonthIndex].netSalary = value
    } else {
      updatedMonths[selectedMonthIndex].grossSalary = value
    }

    const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
    onUpdateData({ ...data, months: recalculated })
  }

  const handleAddMonth = () => {
    const lastMonth = data.months[data.months.length - 1]
    const newMonthIndex = data.months.length % 12
    const newYear = lastMonth.year + Math.floor(data.months.length / 12)

    const newMonth: MonthData = {
      month: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'][
        newMonthIndex
      ],
      year: newYear,
      netSalary: lastMonth.netSalary,
      grossSalary: lastMonth.grossSalary,
      expenses: lastMonth.expenses.map((exp) => ({ ...exp, id: generateId() })),
      cumulativeCapital: 0
    }

    const updatedMonths = [...data.months, newMonth]
    const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
    onUpdateData({ ...data, months: recalculated })
  }

  const handleRemoveMonth = () => {
    if (data.months.length <= 1) return

    const updatedMonths = data.months.slice(0, -1)
    const recalculated = calculateCumulativeCapital(updatedMonths, data.initialCapital)
    onUpdateData({ ...data, months: recalculated })

    if (selectedMonthIndex >= updatedMonths.length) {
      setSelectedMonthIndex(updatedMonths.length - 1)
    }
  }

  const totalExpenses = selectedMonth.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const monthlyBalance = selectedMonth.netSalary - totalExpenses

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Andamento Capitale</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />

            {/* Cumulative capital area */}
            <Area
              type="monotone"
              dataKey="cumulativeCapital"
              fill="#10b981"
              stroke="#10b981"
              fillOpacity={0.3}
              name="Capitale Cumulativo"
            />

            {/* Stacked expenses bars */}
            {allCategories.map((category, index) => {
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
              return (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="expenses"
                  fill={color}
                  name={category}
                />
              )
            })}

            {/* Salary lines */}
            <Line
              type="monotone"
              dataKey="grossSalary"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Stipendio Lordo"
            />
            <Line
              type="monotone"
              dataKey="netSalary"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Stipendio Netto"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between gap-4 bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedMonthIndex(Math.max(0, selectedMonthIndex - 1))}
            disabled={selectedMonthIndex === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ← Prec
          </button>
          <div className="text-xl font-bold">
            {selectedMonth.month} {selectedMonth.year}
          </div>
          <button
            onClick={() =>
              setSelectedMonthIndex(Math.min(data.months.length - 1, selectedMonthIndex + 1))
            }
            disabled={selectedMonthIndex === data.months.length - 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Succ →
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddMonth}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            + Aggiungi Mese
          </button>
          <button
            onClick={handleRemoveMonth}
            disabled={data.months.length <= 1}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            - Rimuovi Mese
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Spese Totali Mese</div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Bilancio Mensile</div>
          <div
            className={`text-2xl font-bold ${
              monthlyBalance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {formatCurrency(monthlyBalance)}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Capitale Cumulativo</div>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(selectedMonth.cumulativeCapital)}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-6">
        <h3 className="text-xl font-bold">Modifica Dati Mese</h3>

        {/* Salaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Netto (€)</label>
            <input
              type="number"
              value={selectedMonth.netSalary}
              onChange={(e) => handleUpdateSalary('net', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Lordo (€)</label>
            <input
              type="number"
              value={selectedMonth.grossSalary}
              onChange={(e) => handleUpdateSalary('gross', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Expenses List */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Spese</h4>
          <div className="space-y-2">
            {selectedMonth.expenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: expense.color }}></div>
                <div className="flex-1">
                  <div className="font-medium">{expense.category}</div>
                </div>
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => handleUpdateExpense(expense.id, parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Rimuovi
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Expense */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Aggiungi Spesa</h4>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Categoria (es. Palestra)"
              value={newExpenseCategory}
              onChange={(e) => setNewExpenseCategory(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Importo (€)"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-40 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddExpense}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
