import { useState, useEffect } from 'react';
import { GameState, CROP_TYPES, GameEvent } from '../App';
import BusinessHUD from './BusinessHUD';
import ImprovedFarmGrid from './ImprovedFarmGrid';
import BottomCropBar from './BottomCropBar';
import WorkerPanel from './WorkerPanel';
import FinancialDashboard from './FinancialDashboard';
import UpgradesPanel from './UpgradesPanel';
import MarketPanel from './MarketPanel';
import QuestsPanel from './QuestsPanel';
import BusinessEventCard from './BusinessEventCard';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Building2, Users, TrendingUp, ShoppingCart, Target, Sprout, Play, Pause, Zap } from 'lucide-react';

interface BusinessFarmProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

type ActivePanel = 'farm' | 'workers' | 'financials' | 'upgrades' | 'market' | 'quests';

export default function ImprovedBusinessFarm({ gameState, setGameState }: BusinessFarmProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('farm');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [plantingMode, setPlantingMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  // Update crop growth stages
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setGameState((prev) => {
        const smartIrrigation = prev.upgrades.find((u) => u.id === 'smart-irrigation')?.owned;
        const growthMultiplier = smartIrrigation ? 1.25 : 1;

        let hasChanges = false;
        const updatedPlots = prev.plots.map((plot) => {
          if (plot.crop && plot.plantedAt) {
            const crop = CROP_TYPES.find((c) => c.id === plot.crop);
            if (!crop) return plot;

            const elapsed = (Date.now() - plot.plantedAt) / 1000;
            const adjustedGrowthTime = crop.growthTime / growthMultiplier;
            const progress = elapsed / adjustedGrowthTime;

            let stage: 'empty' | 'seedling' | 'growing' | 'mature' = 'empty';
            if (progress >= 1.0) {
              stage = 'mature';
            } else if (progress >= 0.5) {
              stage = 'growing';
            } else if (progress >= 0.01) {
              stage = 'seedling';
            }

            if (stage !== plot.stage) {
              hasChanges = true;
            }

            return { ...plot, stage };
          }
          return plot;
        });

        // Only update state if there are actual changes
        if (hasChanges) {
          return { ...prev, plots: updatedPlots };
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(growthInterval);
  }, [setGameState]);

  // Worker automation - auto plant and harvest
  useEffect(() => {
    const workerInterval = setInterval(() => {
      setGameState((prev) => {
        const hiredWorkers = prev.workers.filter((w) => w.hired);
        if (hiredWorkers.length === 0) return prev;

        let updatedPlots = [...prev.plots];
        let cashChange = 0;
        let inventoryChange = { ...prev.inventory };
        let revenueChange = 0;
        let expenseChange = 0;
        let xpGained = 0;

        hiredWorkers.forEach((worker) => {
          // Auto-plant for planters
          if (worker.role === 'planter' && prev.cash >= 50) {
            const emptyPlot = updatedPlots.find((p) => p.unlocked && !p.crop);
            if (emptyPlot) {
              const randomCrop = CROP_TYPES[Math.floor(Math.random() * CROP_TYPES.length)];
              if (prev.cash >= randomCrop.seedCost) {
                const plotIndex = updatedPlots.findIndex((p) => p.id === emptyPlot.id);
                updatedPlots[plotIndex] = {
                  ...emptyPlot,
                  crop: randomCrop.id,
                  plantedAt: Date.now(),
                  stage: 'seedling',
                };
                cashChange -= randomCrop.seedCost;
                expenseChange += randomCrop.seedCost;
              }
            }
          }

          // Auto-harvest for harvesters
          if (worker.role === 'harvester') {
            const maturePlot = updatedPlots.find((p) => p.stage === 'mature' && p.crop);
            if (maturePlot) {
              const crop = CROP_TYPES.find((c) => c.id === maturePlot.crop);
              if (crop) {
                let price = prev.market[crop.id]?.currentPrice || crop.basePrice;
                
                // Apply processing plant bonus
                if (prev.upgrades.find((u) => u.id === 'processing-plant')?.owned) {
                  price = Math.round(price * 1.5);
                }

                // Apply worker efficiency
                const efficiency = worker.efficiency / 100;
                price = Math.round(price * efficiency);

                cashChange += price;
                revenueChange += price;
                xpGained += crop.xp;

                const plotIndex = updatedPlots.findIndex((p) => p.id === maturePlot.id);
                updatedPlots[plotIndex] = {
                  ...maturePlot,
                  crop: null,
                  stage: 'empty',
                  plantedAt: undefined,
                };
              }
            }
          }
        });

        // Apply solar panel cost reduction
        if (prev.upgrades.find((u) => u.id === 'solar-panel')?.owned) {
          expenseChange = Math.round(expenseChange * 0.8);
        }

        return {
          ...prev,
          plots: updatedPlots,
          cash: prev.cash + cashChange,
          inventory: inventoryChange,
          totalRevenue: prev.totalRevenue + revenueChange,
          totalExpenses: prev.totalExpenses + expenseChange,
          xp: prev.xp + xpGained,
        };
      });
    }, 5000); // Workers work every 5 seconds

    return () => clearInterval(workerInterval);
  }, [setGameState]);

  // Auto-harvest if automation enabled
  useEffect(() => {
    if (gameState.automationLevel.harvesting) {
      const autoHarvestInterval = setInterval(() => {
        handleHarvestAll(true);
      }, 3000);

      return () => clearInterval(autoHarvestInterval);
    }
  }, [gameState.automationLevel.harvesting]);

  // Random business events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.15 && !currentEvent) {
        triggerBusinessEvent();
      }
    }, 45000);

    return () => clearInterval(eventInterval);
  }, [currentEvent]);

  // Daily payroll
  useEffect(() => {
    const payrollInterval = setInterval(() => {
      setGameState((prev) => {
        const hiredWorkers = prev.workers.filter((w) => w.hired);
        const dailyPayroll = hiredWorkers.reduce((sum, w) => sum + w.wage, 0);

        if (dailyPayroll > 0 && prev.cash >= dailyPayroll) {
          return {
            ...prev,
            cash: prev.cash - dailyPayroll,
            totalExpenses: prev.totalExpenses + dailyPayroll,
          };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(payrollInterval);
  }, [setGameState]);

  // Wind turbine passive income
  useEffect(() => {
    if (gameState.upgrades.find((u) => u.id === 'wind-turbine')?.owned) {
      const incomeInterval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          cash: prev.cash + 50,
          totalRevenue: prev.totalRevenue + 50,
        }));
        toast.success('🌬️ Wind turbine: +$50!');
      }, 60000);

      return () => clearInterval(incomeInterval);
    }
  }, [gameState.upgrades, setGameState]);

  const triggerBusinessEvent = () => {
    const events: GameEvent[] = [
      {
        id: 1,
        type: 'worker',
        title: 'Worker Requests Raise',
        description: 'Your employee wants a $30/day salary increase',
        icon: '💼',
        businessConcept: 'Labor negotiation affects operating costs',
        choices: [
          {
            text: 'Approve raise',
            cost: 0,
            effect: (state) => ({
              ...state,
              workers: state.workers.map((w) => 
                w.hired && Math.random() < 0.5 
                  ? { ...w, wage: w.wage + 30, morale: 100, efficiency: Math.min(100, w.efficiency + 10) } 
                  : w
              ),
            }),
            explanation: 'Higher morale and efficiency',
          },
          {
            text: 'Deny request',
            effect: (state) => ({
              ...state,
              workers: state.workers.map((w) => 
                w.hired && Math.random() < 0.5 
                  ? { ...w, morale: Math.max(30, w.morale - 30), efficiency: Math.max(50, w.efficiency - 10) } 
                  : w
              ),
            }),
            explanation: 'Save costs, risk lower productivity',
          },
        ],
      },
      {
        id: 2,
        type: 'investment',
        title: 'Expand Your Farm',
        description: 'Purchase 4 new plots',
        icon: '🏞️',
        businessConcept: 'Capital investment for growth',
        choices: [
          {
            text: 'Buy plots ($500)',
            cost: 500,
            effect: (state) => ({
              ...state,
              cash: state.cash - 500,
              plots: state.plots.map((p, i) =>
                i >= state.unlockedPlots && i < state.unlockedPlots + 4
                  ? { ...p, unlocked: true }
                  : p
              ),
              unlockedPlots: state.unlockedPlots + 4,
              totalExpenses: state.totalExpenses + 500,
            }),
            explanation: 'More capacity = more revenue',
          },
          {
            text: 'Not now',
            effect: (state) => state,
            explanation: 'Maintain current scale',
          },
        ],
      },
      {
        id: 3,
        type: 'market',
        title: 'Festival Incoming!',
        description: 'Crop demand will surge 50%',
        icon: '🎉',
        businessConcept: 'Seasonal demand affects prices',
        choices: [
          {
            text: 'Plant extra crops',
            effect: (state) => {
              const newMarket = { ...state.market };
              Object.keys(newMarket).forEach((key) => {
                newMarket[key] = {
                  ...newMarket[key],
                  currentPrice: Math.round(newMarket[key].currentPrice * 1.5),
                  demand: Math.min(100, newMarket[key].demand + 30),
                };
              });
              return { ...state, market: newMarket };
            },
            explanation: 'Capitalize on high prices',
          },
          {
            text: 'Continue normally',
            effect: (state) => state,
            explanation: 'Standard operations',
          },
        ],
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(randomEvent);
  };

  const handlePlantCrop = (plotId: number) => {
    if (!plantingMode || !selectedCrop) return;

    const plot = gameState.plots.find((p) => p.id === plotId);
    const crop = CROP_TYPES.find((c) => c.id === selectedCrop);

    if (!plot || !crop || !plot.unlocked || plot.crop) return;

    if (gameState.cash < crop.seedCost) {
      toast.error('Not enough cash! 💰');
      return;
    }

    setGameState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.id === plotId
          ? { ...p, crop: selectedCrop, plantedAt: Date.now(), stage: 'seedling' as const }
          : p
      );

      return {
        ...prev,
        plots: updatedPlots,
        cash: prev.cash - crop.seedCost,
        totalExpenses: prev.totalExpenses + crop.seedCost,
      };
    });

    toast.success(`${crop.icon} Planted ${crop.name}!`, { duration: 1500 });
  };

  const handleHarvestAll = (auto = false) => {
    const maturePlots = gameState.plots.filter((p) => p.stage === 'mature' && p.crop);

    if (maturePlots.length === 0) {
      if (!auto) toast.error('No crops ready to harvest! 🌱');
      return;
    }

    let totalRevenue = 0;
    let totalXP = 0;

    maturePlots.forEach((plot) => {
      const crop = CROP_TYPES.find((c) => c.id === plot.crop);
      if (crop) {
        let marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;

        // Apply processing plant bonus
        const processingPlant = gameState.upgrades.find((u) => u.id === 'processing-plant')?.owned;
        if (processingPlant) marketPrice = Math.round(marketPrice * 1.5);

        // Apply marketing bonus
        const marketing = gameState.upgrades.find((u) => u.id === 'marketing-dept')?.owned;
        if (marketing) marketPrice = Math.round(marketPrice * 1.3);

        totalRevenue += marketPrice;
        totalXP += crop.xp;
      }
    });

    setGameState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.stage === 'mature' ? { ...p, crop: null, stage: 'empty' as const, plantedAt: undefined } : p
      );

      const newXP = prev.xp + totalXP;
      const leveledUp = newXP >= prev.xpToNextLevel;

      // Update quests
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === 1 && !q.completed) {
          const newCurrent = q.current + maturePlots.length;
          return { ...q, current: newCurrent, completed: newCurrent >= q.target };
        }
        if (q.id === 3 && !q.completed) {
          const newCurrent = prev.totalRevenue + totalRevenue;
          return { ...q, current: newCurrent, completed: newCurrent >= q.target };
        }
        return q;
      });

      return {
        ...prev,
        plots: updatedPlots,
        cash: prev.cash + totalRevenue,
        totalRevenue: prev.totalRevenue + totalRevenue,
        xp: leveledUp ? newXP - prev.xpToNextLevel : newXP,
        level: leveledUp ? prev.level + 1 : prev.level,
        xpToNextLevel: leveledUp ? prev.xpToNextLevel + 50 : prev.xpToNextLevel,
        quests: updatedQuests,
      };
    });

    if (!auto) {
      toast.success(`💰 Harvested ${maturePlots.length} crops for $${totalRevenue}!`);
      if (totalXP > 0) toast.info(`⭐ +${totalXP} XP!`, { duration: 2000 });
    }
  };

  const handleEventChoice = (choice: GameEvent['choices'][0]) => {
    if (choice.cost && gameState.cash < choice.cost) {
      toast.error('Not enough cash!');
      return;
    }

    setGameState(choice.effect(gameState));
    setCurrentEvent(null);

    if (choice.explanation) {
      toast.info(choice.explanation);
    }
  };

  const togglePlantingMode = () => {
    if (!selectedCrop) {
      toast.error('Select a crop first!');
      return;
    }
    setPlantingMode(!plantingMode);
    if (!plantingMode) {
      toast.success('🌱 Planting mode ON! Click plots to plant.');
    } else {
      toast.info('Planting mode OFF');
    }
  };

  const handleBuyPlot = () => {
    const nextLockedPlot = gameState.plots.find((p) => !p.unlocked);
    
    if (!nextLockedPlot) {
      toast.error('All plots already unlocked! 🎉');
      return;
    }

    if (gameState.cash < gameState.nextPlotCost) {
      toast.error(`Need $${gameState.nextPlotCost} to buy land! 💰`);
      return;
    }

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash - prev.nextPlotCost,
      totalExpenses: prev.totalExpenses + prev.nextPlotCost,
      plots: prev.plots.map((p) =>
        p.id === nextLockedPlot.id ? { ...p, unlocked: true } : p
      ),
      unlockedPlots: prev.unlockedPlots + 1,
      nextPlotCost: prev.nextPlotCost + 500,
    }));

    toast.success(`🏞️ Bought new plot! Next plot costs $${gameState.nextPlotCost + 500}`);
  };

  const matureCount = gameState.plots.filter((p) => p.stage === 'mature').length;
  const lockedPlotCount = gameState.plots.filter((p) => !p.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-green-100 to-green-200 pb-64">
      {/* HUD */}
      <BusinessHUD gameState={gameState} />

      {/* Main Content Area */}
      <div className="pt-32 px-4 mb-8">
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-2 flex gap-2 overflow-x-auto">
            <TabButton
              active={activePanel === 'farm'}
              onClick={() => setActivePanel('farm')}
              icon={<Sprout className="w-5 h-5" />}
              label="Farm"
            />
            <TabButton
              active={activePanel === 'workers'}
              onClick={() => setActivePanel('workers')}
              icon={<Users className="w-5 h-5" />}
              label="Workers"
            />
            <TabButton
              active={activePanel === 'financials'}
              onClick={() => setActivePanel('financials')}
              icon={<TrendingUp className="w-5 h-5" />}
              label="Financials"
            />
            <TabButton
              active={activePanel === 'upgrades'}
              onClick={() => setActivePanel('upgrades')}
              icon={<Building2 className="w-5 h-5" />}
              label="Upgrades"
            />
            <TabButton
              active={activePanel === 'market'}
              onClick={() => setActivePanel('market')}
              icon={<ShoppingCart className="w-5 h-5" />}
              label="Market"
            />
            <TabButton
              active={activePanel === 'quests'}
              onClick={() => setActivePanel('quests')}
              icon={<Target className="w-5 h-5" />}
              label="Quests"
            />
          </div>
        </div>

        {/* Panel Content */}
        <div className="max-w-7xl mx-auto">
          {activePanel === 'farm' && (
            <div className="space-y-4">
              {/* Action Buttons at Top */}
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  onClick={togglePlantingMode}
                  className={`px-8 py-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-all text-lg ${
                    plantingMode
                      ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600'
                      : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600'
                  } text-white`}
                >
                  {plantingMode ? (
                    <>
                      <Pause className="w-6 h-6 mr-2" />
                      Stop Planting
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-2" />
                      Start Planting
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleHarvestAll(false)}
                  disabled={matureCount === 0}
                  className="px-8 py-6 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white shadow-2xl transform hover:scale-105 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Harvest All ({matureCount})
                </Button>

                <Button
                  onClick={handleBuyPlot}
                  disabled={lockedPlotCount === 0}
                  className="px-8 py-6 rounded-3xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-2xl transform hover:scale-105 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Building2 className="w-6 h-6 mr-2" />
                  Buy Plot (${gameState.nextPlotCost})
                </Button>

                {gameState.automationLevel.harvesting && (
                  <div className="flex items-center gap-2 bg-purple-100 px-6 py-3 rounded-3xl border-2 border-purple-400">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-900">Auto-Harvest ON</span>
                  </div>
                )}
              </div>

              {/* Farm Grid */}
              <ImprovedFarmGrid
                plots={gameState.plots}
                plantingMode={plantingMode}
                selectedCrop={selectedCrop}
                onPlantCrop={handlePlantCrop}
                market={gameState.market}
                nextPlotCost={gameState.nextPlotCost}
              />
            </div>
          )}

          {activePanel === 'workers' && <WorkerPanel gameState={gameState} setGameState={setGameState} />}
          {activePanel === 'financials' && <FinancialDashboard gameState={gameState} />}
          {activePanel === 'upgrades' && <UpgradesPanel gameState={gameState} setGameState={setGameState} />}
          {activePanel === 'market' && <MarketPanel gameState={gameState} />}
          {activePanel === 'quests' && <QuestsPanel gameState={gameState} setGameState={setGameState} />}
        </div>
      </div>

      {/* Bottom Crop Selection Bar */}
      {activePanel === 'farm' && (
        <BottomCropBar
          gameState={gameState}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          plantingMode={plantingMode}
        />
      )}

      {/* Business Event Card */}
      {currentEvent && <BusinessEventCard event={currentEvent} onChoice={handleEventChoice} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
        active
          ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Button>
  );
}