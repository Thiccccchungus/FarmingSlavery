import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Leaf, Zap, Info, Sprout, ShoppingCart, Droplet, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { GameState, Screen, CROP_TYPES } from '../App';
import FarmPlot from './FarmPlot';
import DataPanel from './DataPanel';
import CropSelector from './CropSelector';
import MarketPrices from './MarketPrices';
import CashNotification from './CashNotification';

interface DashboardProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onNavigate: (screen: Screen) => void;
}

export default function Dashboard({ gameState, setGameState, onNavigate }: DashboardProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [cashNotifications, setCashNotifications] = useState<{ id: number; amount: number }[]>([]);

  const plantCrop = (plotId: number, cropId: string) => {
    const crop = CROP_TYPES.find((c) => c.id === cropId);
    if (!crop) return;

    const plot = gameState.plots.find((p) => p.id === plotId);
    if (!plot || !plot.unlocked || plot.crop) return;

    // Check resources
    if (gameState.cash < crop.seedCost) {
      alert('Not enough cash!');
      return;
    }
    if (gameState.water < crop.waterNeeded) {
      alert('Not enough water!');
      return;
    }
    if (gameState.energy < crop.energyNeeded) {
      alert('Not enough energy!');
      return;
    }

    const updatedPlots = gameState.plots.map((p) => {
      if (p.id === plotId) {
        return { 
          ...p, 
          crop: cropId, 
          growthProgress: 0, 
          harvestable: false,
          plantedAt: Date.now(),
        };
      }
      return p;
    });

    setGameState({
      ...gameState,
      plots: updatedPlots,
      cash: gameState.cash - crop.seedCost,
      water: gameState.water - crop.waterNeeded,
      energy: gameState.energy - crop.energyNeeded,
      costs: { ...gameState.costs, seeds: gameState.costs.seeds + crop.seedCost },
    });
    
    setShowCropSelector(false);
    setSelectedAction(null);
  };

  const harvestCrop = (plotId: number) => {
    const plot = gameState.plots.find((p) => p.id === plotId);
    if (!plot || !plot.harvestable || !plot.crop) return;

    const crop = CROP_TYPES.find((c) => c.id === plot.crop);
    if (!crop) return;

    const marketPrice = gameState.market[plot.crop]?.currentPrice || crop.basePrice;
    const revenue = marketPrice;

    const updatedPlots = gameState.plots.map((p) => {
      if (p.id === plotId) {
        return { ...p, crop: null, growthProgress: 0, harvestable: false, plantedAt: undefined };
      }
      return p;
    });

    const newRevenue = [...gameState.weeklyRevenue];
    newRevenue[newRevenue.length - 1] += revenue;

    setGameState({
      ...gameState,
      plots: updatedPlots,
      cash: gameState.cash + revenue,
      weeklyProfit: gameState.weeklyProfit + revenue,
      weeklyRevenue: newRevenue,
    });

    // Add cash notification
    setCashNotifications((prev) => [...prev, { id: Date.now(), amount: revenue }]);
  };

  const unlockPlot = () => {
    const lockedPlot = gameState.plots.find((p) => !p.unlocked);
    if (!lockedPlot) return;

    const cost = 1000;
    if (gameState.cash < cost) {
      alert('Not enough cash!');
      return;
    }

    const updatedPlots = gameState.plots.map((p) => {
      if (p.id === lockedPlot.id) {
        return { ...p, unlocked: true };
      }
      return p;
    });

    setGameState({
      ...gameState,
      plots: updatedPlots,
      cash: gameState.cash - cost,
      capital: gameState.capital + cost,
    });
  };

  const handlePlotClick = (plotId: number) => {
    const plot = gameState.plots.find((p) => p.id === plotId);
    if (!plot || !plot.unlocked) return;

    if (selectedAction === 'plant' && !plot.crop) {
      setSelectedPlotId(plotId);
      setShowCropSelector(true);
    } else if (selectedAction === 'harvest' && plot.crop) {
      // Check if crop is harvestable based on growth time
      const crop = CROP_TYPES.find((c) => c.id === plot.crop);
      if (!crop || !plot.plantedAt) return;
      
      const elapsed = (Date.now() - plot.plantedAt) / 1000;
      const isHarvestable = elapsed >= crop.growthTime;
      
      if (isHarvestable) {
        harvestCrop(plotId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-emerald-100">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Sprout className="w-8 h-8" />
            <h1 className="text-white">Eco-Farm Tycoon</h1>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Week {gameState.week}</div>
          </div>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="bg-white border-b-4 border-green-200 p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <TooltipProvider>
              {/* Cash */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <Info className="w-3 h-3 text-green-500 ml-auto" />
                    </div>
                    <div className="text-xs text-green-700">Cash</div>
                    <div className="text-green-900">${gameState.cash}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Money you have available to spend</p>
                </TooltipContent>
              </Tooltip>

              {/* Capital */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-3 border-2 border-sky-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-sky-600" />
                      <Info className="w-3 h-3 text-sky-500 ml-auto" />
                    </div>
                    <div className="text-xs text-sky-700">Capital</div>
                    <div className="text-sky-900">${gameState.capital}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Money invested in your business</p>
                </TooltipContent>
              </Tooltip>

              {/* Profit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border-2 border-yellow-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      <Info className="w-3 h-3 text-yellow-500 ml-auto" />
                    </div>
                    <div className="text-xs text-yellow-700">Weekly</div>
                    <div className={gameState.weeklyProfit >= 0 ? 'text-green-700' : 'text-red-600'}>
                      {gameState.weeklyProfit >= 0 ? '+' : ''}${gameState.weeklyProfit}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Revenue minus costs</p>
                </TooltipContent>
              </Tooltip>

              {/* Water */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border-2 border-blue-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-xs text-blue-700">Water</div>
                    <Progress value={(gameState.water / gameState.maxWater) * 100} className="h-2 mb-1" />
                    <div className="text-xs text-blue-800">{gameState.water}/{gameState.maxWater}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Water needed to grow crops. Regenerates over time.</p>
                </TooltipContent>
              </Tooltip>

              {/* Energy */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 border-2 border-amber-200 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-xs text-amber-700">Energy</div>
                    <Progress value={(gameState.energy / gameState.maxEnergy) * 100} className="h-2 mb-1" />
                    <div className="text-xs text-amber-800">{gameState.energy}/{gameState.maxEnergy}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Energy for farming operations. Regenerates over time.</p>
                </TooltipContent>
              </Tooltip>

              {/* Staff */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 border-2 border-pink-200 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-xs text-pink-700">Staff</div>
                <Progress value={gameState.staffHappiness} className="h-2 mb-1" />
                <div className="text-xs text-pink-800">{Math.round(gameState.staffHappiness)}%</div>
              </div>

              {/* Eco Score */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 border-2 border-emerald-200 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xs text-emerald-700">Eco</div>
                <Progress value={gameState.sustainabilityScore} className="h-2 mb-1" />
                <div className="text-xs text-emerald-800">{Math.round(gameState.sustainabilityScore)}%</div>
              </div>

              {/* Plots */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border-2 border-purple-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Sprout className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-xs text-purple-700">Plots</div>
                <div className="text-purple-900">
                  {gameState.plots.filter(p => p.unlocked).length}/{gameState.plots.length}
                </div>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-3 space-y-4">
              <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-green-200">
                <h3 className="text-green-800 mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => setSelectedAction(selectedAction === 'plant' ? null : 'plant')}
                    className={`w-full justify-start rounded-xl transition-all ${
                      selectedAction === 'plant'
                        ? 'bg-green-600 text-white shadow-lg scale-105'
                        : 'bg-green-50 hover:bg-green-100 text-green-800'
                    }`}
                    variant="ghost"
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    Plant Crops
                  </Button>
                  <Button
                    onClick={() => setSelectedAction(selectedAction === 'harvest' ? null : 'harvest')}
                    className={`w-full justify-start rounded-xl transition-all ${
                      selectedAction === 'harvest'
                        ? 'bg-yellow-600 text-white shadow-lg scale-105'
                        : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800'
                    }`}
                    variant="ghost"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Harvest & Sell
                  </Button>
                  <Button
                    onClick={unlockPlot}
                    className="w-full justify-start bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl"
                    variant="ghost"
                  >
                    <Leaf className="w-4 h-4 mr-2" />
                    Unlock Plot ($1000)
                  </Button>
                </div>

                {selectedAction && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 animate-in fade-in">
                    <p className="text-xs text-blue-900">
                      {selectedAction === 'plant' && '👆 Click on an empty plot to select a crop to plant'}
                      {selectedAction === 'harvest' && '👆 Click on ready crops (glowing) to harvest and sell'}
                    </p>
                  </div>
                )}
              </Card>

              <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-purple-200">
                <h3 className="text-purple-800 mb-4">Navigation</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => onNavigate('shop')}
                    className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl"
                    variant="ghost"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shop
                  </Button>
                  <Button
                    onClick={() => onNavigate('staff')}
                    className="w-full justify-start bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl"
                    variant="ghost"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Staff Management
                  </Button>
                  <Button
                    onClick={() => onNavigate('financial')}
                    className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl"
                    variant="ghost"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial Report
                  </Button>
                </div>
              </Card>

              <MarketPrices market={gameState.market} />
            </div>
          )}

          {/* Center Farm View */}
          <div className={showSidebar ? 'lg:col-span-6' : 'lg:col-span-9'}>
            <Card className="p-6 bg-gradient-to-b from-green-200 via-green-100 to-amber-100 rounded-3xl shadow-xl border-4 border-green-300 min-h-[600px] relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-600 rounded-full" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600 rounded-full" />
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <h2 className="text-green-900 flex items-center justify-center gap-2">
                    <Sprout className="w-6 h-6" />
                    Your Farm
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {gameState.plots.map((plot) => (
                    <FarmPlot
                      key={plot.id}
                      plot={plot}
                      selectedAction={selectedAction}
                      onClick={() => handlePlotClick(plot.id)}
                      gameState={gameState}
                    />
                  ))}
                </div>

                {/* Farm Infrastructure */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border-2 border-blue-200 hover:scale-105 transition-all">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <Droplet className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-blue-900">Water Station</p>
                    <Progress value={(gameState.water / gameState.maxWater) * 100} className="h-2 mt-2" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border-2 border-yellow-200 hover:scale-105 transition-all">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-amber-900">Solar Panel</p>
                    <Progress value={(gameState.energy / gameState.maxEnergy) * 100} className="h-2 mt-2" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Data Panel */}
          <div className="lg:col-span-3">
            <DataPanel gameState={gameState} />
          </div>
        </div>
      </div>

      {/* Crop Selector Modal */}
      {showCropSelector && selectedPlotId && (
        <CropSelector
          gameState={gameState}
          onSelect={(cropId) => plantCrop(selectedPlotId, cropId)}
          onClose={() => {
            setShowCropSelector(false);
            setSelectedPlotId(null);
          }}
        />
      )}

      {/* Cash Notifications */}
      {cashNotifications.map((notification) => (
        <CashNotification 
          key={notification.id} 
          amount={notification.amount}
          onComplete={() => {
            setCashNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }}
        />
      ))}
    </div>
  );
}