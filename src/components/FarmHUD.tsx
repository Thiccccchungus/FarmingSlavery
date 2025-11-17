import { GameState } from '../App';
import { Coins, Star, Zap, Clock, Sprout } from 'lucide-react';
import { Progress } from './ui/progress';

interface FarmHUDProps {
  gameState: GameState;
}

export default function FarmHUD({ gameState }: FarmHUDProps) {
  const getTimeOfDay = () => {
    const hour = gameState.time;
    if (hour >= 6 && hour < 12) return { emoji: '🌅', text: 'Morning' };
    if (hour >= 12 && hour < 18) return { emoji: '☀️', text: 'Afternoon' };
    if (hour >= 18 && hour < 22) return { emoji: '🌆', text: 'Evening' };
    return { emoji: '🌙', text: 'Night' };
  };

  const timeOfDay = getTimeOfDay();
  const xpProgress = (gameState.xp / gameState.xpToNextLevel) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-amber-900/95 to-amber-800/95 backdrop-blur-sm shadow-2xl border-b-4 border-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Left: Farm Name & Level */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white transform hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white">My Farm</h1>
                <div className="bg-yellow-400 px-2 py-0.5 rounded-full border-2 border-yellow-600 shadow-md">
                  <span className="text-xs text-yellow-900">Level {gameState.level}</span>
                </div>
              </div>
              <Progress value={xpProgress} className="h-1.5 w-32 bg-amber-950" />
            </div>
          </div>

          {/* Right: Resources */}
          <div className="flex items-center gap-3">
            {/* Coins */}
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 px-4 py-2 rounded-2xl shadow-lg border-3 border-yellow-600 flex items-center gap-2 transform hover:scale-105 transition-transform cursor-pointer">
              <Coins className="w-5 h-5 text-yellow-900 drop-shadow" />
              <span className="text-yellow-900">{gameState.cash}</span>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ml-1 shadow-md border-2 border-green-600 hover:bg-green-400 transition-colors">
                <span className="text-white text-lg">+</span>
              </div>
            </div>

            {/* Energy */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 px-4 py-2 rounded-2xl shadow-lg border-3 border-orange-700 flex items-center gap-2">
              <Zap className="w-5 h-5 text-white drop-shadow" />
              <div className="flex flex-col">
                <span className="text-white text-sm leading-none">{gameState.energy}/{gameState.maxEnergy}</span>
                <Progress value={(gameState.energy / gameState.maxEnergy) * 100} className="h-1 w-16 bg-orange-800 mt-1" />
              </div>
            </div>

            {/* Time */}
            <div className="bg-gradient-to-br from-sky-400 to-sky-600 px-4 py-2 rounded-2xl shadow-lg border-3 border-sky-700 flex items-center gap-2">
              <span className="text-2xl">{timeOfDay.emoji}</span>
              <div className="flex flex-col">
                <span className="text-white text-xs leading-none">{timeOfDay.text}</span>
                <span className="text-sky-100 text-xs">{gameState.time}:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Info */}
        <div className="flex items-center gap-2 text-xs text-amber-100">
          <Star className="w-3 h-3" />
          <span>{gameState.xp}/{gameState.xpToNextLevel} XP to level {gameState.level + 1}</span>
        </div>
      </div>
    </div>
  );
}
