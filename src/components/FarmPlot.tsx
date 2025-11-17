import { Sprout, Lock, Droplet, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Plot, GameState, CROP_TYPES } from '../App';
import { useEffect, useState } from 'react';

interface FarmPlotProps {
  plot: Plot;
  selectedAction: string | null;
  onClick: () => void;
  gameState: GameState;
}

export default function FarmPlot({ plot, selectedAction, onClick, gameState }: FarmPlotProps) {
  const [currentProgress, setCurrentProgress] = useState(plot.growthProgress);

  const crop = plot.crop ? CROP_TYPES.find((c) => c.id === plot.crop) : null;

  useEffect(() => {
    if (plot.crop && crop && !plot.harvestable && plot.plantedAt) {
      const updateProgress = () => {
        const elapsed = (Date.now() - (plot.plantedAt || 0)) / 1000;
        const progress = Math.min(100, (elapsed / crop.growthTime) * 100);
        setCurrentProgress(progress);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 100);

      return () => clearInterval(interval);
    } else if (!plot.crop) {
      setCurrentProgress(0);
    }
  }, [plot.crop, plot.harvestable, plot.plantedAt, crop]);

  const isHarvestable = currentProgress >= 100;
  const marketData = crop ? gameState.market[crop.id] : null;

  return (
    <Card
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
        !plot.unlocked
          ? 'bg-gray-200 cursor-not-allowed border-2 border-gray-300'
          : selectedAction === 'plant' && !plot.crop
          ? 'bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-500 cursor-pointer hover:shadow-2xl hover:scale-105 animate-pulse'
          : selectedAction === 'harvest' && isHarvestable
          ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-500 cursor-pointer hover:shadow-2xl hover:scale-105 animate-pulse'
          : plot.crop
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
          : 'bg-gradient-to-br from-amber-50 to-orange-50 hover:bg-amber-100 border-2 border-amber-300 cursor-pointer'
      }`}
    >
      {/* Sparkle effect for harvestable crops */}
      {isHarvestable && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        </div>
      )}

      <div className="text-center relative z-10">
        {!plot.unlocked ? (
          <>
            <Lock className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-600">Locked Plot</p>
            <p className="text-xs text-gray-500 mt-1">Unlock for $1000</p>
          </>
        ) : plot.crop && crop ? (
          <>
            <div className="relative w-20 h-20 mx-auto mb-2">
              {/* Growing animation */}
              <div
                className={`w-full h-full rounded-full flex items-center justify-center transition-all ${
                  isHarvestable
                    ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-300 animate-bounce'
                    : 'bg-gradient-to-br from-green-200 to-green-400'
                }`}
                style={{
                  transform: `scale(${0.6 + (currentProgress / 100) * 0.4})`,
                }}
              >
                <span className="text-4xl">{crop.icon}</span>
              </div>
            </div>
            
            <p className="text-sm text-green-900 mb-2 capitalize">{crop.name}</p>
            
            {marketData && (
              <div className="text-xs text-gray-700 mb-2">
                Market: ${marketData.currentPrice}
                {marketData.trend === 'up' && ' 📈'}
                {marketData.trend === 'down' && ' 📉'}
              </div>
            )}
            
            <Progress 
              value={currentProgress} 
              className={`h-2 mb-1 ${
                isHarvestable ? 'bg-yellow-200' : 'bg-green-200'
              }`}
            />
            
            <p className="text-xs mb-2">
              {isHarvestable ? (
                <span className="text-green-700 animate-pulse">✨ Ready to Harvest! ✨</span>
              ) : (
                <span className="text-green-700">Growing... {Math.round(currentProgress)}%</span>
              )}
            </p>

            {/* Resource info */}
            <div className="flex justify-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-blue-500" />
                {crop.waterNeeded}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                {crop.energyNeeded}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-2 bg-amber-200 rounded-2xl border-4 border-dashed border-amber-400 flex items-center justify-center">
              <Sprout className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-sm text-amber-800">Empty Plot</p>
            <p className="text-xs text-amber-600 mt-1">Click to plant</p>
          </>
        )}
      </div>
    </Card>
  );
}
