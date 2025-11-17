import { GameState, CROP_TYPES } from '../App';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface CropSelectorSideProps {
  gameState: GameState;
  selectedCrop: string | null;
  setSelectedCrop: (cropId: string | null) => void;
}

export default function CropSelectorSide({ gameState, selectedCrop, setSelectedCrop }: CropSelectorSideProps) {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 h-fit sticky top-28">
      <h3 className="text-green-900 mb-4 flex items-center gap-2">
        <span>🌱</span>
        Select Crop
      </h3>

      <div className="space-y-2">
        {CROP_TYPES.map((crop) => {
          const canAfford = gameState.cash >= crop.seedCost;
          const isSelected = selectedCrop === crop.id;
          const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;
          const demand = gameState.market[crop.id]?.demand || 50;
          const trend = gameState.market[crop.id]?.trend || 'stable';

          const profit = marketPrice - crop.seedCost;
          const roi = ((profit / crop.seedCost) * 100).toFixed(0);

          return (
            <TooltipProvider key={crop.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => canAfford && setSelectedCrop(isSelected ? null : crop.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all transform ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-400 to-green-600 scale-105 shadow-lg ring-2 ring-green-300'
                        : canAfford
                        ? 'bg-gradient-to-r from-green-50 to-green-100 hover:scale-105 hover:shadow-md border-2 border-green-300'
                        : 'bg-gray-200 opacity-50 cursor-not-allowed border-2 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl ${isSelected ? 'animate-bounce' : ''}`}>
                        {crop.icon}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {crop.name}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-600'}`}>
                          Cost: ${crop.seedCost}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-green-700'}`}>
                          Sell: ${marketPrice} {trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-white text-xl">✓</div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white p-4 max-w-xs">
                  <div className="space-y-2">
                    <div className="font-medium">{crop.name} Economics</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Seed Cost:</div>
                      <div>${crop.seedCost}</div>
                      <div>Market Price:</div>
                      <div>${marketPrice}</div>
                      <div>Profit/Unit:</div>
                      <div className={profit > 0 ? 'text-green-400' : 'text-red-400'}>${profit}</div>
                      <div>ROI:</div>
                      <div className={profit > 0 ? 'text-green-400' : 'text-red-400'}>{roi}%</div>
                      <div>Growth Time:</div>
                      <div>{crop.growthTime}s</div>
                      <div>Demand:</div>
                      <div>{demand}%</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      💡 ROI = (Profit ÷ Cost) × 100
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl border-2 border-blue-300">
        <div className="text-xs text-blue-900">
          <div className="font-medium mb-1">💡 Business Tip</div>
          <p>Click a crop to select it, then click empty plots to plant. Higher ROI = better returns!</p>
        </div>
      </div>
    </div>
  );
}
