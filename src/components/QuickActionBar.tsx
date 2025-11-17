import { useState } from 'react';
import { Sprout, ShoppingCart, Package, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { GameState, CROP_TYPES } from '../App';

interface QuickActionBarProps {
  gameState: GameState;
  plantMode: boolean;
  setPlantMode: (mode: boolean) => void;
  selectedCrop: string | null;
  setSelectedCrop: (crop: string | null) => void;
  onHarvestAll: () => void;
}

export default function QuickActionBar({
  gameState,
  plantMode,
  setPlantMode,
  selectedCrop,
  setSelectedCrop,
  onHarvestAll,
}: QuickActionBarProps) {
  const [showCropMenu, setShowCropMenu] = useState(false);
  const [bounce, setBounce] = useState('');

  const handlePlantToggle = () => {
    const newMode = !plantMode;
    setPlantMode(newMode);
    
    if (!newMode) {
      setSelectedCrop(null);
      setShowCropMenu(false);
    } else {
      setShowCropMenu(true);
    }

    setBounce('plant');
    setTimeout(() => setBounce(''), 300);
    console.log('🎵 SOUND: button_click.mp3');
  };

  const handleHarvestClick = () => {
    setBounce('harvest');
    setTimeout(() => setBounce(''), 300);
    onHarvestAll();
  };

  const handleCropSelect = (cropId: string) => {
    setSelectedCrop(cropId);
    console.log('🎵 SOUND: select_crop.mp3');
  };

  const matureCropsCount = gameState.plots.filter((p) => p.stage === 'mature').length;

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-amber-950 px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Plant Mode Toggle */}
            <Button
              onClick={handlePlantToggle}
              className={`relative px-6 py-6 rounded-2xl text-white transition-all duration-300 transform ${
                plantMode
                  ? 'bg-gradient-to-br from-green-500 to-green-700 shadow-lg shadow-green-500/50 scale-110'
                  : 'bg-gradient-to-br from-green-600 to-green-800 hover:scale-105'
              } ${bounce === 'plant' ? 'animate-bounce' : ''}`}
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6" />
                <span className="hidden md:inline">Plant</span>
              </div>
              {plantMode && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-yellow-900 text-xs">ON</span>
                </div>
              )}
            </Button>

            {/* Harvest All Button */}
            <Button
              onClick={handleHarvestClick}
              className={`px-6 py-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white shadow-lg transform hover:scale-105 transition-all duration-300 ${
                bounce === 'harvest' ? 'animate-bounce' : ''
              } ${matureCropsCount > 0 ? 'animate-pulse' : ''}`}
              size="lg"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                <span className="hidden md:inline">Harvest</span>
                {matureCropsCount > 0 && (
                  <div className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs ml-1 animate-bounce">
                    {matureCropsCount}
                  </div>
                )}
              </div>
            </Button>

            {/* Inventory */}
            <Button
              className="px-6 py-6 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 hover:scale-105 text-white shadow-lg transform transition-all duration-300"
              size="lg"
            >
              <Package className="w-6 h-6" />
            </Button>

            {/* Menu */}
            <Button
              className="px-6 py-6 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 hover:scale-105 text-white shadow-lg transform transition-all duration-300"
              size="lg"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Crop Selection Menu */}
      {showCropMenu && plantMode && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-green-600 p-4 max-w-2xl">
            <div className="mb-3 text-center">
              <h3 className="text-green-900">Select a Crop to Plant</h3>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {CROP_TYPES.map((crop) => {
                const canAfford = gameState.cash >= crop.seedCost && gameState.energy >= crop.energyNeeded;
                const isSelected = selectedCrop === crop.id;
                const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;

                return (
                  <div
                    key={crop.id}
                    onClick={() => canAfford && handleCropSelect(crop.id)}
                    className={`relative p-4 rounded-2xl text-center cursor-pointer transition-all transform ${
                      isSelected
                        ? 'bg-gradient-to-br from-green-400 to-green-600 scale-110 shadow-lg ring-4 ring-green-300'
                        : canAfford
                        ? 'bg-gradient-to-br from-green-50 to-green-100 hover:scale-105 hover:shadow-lg border-2 border-green-300'
                        : 'bg-gray-200 opacity-50 cursor-not-allowed border-2 border-gray-300'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${isSelected ? 'animate-bounce' : ''}`}>
                      {crop.icon}
                    </div>
                    <div className={`text-xs mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {crop.name}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-gray-600'}`}>
                      💰 {crop.seedCost}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-green-100' : 'text-green-700'}`}>
                      Sell: ${marketPrice}
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-ping">
                        <span className="text-yellow-900 text-xs">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Button
                onClick={() => {
                  setShowCropMenu(false);
                  setPlantMode(false);
                  setSelectedCrop(null);
                }}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
