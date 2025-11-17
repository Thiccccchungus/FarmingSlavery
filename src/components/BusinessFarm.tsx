import { useState, useEffect } from 'react';
import { GameState, CROP_TYPES, GameEvent } from '../App';
import BusinessHUD from './BusinessHUD';
import FarmGridBusiness from './FarmGridBusiness';
import CropSelectorSide from './CropSelectorSide';
import WorkerPanel from './WorkerPanel';
import FinancialDashboard from './FinancialDashboard';
import UpgradesPanel from './UpgradesPanel';
import MarketPanel from './MarketPanel';
import QuestsPanel from './QuestsPanel';
import BusinessEventCard from './BusinessEventCard';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Building2, Users, TrendingUp, ShoppingCart, Target, Sprout } from 'lucide-react';

interface BusinessFarmProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

type ActivePanel = 'farm' | 'workers' | 'financials' | 'upgrades' | 'market' | 'quests';

export default function BusinessFarm({ gameState, setGameState }: BusinessFarmProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('farm');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  // Update crop growth stages
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setGameState((prev) => {
        const smartIrrigation = prev.upgrades.find((u) => u.id === 'smart-irrigation')?.owned;
        const growthMultiplier = smartIrrigation ? 1.25 : 1;

        const updatedPlots = prev.plots.map((plot) => {
          if (plot.crop && plot.plantedAt) {
            const crop = CROP_TYPES.find((c) => c.id === plot.crop);
            if (!crop) return plot;

            const elapsed = (Date.now() - plot.plantedAt) / 1000;
            const adjustedGrowthTime = crop.growthTime / growthMultiplier;
            const progress = elapsed / adjustedGrowthTime;

            let stage: 'empty' | 'seedling' | 'growing' | 'mature' = 'empty';
            if (progress < 0.33) stage = 'seedling';
            else if (progress < 0.8) stage = 'growing';
            else stage = 'mature';

            return { ...plot, stage };
          }
          return plot;
        });

        return { ...prev, plots: updatedPlots };
      });
    }, 500);

    return () => clearInterval(growthInterval);
  }, [setGameState]);

  // Random business events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.15 && !currentEvent) {
        triggerBusinessEvent();
      }
    }, 45000);

    return () => clearInterval(eventInterval);
  }, [currentEvent]);

  // Auto-harvest if enabled
  useEffect(() => {
    if (gameState.automationLevel.harvesting) {
      const autoHarvestInterval = setInterval(() => {
        handleHarvestAll(true);
      }, 5000);

      return () => clearInterval(autoHarvestInterval);
    }
  }, [gameState.automationLevel.harvesting]);

  // Daily payroll
  useEffect(() => {
    const payrollInterval = setInterval(() => {
      setGameState((prev) => {
        const hiredWorkers = prev.workers.filter((w) => w.hired);
        const dailyPayroll = hiredWorkers.reduce((sum, w) => sum + w.wage, 0);

        if (dailyPayroll > 0) {
          toast.info(`Daily payroll: -$${dailyPayroll}`);
          
          return {
            ...prev,
            cash: prev.cash - dailyPayroll,
            totalExpenses: prev.totalExpenses + dailyPayroll,
          };
        }
        return prev;
      });
    }, 60000); // Every minute for demo

    return () => clearInterval(payrollInterval);
  }, [setGameState]);

  const triggerBusinessEvent = () => {
    const events: GameEvent[] = [
      {
        id: 1,
        type: 'worker',
        title: 'Worker Strike!',
        description: 'Employees demand better wages',
        icon: '✊',
        businessConcept: 'Labor costs impact profitability',
        choices: [
          {
            text: 'Raise wages (+$20/worker)',
            cost: 0,
            effect: (state) => ({
              ...state,
              workers: state.workers.map((w) => w.hired ? { ...w, wage: w.wage + 20, morale: 100 } : w),
            }),
            explanation: 'Higher morale = better efficiency',
          },
          {
            text: 'Negotiate compromise',
            effect: (state) => ({
              ...state,
              workers: state.workers.map((w) => w.hired ? { ...w, morale: Math.max(50, w.morale - 20) } : w),
            }),
            explanation: 'Morale drops, productivity suffers',
          },
        ],
      },
      {
        id: 2,
        type: 'investment',
        title: 'Investment Opportunity',
        description: 'Expand to neighboring land',
        icon: '🏞️',
        businessConcept: 'ROI = Return on Investment',
        choices: [
          {
            text: 'Invest $500 for 4 plots',
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
            }),
            explanation: 'More plots = more revenue potential',
          },
          {
            text: 'Save cash for now',
            effect: (state) => state,
            explanation: 'Conservative approach',
          },
        ],
      },
      {
        id: 3,
        type: 'competitor',
        title: 'Competitor Undercuts Prices',
        description: 'Rival farm drops prices by 30%',
        icon: '⚔️',
        businessConcept: 'Competition affects market prices',
        choices: [
          {
            text: 'Match prices (temp profit loss)',
            effect: (state) => {
              const newMarket = { ...state.market };
              Object.keys(newMarket).forEach((key) => {
                newMarket[key] = {
                  ...newMarket[key],
                  currentPrice: Math.round(newMarket[key].currentPrice * 0.7),
                };
              });
              return { ...state, market: newMarket };
            },
            explanation: 'Maintain market share',
          },
          {
            text: 'Invest in marketing ($200)',
            cost: 200,
            effect: (state) => ({
              ...state,
              cash: state.cash - 200,
            }),
            explanation: 'Differentiate through branding',
          },
        ],
      },
      {
        id: 4,
        type: 'order',
        title: 'Bulk Contract Opportunity',
        description: 'Restaurant chain wants 100 wheat @ $40 each',
        icon: '🍽️',
        businessConcept: 'B2B contracts = stable revenue',
        choices: [
          {
            text: 'Accept ($4000 revenue)',
            effect: (state) => {
              const wheat = state.inventory.wheat || 0;
              if (wheat >= 100) {
                return {
                  ...state,
                  cash: state.cash + 4000,
                  inventory: { ...state.inventory, wheat: wheat - 100 },
                  totalRevenue: state.totalRevenue + 4000,
                };
              }
              toast.error('Not enough wheat in inventory!');
              return state;
            },
            explanation: 'High-volume, guaranteed income',
          },
          {
            text: 'Decline',
            effect: (state) => state,
            explanation: 'Focus on retail market',
          },
        ],
      },
      {
        id: 5,
        type: 'breakdown',
        title: 'Equipment Failure',
        description: 'Tractor needs urgent repair',
        icon: '🔧',
        businessConcept: 'Maintenance = operating expense',
        choices: [
          {
            text: 'Repair now ($300)',
            cost: 300,
            effect: (state) => ({
              ...state,
              cash: state.cash - 300,
              totalExpenses: state.totalExpenses + 300,
            }),
            explanation: 'Avoid downtime',
          },
          {
            text: 'Delay repair (lose 3 days)',
            effect: (state) => state,
            explanation: 'Cash flow preserved, productivity lost',
          },
        ],
      },
      {
        id: 6,
        type: 'market',
        title: 'Market Crash!',
        description: 'Economic downturn hits crop prices',
        icon: '📉',
        businessConcept: 'Market volatility = business risk',
        choices: [
          {
            text: 'Diversify crops',
            effect: (state) => state,
            explanation: 'Spread risk across products',
          },
          {
            text: 'Hold inventory & wait',
            effect: (state) => state,
            explanation: 'Speculation strategy',
          },
        ],
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(randomEvent);
  };

  const handlePlantCrop = (plotId: number, cropId: string) => {
    const plot = gameState.plots.find((p) => p.id === plotId);
    const crop = CROP_TYPES.find((c) => c.id === cropId);

    if (!plot || !crop || !plot.unlocked || plot.crop) return;

    if (gameState.cash < crop.seedCost) {
      toast.error('Not enough cash! 💰');
      return;
    }

    console.log('🎵 SOUND: plant_pop.mp3');

    setGameState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.id === plotId
          ? { ...p, crop: cropId, plantedAt: Date.now(), stage: 'seedling' as const }
          : p
      );

      return {
        ...prev,
        plots: updatedPlots,
        cash: prev.cash - crop.seedCost,
        totalExpenses: prev.totalExpenses + crop.seedCost,
      };
    });

    toast.success(`${crop.icon} Planted ${crop.name}!`);
  };

  const handleHarvestAll = (auto = false) => {
    const maturePlots = gameState.plots.filter((p) => p.stage === 'mature' && p.crop);

    if (maturePlots.length === 0) {
      if (!auto) toast.error('No crops ready to harvest! 🌱');
      return;
    }

    if (!auto) console.log('🎵 SOUND: harvest_whoosh.mp3');

    let totalRevenue = 0;
    let totalXP = 0;
    const newInventory = { ...gameState.inventory };

    maturePlots.forEach((plot) => {
      const crop = CROP_TYPES.find((c) => c.id === plot.crop);
      if (crop) {
        let marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;

        // Apply processing plant bonus
        const processingPlant = gameState.upgrades.find((u) => u.id === 'processing-plant')?.owned;
        if (processingPlant) marketPrice = Math.round(marketPrice * 1.5);

        totalRevenue += marketPrice;
        totalXP += crop.xp;

        // Add to inventory instead of auto-selling
        newInventory[crop.id] = (newInventory[crop.id] || 0) + 1;
      }
    });

    // Sell from inventory
    Object.keys(newInventory).forEach((cropId) => {
      const quantity = newInventory[cropId];
      if (quantity > 0) {
        const crop = CROP_TYPES.find((c) => c.id === cropId);
        if (crop) {
          const price = gameState.market[cropId]?.currentPrice || crop.basePrice;
          const processingPlant = gameState.upgrades.find((u) => u.id === 'processing-plant')?.owned;
          const finalPrice = processingPlant ? Math.round(price * 1.5) : price;
          totalRevenue = quantity * finalPrice;
        }
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
        inventory: {},
        totalRevenue: prev.totalRevenue + totalRevenue,
        xp: leveledUp ? newXP - prev.xpToNextLevel : newXP,
        level: leveledUp ? prev.level + 1 : prev.level,
        xpToNextLevel: leveledUp ? prev.xpToNextLevel + 50 : prev.xpToNextLevel,
        quests: updatedQuests,
      };
    });

    if (!auto) toast.success(`💰 Sold ${maturePlots.length} crops for $${totalRevenue}!`);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-green-100 to-green-200">
      {/* HUD */}
      <BusinessHUD gameState={gameState} />

      {/* Main Content Area */}
      <div className="pt-24 pb-6 px-4">
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
            <div className="flex gap-4">
              {/* Crop Selector Side Panel */}
              <CropSelectorSide
                gameState={gameState}
                selectedCrop={selectedCrop}
                setSelectedCrop={setSelectedCrop}
              />

              {/* Farm Grid */}
              <div className="flex-1">
                <FarmGridBusiness
                  plots={gameState.plots}
                  selectedCrop={selectedCrop}
                  onPlantCrop={handlePlantCrop}
                  market={gameState.market}
                />
                
                {/* Harvest Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => handleHarvestAll(false)}
                    className="px-12 py-6 rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white shadow-2xl transform hover:scale-105 transition-all text-xl"
                  >
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Harvest & Sell All
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'workers' && <WorkerPanel gameState={gameState} setGameState={setGameState} />}
          {activePanel === 'financials' && <FinancialDashboard gameState={gameState} />}
          {activePanel === 'upgrades' && <UpgradesPanel gameState={gameState} setGameState={setGameState} />}
          {activePanel === 'market' && <MarketPanel gameState={gameState} />}
          {activePanel === 'quests' && <QuestsPanel gameState={gameState} setGameState={setGameState} />}
        </div>
      </div>

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
