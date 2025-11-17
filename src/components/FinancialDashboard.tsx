import { GameState } from '../App';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';
import { Progress } from './ui/progress';

interface FinancialDashboardProps {
  gameState: GameState;
}

export default function FinancialDashboard({ gameState }: FinancialDashboardProps) {
  const netProfit = gameState.totalRevenue - gameState.totalExpenses;
  const profitMargin =
    gameState.totalRevenue > 0 ? ((netProfit / gameState.totalRevenue) * 100).toFixed(1) : '0';
  const roi = gameState.totalExpenses > 0 ? ((netProfit / gameState.totalExpenses) * 100).toFixed(1) : '0';

  const hiredWorkers = gameState.workers.filter((w) => w.hired);
  const totalPayroll = hiredWorkers.reduce((sum, w) => sum + w.wage, 0);

  const inventoryValue = Object.keys(gameState.inventory).reduce((sum, cropId) => {
    const quantity = gameState.inventory[cropId];
    const price = gameState.market[cropId]?.currentPrice || 0;
    return sum + quantity * price;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-green-900 mb-2">📊 Financial Dashboard</h2>
        <p className="text-gray-700">
          Track your business performance with real-time financial metrics and KPIs
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <MetricCard
          title="Total Revenue"
          value={`$${gameState.totalRevenue}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="from-green-400 to-green-600"
          description="Income from sales"
        />

        {/* Total Expenses */}
        <MetricCard
          title="Total Expenses"
          value={`$${gameState.totalExpenses}`}
          icon={<CreditCard className="w-6 h-6" />}
          color="from-red-400 to-red-600"
          description="Costs & payroll"
        />

        {/* Net Profit */}
        <MetricCard
          title="Net Profit"
          value={`$${netProfit}`}
          icon={netProfit >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          color={netProfit >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600'}
          description="Revenue - Expenses"
        />

        {/* Cash on Hand */}
        <MetricCard
          title="Cash on Hand"
          value={`$${gameState.cash}`}
          icon={<PiggyBank className="w-6 h-6" />}
          color="from-yellow-400 to-yellow-600"
          description="Available funds"
        />
      </div>

      {/* KPIs */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Key Performance Indicators (KPIs)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profit Margin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Profit Margin</span>
              <span className="text-lg font-medium">{profitMargin}%</span>
            </div>
            <Progress
              value={Math.min(100, Math.max(0, parseFloat(profitMargin)))}
              className="h-3 bg-gray-200"
            />
            <p className="text-xs text-gray-600 mt-1">
              💡 Profit ÷ Revenue × 100
            </p>
          </div>

          {/* ROI */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Return on Investment</span>
              <span className="text-lg font-medium">{roi}%</span>
            </div>
            <Progress
              value={Math.min(100, Math.max(0, parseFloat(roi)))}
              className="h-3 bg-gray-200"
            />
            <p className="text-xs text-gray-600 mt-1">
              💡 Profit ÷ Investment × 100
            </p>
          </div>

          {/* Break-Even Status */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Break-Even Status</span>
              <span className={`text-lg font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netProfit >= 0 ? 'Profitable ✓' : 'In Deficit'}
              </span>
            </div>
            <Progress
              value={netProfit >= 0 ? 100 : (gameState.totalRevenue / gameState.totalExpenses) * 100}
              className="h-3 bg-gray-200"
            />
            <p className="text-xs text-gray-600 mt-1">
              💡 Revenue must exceed expenses
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4">💰 Cost Breakdown</h3>

        <div className="space-y-3">
          <CostItem label="Seed Costs" amount={gameState.totalExpenses - totalPayroll * 10} color="bg-green-500" />
          <CostItem label="Payroll (cumulative)" amount={totalPayroll * 10} color="bg-purple-500" />
          <CostItem
            label="Daily Payroll"
            amount={totalPayroll}
            color="bg-red-500"
            recurring
          />
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4">🏦 Assets & Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 rounded-xl p-4 border-2 border-blue-300">
            <div className="text-sm text-blue-700">Unlocked Plots</div>
            <div className="text-2xl text-blue-900">{gameState.unlockedPlots}/16</div>
            <p className="text-xs text-blue-600 mt-1">Land assets</p>
          </div>

          <div className="bg-green-100 rounded-xl p-4 border-2 border-green-300">
            <div className="text-sm text-green-700">Inventory Value</div>
            <div className="text-2xl text-green-900">${inventoryValue}</div>
            <p className="text-xs text-green-600 mt-1">Unsold crops</p>
          </div>

          <div className="bg-yellow-100 rounded-xl p-4 border-2 border-yellow-300">
            <div className="text-sm text-yellow-700">Upgrades Owned</div>
            <div className="text-2xl text-yellow-900">
              {gameState.upgrades.filter((u) => u.owned).length}/{gameState.upgrades.length}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Capital improvements</p>
          </div>

          <div className="bg-purple-100 rounded-xl p-4 border-2 border-purple-300">
            <div className="text-sm text-purple-700">Workforce</div>
            <div className="text-2xl text-purple-900">{hiredWorkers.length} employees</div>
            <p className="text-xs text-purple-600 mt-1">Human capital</p>
          </div>
        </div>
      </div>

      {/* Business Education */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="mb-2">💡 Understanding Financial Statements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 rounded-xl p-4">
            <div className="font-medium mb-2">📈 Revenue</div>
            <p>Money earned from selling crops. Higher revenue = more sales.</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="font-medium mb-2">📉 Expenses</div>
            <p>Costs to run your business (seeds, wages, repairs).</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <div className="font-medium mb-2">💰 Profit</div>
            <p>Revenue minus Expenses. This is what you actually earn!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm opacity-90">{title}</div>
        {icon}
      </div>
      <div className="text-3xl font-medium mb-1">{value}</div>
      <div className="text-xs opacity-80">{description}</div>
    </div>
  );
}

function CostItem({
  label,
  amount,
  color,
  recurring,
}: {
  label: string;
  amount: number;
  color: string;
  recurring?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium">
          ${amount}
          {recurring && <span className="text-xs text-gray-500 ml-1">/day</span>}
        </span>
      </div>
    </div>
  );
}
