import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GameState } from '../App';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FinancialReportProps {
  gameState: GameState;
  onBack: () => void;
}

export default function FinancialReport({ gameState, onBack }: FinancialReportProps) {
  const revenueData = gameState.weeklyRevenue.map((revenue, index) => ({
    week: `Week ${index + 1}`,
    revenue,
  }));

  const costData = [
    { name: 'Labour', value: gameState.costs.labour, color: '#ec4899' },
    { name: 'Seeds', value: gameState.costs.seeds, color: '#10b981' },
    { name: 'Equipment', value: gameState.costs.equipment, color: '#3b82f6' },
    { name: 'Energy', value: gameState.costs.energy, color: '#f59e0b' },
  ];

  const totalCosts = Object.values(gameState.costs).reduce((sum, cost) => sum + cost, 0);
  const totalRevenue = gameState.weeklyRevenue.reduce((sum, rev) => sum + rev, 0);
  const netProfit = totalRevenue - totalCosts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Button onClick={onBack} variant="ghost" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-blue-900">Financial Report</h2>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <p className="text-sm text-green-900">
            📊 <strong>Understanding your finances</strong> is key to success! Revenue is money earned from sales. 
            Costs are money spent. Profit = Revenue - Costs. Capital is money invested in growing your business.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-6 bg-white rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">Total Revenue</div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  ${totalRevenue}
                </div>
                <p className="text-xs text-gray-600 mt-2">Money earned from sales</p>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p><strong>Revenue:</strong> The total amount of money your farm earns from selling crops and products.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-6 bg-white rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">Total Costs</div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-red-600 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  ${totalCosts}
                </div>
                <p className="text-xs text-gray-600 mt-2">Money spent on operations</p>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p><strong>Costs:</strong> All the money you spend to run your farm (wages, seeds, equipment, energy).</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-6 bg-white rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">Net Profit</div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className={`${netProfit >= 0 ? 'text-green-700' : 'text-red-600'} flex items-center gap-2`}>
                  <DollarSign className="w-6 h-6" />
                  {netProfit >= 0 ? '+' : ''}${netProfit}
                </div>
                <p className="text-xs text-gray-600 mt-2">Revenue minus costs</p>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p><strong>Net Profit:</strong> What's left after paying all costs. Profit = Revenue - Costs</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="p-6 bg-white rounded-3xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-700">Capital</div>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-blue-700 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  ${gameState.capital}
                </div>
                <p className="text-xs text-gray-600 mt-2">Total investment</p>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p><strong>Capital:</strong> Money invested in assets that help your business grow (land, machines, etc.)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue Chart */}
        <Card className="p-6 bg-white rounded-3xl shadow-lg">
          <h3 className="text-blue-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3">
            📈 This chart shows how much money you earned each week from selling crops.
          </p>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-6 bg-white rounded-3xl shadow-lg">
          <h3 className="text-blue-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: $${entry.value}`}
                outerRadius={100}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3">
            📊 This shows where your money is going. Each slice represents a different type of cost.
          </p>
        </Card>
      </div>

      {/* Educational Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-lg border-2 border-green-300">
          <h3 className="text-green-900 mb-3">💰 What is Revenue?</h3>
          <p className="text-sm text-green-800">
            Revenue is all the money your farm earns from selling crops. The more you sell, the higher your revenue!
            It's the total income before paying any costs.
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg border-2 border-blue-300">
          <h3 className="text-blue-900 mb-3">🏗️ What is Capital?</h3>
          <p className="text-sm text-blue-800">
            Capital is money you invest into things that help your business grow - like land, machines, and buildings.
            These investments help you earn more money in the future!
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg border-2 border-purple-300">
          <h3 className="text-purple-900 mb-3">📈 What is Net Profit?</h3>
          <p className="text-sm text-purple-800">
            Net Profit = Revenue - Costs. It's what you have left after paying all your bills. A positive profit means
            you're making money. A negative profit (loss) means you're spending more than you earn!
          </p>
        </Card>
      </div>

      {/* Detailed Cost Table */}
      <Card className="mt-4 p-6 bg-white rounded-3xl shadow-lg">
        <h3 className="text-blue-900 mb-4">Detailed Cost Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Category</th>
                <th className="text-right py-3 px-4 text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {costData.map((cost) => (
                <tr key={cost.name} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: cost.color }} />
                      {cost.name}
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">${cost.value}</td>
                  <td className="text-right py-3 px-4">
                    {((cost.value / totalCosts) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300">
                <td className="py-3 px-4">Total Costs</td>
                <td className="text-right py-3 px-4">${totalCosts}</td>
                <td className="text-right py-3 px-4">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
