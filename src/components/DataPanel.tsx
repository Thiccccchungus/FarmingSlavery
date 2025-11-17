import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GameState } from '../App';
import { TrendingUp, Users, Activity } from 'lucide-react';

interface DataPanelProps {
  gameState: GameState;
}

export default function DataPanel({ gameState }: DataPanelProps) {
  const revenueData = gameState.weeklyRevenue.slice(-6).map((revenue, index) => ({
    week: `W${gameState.weeklyRevenue.length - 5 + index}`,
    revenue,
  }));

  const costData = [
    { name: 'Labour', value: gameState.costs.labour, color: '#ec4899' },
    { name: 'Seeds', value: gameState.costs.seeds, color: '#10b981' },
    { name: 'Equipment', value: gameState.costs.equipment, color: '#3b82f6' },
    { name: 'Energy', value: gameState.costs.energy, color: '#f59e0b' },
  ];

  const activePlots = gameState.plots.filter(p => p.crop).length;
  const totalPlots = gameState.plots.filter(p => p.unlocked).length;

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-xl border-2 border-purple-200">
        <h3 className="text-purple-800 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Farm Activity
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
            <span className="text-sm text-gray-700">Active Plots:</span>
            <span className="text-purple-900">{activePlots}/{totalPlots}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
            <span className="text-sm text-gray-700">Staff Count:</span>
            <span className="text-purple-900">{gameState.staff.length}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
            <span className="text-sm text-gray-700">Eco Score:</span>
            <span className="text-green-700">{Math.round(gameState.sustainabilityScore)}%</span>
          </div>
        </div>
      </Card>

      {/* Revenue Chart */}
      <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-green-200">
        <h3 className="text-green-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Costs Breakdown */}
      <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-red-200">
        <h3 className="text-red-800 mb-3">Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={costData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={(entry) => entry.name}
            >
              {costData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Staff List */}
      <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-pink-200">
        <h3 className="text-pink-800 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Staff ({gameState.staff.length})
        </h3>
        <div className="space-y-2">
          {gameState.staff.slice(0, 3).map((staff) => (
            <div key={staff.id} className="p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-pink-900">{staff.name}</p>
                  <p className="text-xs text-pink-700">{staff.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-pink-700">${staff.wage}/wk</p>
                  <p className="text-xs text-pink-600">😊 {staff.happiness}%</p>
                </div>
              </div>
            </div>
          ))}
          {gameState.staff.length > 3 && (
            <p className="text-xs text-center text-gray-500">
              +{gameState.staff.length - 3} more
            </p>
          )}
        </div>
      </Card>

      {/* Capital Tracker */}
      <Card className="p-4 bg-sky-50 rounded-3xl shadow-lg">
        <h3 className="text-sky-800 mb-2">Capital Investment</h3>
        <div className="text-center">
          <div className="text-sky-900">${gameState.capital}</div>
          <p className="text-xs text-sky-700 mt-1">
            Money invested in your farm's growth
          </p>
        </div>
      </Card>
    </div>
  );
}