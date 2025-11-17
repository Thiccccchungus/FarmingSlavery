import { GameState } from '../App';
import { Coins, Star, Clock, Sprout, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from './ui/progress';

interface BusinessHUDProps {
  gameState: GameState;
}

export default function BusinessHUD({ gameState }: BusinessHUDProps) {
  const getTimeOfDay = () => {
    const hour = gameState.time;
    if (hour >= 6 && hour < 12) return { emoji: '🌅', text: 'Morning' };
    if (hour >= 12 && hour < 18) return { emoji: '☀️', text: 'Afternoon' };
    if (hour >= 18 && hour < 22) return { emoji: '🌆', text: 'Evening' };
    return { emoji: '🌙', text: 'Night' };
  };

  const timeOfDay = getTimeOfDay();
  const xpProgress = (gameState.xp / gameState.xpToNextLevel) * 100;
  const netProfit = gameState.totalRevenue - gameState.totalExpenses;
  const hiredWorkers = gameState.workers.filter((w) => w.hired).length;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-amber-900/95 to-amber-800/95 backdrop-blur-sm shadow-2xl border-b-4 border-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Left: Farm Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white">Eco-Farm Tycoon</h1>
                <div className="bg-yellow-400 px-2 py-0.5 rounded-full border-2 border-yellow-600 shadow-md">
                  <span className="text-xs text-yellow-900">Level {gameState.level}</span>
                </div>
              </div>
              <Progress value={xpProgress} className="h-1.5 w-32 bg-amber-950" />
            </div>
          </div>

          {/* Right: Key Metrics */}
          <div className="flex items-center gap-3">
            {/* Cash */}
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 px-4 py-2 rounded-2xl shadow-lg border-3 border-yellow-600 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-900" />
              <div className="flex flex-col">
                <span className="text-yellow-900 text-sm">Cash</span>
                <span className="text-yellow-900">${gameState.cash}</span>
              </div>
            </div>

            {/* Net Profit */}
            <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} px-4 py-2 rounded-2xl shadow-lg border-3 ${netProfit >= 0 ? 'border-green-700' : 'border-red-700'} flex items-center gap-2`}>
              {netProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-white" />
              ) : (
                <TrendingDown className="w-5 h-5 text-white" />
              )}
              <div className="flex flex-col">
                <span className="text-white text-xs">Net Profit</span>
                <span className="text-white text-sm">${netProfit}</span>
              </div>
            </div>

            {/* Workers */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 px-4 py-2 rounded-2xl shadow-lg border-3 border-purple-700 flex items-center gap-2">
              <span className="text-2xl">👷</span>
              <div className="flex flex-col">
                <span className="text-white text-xs">Workers</span>
                <span className="text-white text-sm">{hiredWorkers}</span>
              </div>
            </div>

            {/* Time */}
            <div className="bg-gradient-to-br from-sky-400 to-sky-600 px-4 py-2 rounded-2xl shadow-lg border-3 border-sky-700 flex items-center gap-2">
              <span className="text-2xl">{timeOfDay.emoji}</span>
              <div className="flex flex-col">
                <span className="text-white text-xs">{timeOfDay.text}</span>
                <span className="text-sky-100 text-xs">{gameState.time}:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-amber-100">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{gameState.xp}/{gameState.xpToNextLevel} XP</span>
          </div>
          <span>•</span>
          <span>Revenue: ${gameState.totalRevenue}</span>
          <span>•</span>
          <span>Expenses: ${gameState.totalExpenses}</span>
          <span>•</span>
          <span>Plots: {gameState.unlockedPlots}/16</span>
        </div>
      </div>
    </div>
  );
}
