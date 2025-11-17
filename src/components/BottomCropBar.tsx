import { GameState, CROP_TYPES } from '../App';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface BottomCropBarProps {
  gameState: GameState;
  selectedCrop: string | null;
  setSelectedCrop: (cropId: string | null) => void;
  plantingMode: boolean;
}

export default function BottomCropBar({
  gameState,
  selectedCrop,
  setSelectedCrop,
  plantingMode,
}: BottomCropBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-amber-900/98 via-amber-800/95 to-transparent backdrop-blur-md shadow-2xl border-t-4 border-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-white text-sm font-medium">
            {plantingMode ? '🌱 Click a crop, then click empty plots to plant' : '🌾 Select Your Crop'}
          </h3>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-6 gap-3">
          {CROP_TYPES.map((crop) => {
            const canAfford = gameState.cash >= crop.seedCost;
            const isSelected = selectedCrop === crop.id;
            const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;
            const trend = gameState.market[crop.id]?.trend || 'stable';
            const profit = marketPrice - crop.seedCost;
            const roi = ((profit / crop.seedCost) * 100).toFixed(0);

            return (
              <TooltipProvider key={crop.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => canAfford && setSelectedCrop(isSelected ? null : crop.id)}
                      disabled={!canAfford}
                      className={`relative p-4 rounded-2xl transition-all transform ${
                        isSelected
                          ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110 shadow-2xl ring-4 ring-green-300 z-10'
                          : canAfford
                          ? 'bg-gradient-to-br from-white to-gray-100 hover:scale-105 hover:shadow-xl border-3 border-green-400'
                          : 'bg-gray-300 opacity-50 cursor-not-allowed border-3 border-gray-400'
                      } ${plantingMode && isSelected ? 'animate-pulse' : ''}`}
                    >
                      {/* Crop Icon */}
                      <div className={`text-5xl mb-2 ${isSelected ? 'animate-bounce' : ''}`}>{crop.icon}</div>

                      {/* Crop Name */}
                      <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-800'} mb-1`}>
                        {crop.name}
                      </div>

                      {/* Price */}
                      <div
                        className={`text-xs ${
                          isSelected ? 'text-green-100' : 'text-gray-600'
                        } flex items-center justify-center gap-1`}
                      >
                        <span>${crop.seedCost}</span>
                        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                        {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                        {trend === 'stable' && <ArrowRight className="w-3 h-3 text-blue-500" />}
                      </div>

                      {/* Selected Check */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
                          <span className="text-lg">✓</span>
                        </div>
                      )}

                      {/* ROI Badge */}
                      {profit > 0 && (
                        <div
                          className={`absolute -top-1 -left-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-md ${
                            parseFloat(roi) > 100
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                              : 'bg-blue-400 text-white'
                          }`}
                        >
                          {roi}%
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>

                  <TooltipContent side="top" className="bg-gray-900 text-white p-4 max-w-xs mb-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{crop.icon}</span>
                        <span className="font-medium text-lg">{crop.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">Seed Cost:</div>
                        <div className="text-yellow-400 font-medium">${crop.seedCost}</div>

                        <div className="text-gray-400">Sell Price:</div>
                        <div className="text-green-400 font-medium">${marketPrice}</div>

                        <div className="text-gray-400">Profit:</div>
                        <div className={`font-medium ${profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${profit}
                        </div>

                        <div className="text-gray-400">ROI:</div>
                        <div className={`font-medium ${profit > 0 ? 'text-blue-400' : 'text-gray-400'}`}>{roi}%</div>

                        <div className="text-gray-400">Growth Time:</div>
                        <div>{crop.growthTime}s</div>

                        <div className="text-gray-400">XP Reward:</div>
                        <div className="text-purple-400">+{crop.xp} XP</div>
                      </div>

                      <div className="pt-2 border-t border-gray-700">
                        <div className="text-xs text-gray-400">💡 ROI = (Profit ÷ Cost) × 100</div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Quick Stats */}
        {selectedCrop && (
          <div className="mt-3 text-center">
            {(() => {
              const crop = CROP_TYPES.find((c) => c.id === selectedCrop);
              if (!crop) return null;
              const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;
              const profit = marketPrice - crop.seedCost;
              const roi = ((profit / crop.seedCost) * 100).toFixed(0);

              return (
                <div className="inline-flex items-center gap-4 bg-green-700/80 px-6 py-2 rounded-full text-white text-sm">
                  <span>
                    <strong>{crop.name}</strong> selected
                  </span>
                  <span>•</span>
                  <span>Cost: ${crop.seedCost}</span>
                  <span>•</span>
                  <span>Sell: ${marketPrice}</span>
                  <span>•</span>
                  <span className="text-yellow-300">
                    <strong>Profit: ${profit}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-green-300">
                    <strong>ROI: {roi}%</strong>
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
