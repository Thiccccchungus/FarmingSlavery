import { ArrowLeft, Wrench, Cog, Leaf, Zap, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { GameState } from '../App';

interface ShopProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onBack: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  type: 'tool' | 'machine' | 'expansion' | 'energy';
  cost: number;
  roi: number;
  paybackWeeks: number;
  description: string;
  icon: any;
  effect: {
    type: string;
    value: number;
  };
}

const shopItems: ShopItem[] = [
  {
    id: 'hoe',
    name: 'Advanced Hoe',
    type: 'tool',
    cost: 300,
    roi: 20,
    paybackWeeks: 3,
    description: 'Increases planting speed by 25%',
    icon: Wrench,
    effect: { type: 'efficiency', value: 25 },
  },
  {
    id: 'sprinkler',
    name: 'Auto Sprinkler',
    type: 'machine',
    cost: 800,
    roi: 35,
    paybackWeeks: 5,
    description: 'Automatically waters crops, saves time',
    icon: Cog,
    effect: { type: 'automation', value: 1 },
  },
  {
    id: 'fertilizer-drone',
    name: 'Fertilizer Drone',
    type: 'machine',
    cost: 1500,
    roi: 50,
    paybackWeeks: 6,
    description: 'Increases crop yield by 40%',
    icon: Cog,
    effect: { type: 'yield', value: 40 },
  },
  {
    id: 'plot-expansion',
    name: 'New Land Plot',
    type: 'expansion',
    cost: 1000,
    roi: 45,
    paybackWeeks: 4,
    description: 'Unlock a new plot for farming',
    icon: Leaf,
    effect: { type: 'plot', value: 1 },
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel',
    type: 'energy',
    cost: 1200,
    roi: 40,
    paybackWeeks: 8,
    description: 'Reduces energy costs by 30%',
    icon: Zap,
    effect: { type: 'energyCost', value: -30 },
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    type: 'energy',
    cost: 2000,
    roi: 55,
    paybackWeeks: 10,
    description: 'Major energy savings, +20 eco score',
    icon: Zap,
    effect: { type: 'energyCost', value: -50 },
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    type: 'expansion',
    cost: 2500,
    roi: 60,
    paybackWeeks: 7,
    description: 'Grow crops year-round, faster growth',
    icon: Leaf,
    effect: { type: 'greenhouse', value: 1 },
  },
  {
    id: 'water-system',
    name: 'Advanced Water System',
    type: 'machine',
    cost: 1800,
    roi: 48,
    paybackWeeks: 9,
    description: 'Efficient irrigation, saves water',
    icon: Cog,
    effect: { type: 'waterEfficiency', value: 50 },
  },
];

export default function Shop({ gameState, setGameState, onBack }: ShopProps) {
  const purchaseItem = (item: ShopItem) => {
    if (gameState.cash < item.cost) return;

    const newInventory = [...gameState.inventory, { ...item, owned: true }];
    
    let updatedState = {
      ...gameState,
      cash: gameState.cash - item.cost,
      capital: gameState.capital + item.cost,
      inventory: newInventory,
    };

    // Apply effects
    if (item.effect.type === 'energyCost') {
      updatedState.sustainabilityScore = Math.min(100, updatedState.sustainabilityScore + 15);
      updatedState.energyUsage = Math.max(0, updatedState.energyUsage + item.effect.value);
    }

    setGameState(updatedState);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool':
        return 'bg-orange-500';
      case 'machine':
        return 'bg-blue-500';
      case 'expansion':
        return 'bg-green-500';
      case 'energy':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isOwned = (itemId: string) => {
    return gameState.inventory.some((inv) => inv.id === itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-purple-900">Farm Shop</h2>
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2">
            <span className="text-green-700">Cash:</span>
            <span className="text-green-900">${gameState.cash}</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Smart investing!</strong> Check the ROI (Return on Investment) and payback period before buying.
            Items with higher ROI will earn their cost back faster!
          </p>
        </div>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shopItems.map((item) => {
          const Icon = item.icon;
          const owned = isOwned(item.id);

          return (
            <Card
              key={item.id}
              className={`p-5 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all ${
                owned ? 'opacity-60' : ''
              }`}
            >
              {/* Type Badge */}
              <div className="flex justify-between items-start mb-3">
                <Badge className={`${getTypeColor(item.type)} text-white capitalize`}>
                  {item.type}
                </Badge>
                {owned && (
                  <Badge className="bg-green-500 text-white">
                    Owned
                  </Badge>
                )}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 ${getTypeColor(item.type)} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Name & Description */}
              <h3 className="text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost:</span>
                  <span className="text-gray-900">${item.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI:</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-700">{item.roi}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payback:</span>
                  <span className="text-blue-700">{item.paybackWeeks} weeks</span>
                </div>
              </div>

              {/* ROI Meter */}
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">ROI Meter</div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${Math.min(100, item.roi)}%` }}
                  />
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => purchaseItem(item)}
                disabled={gameState.cash < item.cost || owned}
                className={`w-full rounded-xl ${
                  gameState.cash < item.cost
                    ? 'bg-gray-300'
                    : owned
                    ? 'bg-green-500'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {owned ? 'Purchased' : gameState.cash < item.cost ? 'Not Enough Cash' : `Buy - $${item.cost}`}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
