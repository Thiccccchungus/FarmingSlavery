import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GameState, CROP_TYPES } from '../App';

interface CropSelectorProps {
  gameState: GameState;
  onSelect: (cropId: string) => void;
  onClose: () => void;
}

export default function CropSelector({ gameState, onSelect, onClose }: CropSelectorProps) {
  const canAfford = (cropId: string) => {
    const crop = CROP_TYPES.find((c) => c.id === cropId);
    if (!crop) return false;
    
    return (
      gameState.cash >= crop.seedCost &&
      gameState.water >= crop.waterNeeded &&
      gameState.energy >= crop.energyNeeded
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <Card className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-green-900">Select a Crop to Plant</h2>
          <Button onClick={onClose} variant="ghost" className="rounded-full" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CROP_TYPES.map((crop) => {
            const affordable = canAfford(crop.id);
            const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;
            const profit = marketPrice - crop.seedCost;
            const trend = gameState.market[crop.id]?.trend || 'stable';

            return (
              <Card
                key={crop.id}
                className={`p-4 rounded-2xl transition-all cursor-pointer ${
                  affordable
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-100 border-2 border-gray-300 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => affordable && onSelect(crop.id)}
              >
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">{crop.icon}</div>
                  <h3 className="text-gray-900">{crop.name}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seed Cost:</span>
                    <span className={gameState.cash >= crop.seedCost ? 'text-green-700' : 'text-red-600'}>
                      ${crop.seedCost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Price:</span>
                    <span className="text-green-700 flex items-center gap-1">
                      ${marketPrice}
                      {trend === 'up' && <span className="text-xs">📈</span>}
                      {trend === 'down' && <span className="text-xs">📉</span>}
                      {trend === 'stable' && <span className="text-xs">➡️</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit:</span>
                    <span className={profit > 0 ? 'text-green-700' : 'text-red-600'}>
                      ${profit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Time:</span>
                    <span className="text-gray-900">{crop.growthTime}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Water:</span>
                    <span className={gameState.water >= crop.waterNeeded ? 'text-blue-700' : 'text-red-600'}>
                      💧 {crop.waterNeeded}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Energy:</span>
                    <span className={gameState.energy >= crop.energyNeeded ? 'text-amber-700' : 'text-red-600'}>
                      ⚡ {crop.energyNeeded}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => affordable && onSelect(crop.id)}
                  disabled={!affordable}
                  className={`w-full mt-4 rounded-xl ${
                    affordable
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {affordable ? 'Plant' : 'Cannot Afford'}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Smart farming tip:</strong> Watch market prices! Plant crops when demand is high (📈) for maximum profit.
            Different crops need different amounts of water and energy.
          </p>
        </div>
      </Card>
    </div>
  );
}
