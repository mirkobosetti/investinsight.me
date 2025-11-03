import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
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
import { formatCurrency, generateId, sortMonthsChronologically, formatMonthDisplay, getFullMonthName } from '../utils'
import { useCategories } from '../hooks/useCategories'
import { Button } from '@/components/ui/button'

interface CashFlowTabProps {
  cashFlowData: CashFlowData
  onAddMonth: (month: MonthData) => Promise<void>
  onUpdateMonth: (monthId: string, updates: Partial<MonthData>) => Promise<void>
  onDeleteMonth: (monthId: string) => Promise<void>
}

export const CashFlowTab = ({ cashFlowData, onAddMonth, onUpdateMonth, onDeleteMonth }: CashFlowTabProps) => {
  const { categories, getCategoryByName } = useCategories()

  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(
    cashFlowData.months.length > 0 ? cashFlowData.months[0].id : null
  )
  const [newExpenseCategory, setNewExpenseCategory] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')

  // New month form
  const [newMonthYear, setNewMonthYear] = useState(new Date().getFullYear())
  const [newMonthMonth, setNewMonthMonth] = useState(new Date().getMonth())
  const [newMonthNetSalary, setNewMonthNetSalary] = useState(0)
  const [newMonthGrossSalary, setNewMonthGrossSalary] = useState(0)

  // Update selected month when data changes
  useEffect(() => {
    if (cashFlowData.months.length > 0 && !selectedMonthId) {
      setSelectedMonthId(cashFlowData.months[0].id)
    }
  }, [cashFlowData.months, selectedMonthId])

  // Sort months chronologically for display
  const sortedMonths = sortMonthsChronologically(cashFlowData.months)
  const selectedMonth = sortedMonths.find(m => m.id === selectedMonthId) || sortedMonths[0]
  const selectedMonthIndex = sortedMonths.findIndex(m => m.id === selectedMonthId)

  // Prepare chart data (use sorted months)
  const chartData = sortedMonths.map((month) => {
    const totalExpenses = month.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const expensesByCategory = month.expenses.reduce((acc, exp) => {
      acc[exp.category] = exp.amount
      return acc
    }, {} as Record<string, number>)

    return {
      name: formatMonthDisplay(month.month, month.year),
      ...expensesByCategory,
      netSalary: month.netSalary,
      grossSalary: month.grossSalary,
      cumulativeCapital: month.cumulativeCapital,
      totalExpenses
    }
  })

  // Get all unique categories from the data
  const allCategoriesInData = Array.from(
    new Set(cashFlowData.months.flatMap((m) => m.expenses.map((e) => e.category)))
  )

  // Map them to their colors from the store
  const categoryColorMap = new Map(categories.map(cat => [cat.name, cat.color]))

  const handleAddMonth = async () => {
    // Check if month already exists
    const monthExists = cashFlowData.months.some(
      m => m.month === newMonthMonth && m.year === newMonthYear
    )

    if (monthExists) {
      alert(`Il mese ${getFullMonthName(newMonthMonth)} ${newMonthYear} esiste già!`)
      return
    }

    const newMonth: MonthData = {
      id: generateId(),
      month: newMonthMonth,
      year: newMonthYear,
      netSalary: newMonthNetSalary,
      grossSalary: newMonthGrossSalary,
      expenses: [],
      cumulativeCapital: 0
    }

    await onAddMonth(newMonth)

    // Select the newly added month
    setSelectedMonthId(newMonth.id)

    // Reset form
    setNewMonthNetSalary(0)
    setNewMonthGrossSalary(0)
  }

  const handleAddExpense = async () => {
    if (!selectedMonth || !newExpenseCategory || !newExpenseAmount) return

    const amount = parseFloat(newExpenseAmount)
    if (isNaN(amount) || amount <= 0) return

    // Get category from store to use its color
    const category = getCategoryByName(newExpenseCategory)
    if (!category) {
      alert('Categoria non trovata. Vai al tab Categorie per crearla.')
      return
    }

    const newExpense = {
      id: generateId(),
      category: category.name,
      amount,
      color: category.color
    }

    await onUpdateMonth(selectedMonth.id, {
      expenses: [...selectedMonth.expenses, newExpense]
    })

    setNewExpenseCategory('')
    setNewExpenseAmount('')
  }

  const handleRemoveExpense = async (expenseId: string) => {
    if (!selectedMonth) return

    const updatedExpenses = selectedMonth.expenses.filter((e) => e.id !== expenseId)
    await onUpdateMonth(selectedMonth.id, { expenses: updatedExpenses })
  }

  const handleUpdateExpense = async (expenseId: string, amount: number) => {
    if (!selectedMonth) return

    const updatedExpenses = selectedMonth.expenses.map(exp =>
      exp.id === expenseId ? { ...exp, amount } : exp
    )
    await onUpdateMonth(selectedMonth.id, { expenses: updatedExpenses })
  }

  const handleUpdateSalary = async (type: 'net' | 'gross', value: number) => {
    if (!selectedMonth) return

    const updates: Partial<MonthData> = type === 'net'
      ? { netSalary: value }
      : { grossSalary: value }

    await onUpdateMonth(selectedMonth.id, updates)
  }

  const handleRemoveMonth = async () => {
    if (!selectedMonth || cashFlowData.months.length === 0) return

    if (confirm(`Sei sicuro di voler eliminare ${formatMonthDisplay(selectedMonth.month, selectedMonth.year)}?`)) {
      await onDeleteMonth(selectedMonth.id)

      // Select first month or null if no months left
      const remaining = cashFlowData.months.filter(m => m.id !== selectedMonth.id)
      if (remaining.length > 0) {
        setSelectedMonthId(remaining[0].id)
      } else {
        setSelectedMonthId(null)
      }
    }
  }

  const totalExpenses = selectedMonth?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0
  const monthlyBalance = (selectedMonth?.netSalary || 0) - totalExpenses

  return (
    <div className="space-y-6">
      {/* Add New Month Form */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold mb-4">Aggiungi Nuovo Mese</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mese</label>
            <select
              value={newMonthMonth}
              onChange={(e) => setNewMonthMonth(parseInt(e.target.value))}
              className="w-full"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {getFullMonthName(i)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Anno</label>
            <input
              type="number"
              value={newMonthYear}
              onChange={(e) => setNewMonthYear(parseInt(e.target.value) || new Date().getFullYear())}
              min="1900"
              max="2100"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Netto (€)</label>
            <input
              type="number"
              value={newMonthNetSalary}
              onChange={(e) => setNewMonthNetSalary(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Lordo (€)</label>
            <input
              type="number"
              value={newMonthGrossSalary}
              onChange={(e) => setNewMonthGrossSalary(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddMonth}
              className="w-full"
              variant="accent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Mese
            </Button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
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
            {allCategoriesInData.map((categoryName) => {
              const color = categoryColorMap.get(categoryName) || '#6b7280'
              return (
                <Bar
                  key={categoryName}
                  dataKey={categoryName}
                  stackId="expenses"
                  fill={color}
                  name={categoryName}
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
      {cashFlowData.months.length > 0 ? (
        <div className="flex items-center justify-between gap-4 glass-card p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const prevIndex = Math.max(0, selectedMonthIndex - 1)
                setSelectedMonthId(sortedMonths[prevIndex].id)
              }}
              disabled={selectedMonthIndex === 0}
              className="px-5 py-2.5"
            >
              ← Prec
            </button>
            <select
              value={selectedMonthId || ''}
              onChange={(e) => setSelectedMonthId(e.target.value)}
              className="px-4 py-2.5 glass-card border-primary/20 text-xl font-bold"
            >
              {sortedMonths.map((month) => (
                <option key={month.id} value={month.id}>
                  {formatMonthDisplay(month.month, month.year)}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const nextIndex = Math.min(sortedMonths.length - 1, selectedMonthIndex + 1)
                setSelectedMonthId(sortedMonths[nextIndex].id)
              }}
              disabled={selectedMonthIndex === sortedMonths.length - 1}
              className="px-5 py-2.5"
            >
              Succ →
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRemoveMonth}
              className="px-5 py-2.5"
            >
              Elimina Mese
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-gray-400 mb-4">Nessun mese presente. Aggiungi il tuo primo mese sopra!</p>
        </div>
      )}

      {/* Summary Cards and Edit Form - Only show if there are months */}
      {selectedMonth && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <div className="text-sm text-gray-400">Spese Totali Mese</div>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-gray-400">Bilancio Mensile</div>
              <div
                className={`text-2xl font-bold ${
                  monthlyBalance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatCurrency(monthlyBalance)}
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="text-sm text-gray-400">Capitale Cumulativo</div>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(selectedMonth.cumulativeCapital)}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-xl font-bold">Modifica Dati Mese</h3>

        {/* Salaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Netto (€)</label>
            <input
              type="number"
              value={selectedMonth.netSalary}
              onChange={(e) => handleUpdateSalary('net', parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stipendio Lordo (€)</label>
            <input
              type="number"
              value={selectedMonth.grossSalary}
              onChange={(e) => handleUpdateSalary('gross', parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>

        {/* Expenses List */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Spese</h4>
          <div className="space-y-2">
            {selectedMonth.expenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-4 glass-card p-3 border border-primary/10">
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
            <select
              value={newExpenseCategory}
              onChange={(e) => setNewExpenseCategory(e.target.value)}
              className="flex-1 px-4 py-2.5 glass-card border-primary/20"
            >
              <option value="">Seleziona una categoria...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Importo (€)"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-40 px-4 py-2.5 glass-card border-primary/20"
            />
            <button
              onClick={handleAddExpense}
              disabled={!newExpenseCategory || !newExpenseAmount}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Aggiungi
            </button>
          </div>
            <p className="text-xs text-gray-400 mt-2">
              Non trovi la categoria? Vai al tab <span className="text-blue-400 font-semibold">Categorie</span> per crearne una nuova.
            </p>
          </div>
        </div>
      </>
      )}
    </div>
  )
}
