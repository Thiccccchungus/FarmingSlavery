import { useState, useEffect } from 'react';
import { GameState, CROP_TYPES, GameEvent } from '../App';
import FarmHUD from './FarmHUD';
import FarmGrid from './FarmGrid';
import QuickActionBar from './QuickActionBar';
import FloatingReward from './FloatingReward';
import EventCard from './EventCard';
import FarmHelper from './FarmHelper';
import AmbientEffects from './AmbientEffects';
import { toast } from 'sonner@2.0.3';

interface HayDayFarmProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

interface FloatingRewardData {
  id: number;
  type: 'coin' | 'xp';
  amount: number;
  x: number;
  y: number;
}

export default function HayDayFarm({ gameState, setGameState }: HayDayFarmProps) {
  const [plantMode, setPlantMode] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [floatingRewards, setFloatingRewards] = useState<FloatingRewardData[]>([]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showHelper, setShowHelper] = useState(true);

  // Update crop growth stages
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setGameState((prev) => {
        const updatedPlots = prev.plots.map((plot) => {
          if (plot.crop && plot.plantedAt) {
            const crop = CROP_TYPES.find((c) => c.id === plot.crop);
            if (!crop) return plot;

            const elapsed = (Date.now() - plot.plantedAt) / 1000;
            const progress = elapsed / crop.growthTime;

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

  // Random events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.2 && !currentEvent) {
        triggerRandomEvent();
      }
    }, 45000);

    return () => clearInterval(eventInterval);
  }, [currentEvent]);

  const triggerRandomEvent = () => {
    const events: GameEvent[] = [
      {
        id: 1,
        type: 'disease',
        title: 'Crop Disease!',
        description: 'Aphids spotted on your farm',
        icon: '🦗',
        choices: [
          {
            text: 'Buy pesticide',
            cost: 100,
            effect: (state) => ({ ...state, cash: state.cash - 100 }),
          },
          {
            text: 'Use natural methods',
            effect: (state) => {
              const damaged = Math.floor(Math.random() * 3);
              const plots = state.plots.map((p, i) => 
                i < damaged ? { ...p, crop: null, stage: 'empty' as const } : p
              );
              return { ...state, plots };
            },
          },
        ],
      },
      {
        id: 2,
        type: 'market',
        title: 'Market Boom!',
        description: 'Demand for wheat skyrockets',
        icon: '📈',
        choices: [
          {
            text: 'Great!',
            effect: (state) => {
              const newMarket = { ...state.market };
              newMarket.wheat = { ...newMarket.wheat, currentPrice: newMarket.wheat.currentPrice * 1.5, demand: 100 };
              return { ...state, market: newMarket };
            },
          },
        ],
      },
      {
        id: 3,
        type: 'weather',
        title: 'Drought Warning',
        description: 'Water shortage expected',
        icon: '☀️',
        choices: [
          {
            text: 'Install irrigation',
            cost: 200,
            effect: (state) => ({ ...state, cash: state.cash - 200, maxEnergy: state.maxEnergy + 10 }),
          },
          {
            text: 'Risk it',
            effect: (state) => state,
          },
        ],
      },
      {
        id: 4,
        type: 'order',
        title: 'Bulk Order!',
        description: 'Restaurant wants 50 tomatoes',
        icon: '🍽️',
        choices: [
          {
            text: 'Accept (+$500)',
            effect: (state) => {
              const tomatoes = state.inventory.tomato || 0;
              if (tomatoes >= 50) {
                return { 
                  ...state, 
                  cash: state.cash + 500,
                  inventory: { ...state.inventory, tomato: tomatoes - 50 },
                };
              }
              return state;
            },
          },
          {
            text: 'Decline',
            effect: (state) => state,
          },
        ],
      },
      {
        id: 5,
        type: 'breakdown',
        title: 'Equipment Failure',
        description: 'Harvester needs repair',
        icon: '🔧',
        choices: [
          {
            text: 'Repair now',
            cost: 150,
            effect: (state) => ({ ...state, cash: state.cash - 150 }),
          },
          {
            text: 'Manual harvest',
            effect: (state) => ({ ...state, energy: Math.max(0, state.energy - 20) }),
          },
        ],
      },
      {
        id: 6,
        type: 'cost',
        title: 'Fertilizer Price Hike',
        description: 'Suppliers increased prices by 30%',
        icon: '💰',
        choices: [
          {
            text: 'Buy in bulk',
            cost: 250,
            effect: (state) => ({ ...state, cash: state.cash - 250 }),
          },
          {
            text: 'Use less',
            effect: (state) => state,
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
      toast.error('Not enough coins! 💰');
      return;
    }

    if (gameState.energy < crop.energyNeeded) {
      toast.error('Not enough energy! ⚡');
      return;
    }

    // Play sound placeholder
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
        energy: prev.energy - crop.energyNeeded,
      };
    });

    toast.success(`${crop.icon} Planted ${crop.name}!`);
  };

  const handleHarvestAll = () => {
    const maturePlots = gameState.plots.filter((p) => p.stage === 'mature' && p.crop);
    
    if (maturePlots.length === 0) {
      toast.error('No crops ready to harvest! 🌱');
      return;
    }

    // Play sound placeholder
    console.log('🎵 SOUND: harvest_whoosh.mp3');

    let totalCoins = 0;
    let totalXP = 0;

    maturePlots.forEach((plot) => {
      const crop = CROP_TYPES.find((c) => c.id === plot.crop);
      if (crop) {
        const marketPrice = gameState.market[crop.id]?.currentPrice || crop.basePrice;
        totalCoins += marketPrice;
        totalXP += crop.xp;

        // Add floating reward
        setFloatingRewards((prev) => [
          ...prev,
          {
            id: Date.now() + plot.id,
            type: 'coin',
            amount: marketPrice,
            x: 50 + (plot.id % 4) * 20,
            y: 40 + Math.floor(plot.id / 4) * 15,
          },
        ]);
      }
    });

    setGameState((prev) => {
      const updatedPlots = prev.plots.map((p) =>
        p.stage === 'mature' ? { ...p, crop: null, stage: 'empty' as const, plantedAt: undefined } : p
      );

      const newXP = prev.xp + totalXP;
      const leveledUp = newXP >= prev.xpToNextLevel;

      return {
        ...prev,
        plots: updatedPlots,
        cash: prev.cash + totalCoins,
        xp: leveledUp ? newXP - prev.xpToNextLevel : newXP,
        level: leveledUp ? prev.level + 1 : prev.level,
        xpToNextLevel: leveledUp ? prev.xpToNextLevel + 50 : prev.xpToNextLevel,
      };
    });

    toast.success(`Harvested ${maturePlots.length} crops! +$${totalCoins} 💰`);
  };

  const handleEventChoice = (choice: GameEvent['choices'][0]) => {
    if (choice.cost && gameState.cash < choice.cost) {
      toast.error('Not enough coins!');
      return;
    }

    setGameState(choice.effect(gameState));
    setCurrentEvent(null);
    
    // Play sound
    console.log('🎵 SOUND: event_complete.mp3');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-green-100 to-green-200 relative overflow-hidden">
      {/* Ambient Effects */}
      <AmbientEffects time={gameState.time} />

      {/* HUD */}
      <FarmHUD gameState={gameState} />

      {/* Main Farm Area */}
      <div className="pt-24 pb-32 px-4">
        <FarmGrid
          plots={gameState.plots}
          plantMode={plantMode}
          selectedCrop={selectedCrop}
          onPlantCrop={handlePlantCrop}
          market={gameState.market}
        />
      </div>

      {/* Quick Action Bar */}
      <QuickActionBar
        gameState={gameState}
        plantMode={plantMode}
        setPlantMode={setPlantMode}
        selectedCrop={selectedCrop}
        setSelectedCrop={setSelectedCrop}
        onHarvestAll={handleHarvestAll}
      />

      {/* Floating Rewards */}
      {floatingRewards.map((reward) => (
        <FloatingReward
          key={reward.id}
          type={reward.type}
          amount={reward.amount}
          x={reward.x}
          y={reward.y}
          onComplete={() => {
            setFloatingRewards((prev) => prev.filter((r) => r.id !== reward.id));
          }}
        />
      ))}

      {/* Event Card */}
      {currentEvent && (
        <EventCard event={currentEvent} onChoice={handleEventChoice} />
      )}

      {/* Farm Helper */}
      {showHelper && gameState.level < 3 && (
        <FarmHelper
          tutorialStep={gameState.tutorialStep}
          onDismiss={() => setShowHelper(false)}
          level={gameState.level}
        />
      )}
    </div>
  );
}
