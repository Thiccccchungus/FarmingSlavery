import { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ImprovedBusinessFarm from './components/ImprovedBusinessFarm';
import { Toaster } from './components/ui/sonner';

export type Screen = 'menu' | 'farm';

export interface CropType {
  id: string;
  name: string;
  icon: string;
  seedCost: number;
  basePrice: number;
  growthTime: number;
  xp: number;
}

export interface Worker {
  id: number;
  name: string;
  role: 'planter' | 'harvester' | 'manager';
  wage: number;
  morale: number;
  efficiency: number;
  hired: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'automation' | 'green-tech' | 'processing' | 'research' | 'marketing';
  icon: string;
  owned: boolean;
  benefit: string;
}

export interface MarketData {
  [cropId: string]: {
    currentPrice: number;
    demand: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface FinancialRecord {
  timestamp: number;
  revenue: number;
  expenses: number;
  profit: number;
  cash: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  concept: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
}

export interface GameState {
  cash: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  time: number;
  plots: Plot[];
  inventory: { [key: string]: number };
  market: MarketData;
  workers: Worker[];
  upgrades: Upgrade[];
  financialHistory: FinancialRecord[];
  totalRevenue: number;
  totalExpenses: number;
  quests: Quest[];
  unlockedPlots: number;
  nextPlotCost: number;
  automationLevel: {
    planting: boolean;
    harvesting: boolean;
  };
}

export interface Plot {
  id: number;
  unlocked: boolean;
  crop: string | null;
  plantedAt?: number;
  stage: 'empty' | 'seedling' | 'growing' | 'mature';
}

export interface GameEvent {
  id: number;
  type: 'worker' | 'market' | 'weather' | 'order' | 'breakdown' | 'investment' | 'competitor';
  title: string;
  description: string;
  icon: string;
  businessConcept?: string;
  choices: {
    text: string;
    cost?: number;
    effect: (state: GameState) => GameState;
    explanation?: string;
  }[];
}

export const CROP_TYPES: CropType[] = [
  { id: 'wheat', name: 'Wheat', icon: '🌾', seedCost: 10, basePrice: 30, growthTime: 8, xp: 5 },
  { id: 'corn', name: 'Corn', icon: '🌽', seedCost: 20, basePrice: 60, growthTime: 12, xp: 10 },
  { id: 'tomato', name: 'Tomato', icon: '🍅', seedCost: 15, basePrice: 45, growthTime: 10, xp: 8 },
  { id: 'carrot', name: 'Carrot', icon: '🥕', seedCost: 12, basePrice: 35, growthTime: 9, xp: 6 },
  { id: 'strawberry', name: 'Strawberry', icon: '🍓', seedCost: 25, basePrice: 75, growthTime: 15, xp: 12 },
  { id: 'potato', name: 'Potato', icon: '🥔', seedCost: 8, basePrice: 25, growthTime: 7, xp: 4 },
];

export const INITIAL_WORKERS: Worker[] = [
  { id: 1, name: 'Sam', role: 'planter', wage: 50, morale: 80, efficiency: 75, hired: false },
  { id: 2, name: 'Alex', role: 'harvester', wage: 60, morale: 85, efficiency: 80, hired: false },
  { id: 3, name: 'Jordan', role: 'planter', wage: 50, morale: 70, efficiency: 70, hired: false },
  { id: 4, name: 'Casey', role: 'manager', wage: 100, morale: 90, efficiency: 85, hired: false },
  { id: 5, name: 'Morgan', role: 'harvester', wage: 60, morale: 75, efficiency: 75, hired: false },
];

export const AVAILABLE_UPGRADES: Upgrade[] = [
  {
    id: 'auto-planter',
    name: 'Auto-Planter 3000',
    description: 'Automatically plants crops when plots are empty',
    cost: 500,
    type: 'automation',
    icon: '🤖',
    owned: false,
    benefit: 'Saves time, increases productivity',
  },
  {
    id: 'auto-harvester',
    name: 'Smart Harvester',
    description: 'Automatically harvests mature crops',
    cost: 600,
    type: 'automation',
    icon: '🚜',
    owned: false,
    benefit: 'Never miss a harvest',
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel Array',
    description: 'Reduces operating costs by 20%',
    cost: 800,
    type: 'green-tech',
    icon: '☀️',
    owned: false,
    benefit: 'Lower expenses, eco-friendly',
  },
  {
    id: 'smart-irrigation',
    name: 'Smart Irrigation',
    description: 'Crops grow 25% faster',
    cost: 700,
    type: 'green-tech',
    icon: '💧',
    owned: false,
    benefit: 'Faster growth, water efficient',
  },
  {
    id: 'processing-plant',
    name: 'Processing Factory',
    description: 'Convert crops to premium products (+50% value)',
    cost: 1500,
    type: 'processing',
    icon: '🏭',
    owned: false,
    benefit: 'Higher profit margins',
  },
  {
    id: 'research-lab',
    name: 'R&D Laboratory',
    description: 'Unlock better seeds and techniques',
    cost: 1200,
    type: 'research',
    icon: '🔬',
    owned: false,
    benefit: 'Innovation advantage',
  },
  {
    id: 'marketing-dept',
    name: 'Marketing Department',
    description: 'Increase demand by 30%',
    cost: 900,
    type: 'marketing',
    icon: '📢',
    owned: false,
    benefit: 'Higher prices, more sales',
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    description: 'Generate passive income ($50/day)',
    cost: 1000,
    type: 'green-tech',
    icon: '🌬️',
    owned: false,
    benefit: 'Renewable revenue stream',
  },
];

const initialMarket: MarketData = {
  wheat: { currentPrice: 30, demand: 70, trend: 'stable' },
  corn: { currentPrice: 60, demand: 60, trend: 'stable' },
  tomato: { currentPrice: 45, demand: 75, trend: 'stable' },
  carrot: { currentPrice: 35, demand: 80, trend: 'stable' },
  strawberry: { currentPrice: 75, demand: 55, trend: 'stable' },
  potato: { currentPrice: 25, demand: 85, trend: 'stable' },
};

const initialQuests: Quest[] = [
  {
    id: 1,
    title: 'First Harvest',
    description: 'Harvest 10 crops to learn about revenue',
    concept: 'Revenue = Income from sales',
    target: 10,
    current: 0,
    reward: 100,
    completed: false,
  },
  {
    id: 2,
    title: 'Hire Your Team',
    description: 'Hire 2 workers to understand payroll costs',
    concept: 'Expenses = Costs to run business',
    target: 2,
    current: 0,
    reward: 200,
    completed: false,
  },
  {
    id: 3,
    title: 'Break-Even Master',
    description: 'Earn $1000 in total revenue',
    concept: 'Break-Even = When revenue covers costs',
    target: 1000,
    current: 0,
    reward: 300,
    completed: false,
  },
];

const initialGameState: GameState = {
  cash: 1000,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  time: 8,
  plots: Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    unlocked: i < 6,
    crop: null,
    stage: 'empty' as const,
  })),
  inventory: {},
  market: initialMarket,
  workers: INITIAL_WORKERS,
  upgrades: AVAILABLE_UPGRADES,
  financialHistory: [],
  totalRevenue: 0,
  totalExpenses: 0,
  quests: initialQuests,
  unlockedPlots: 6,
  nextPlotCost: 100,
  automationLevel: {
    planting: false,
    harvesting: false,
  },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Time progression
  useEffect(() => {
    if (screen === 'farm') {
      const timeInterval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          time: (prev.time + 1) % 24,
        }));
      }, 30000);

      return () => clearInterval(timeInterval);
    }
  }, [screen]);

  // Market dynamics
  useEffect(() => {
    if (screen === 'farm') {
      const marketInterval = setInterval(() => {
        setGameState((prev) => {
          const newMarket = { ...prev.market };
          
          CROP_TYPES.forEach((crop) => {
            const current = newMarket[crop.id];
            const demandChange = (Math.random() - 0.5) * 15;
            const newDemand = Math.max(30, Math.min(100, current.demand + demandChange));
            
            const priceMultiplier = 0.7 + (newDemand / 100) * 0.6;
            const newPrice = Math.round(crop.basePrice * priceMultiplier);
            
            let trend: 'up' | 'down' | 'stable' = 'stable';
            if (newPrice > current.currentPrice + 3) trend = 'up';
            else if (newPrice < current.currentPrice - 3) trend = 'down';
            
            newMarket[crop.id] = {
              currentPrice: newPrice,
              demand: Math.round(newDemand),
              trend,
            };
          });
          
          return { ...prev, market: newMarket };
        });
      }, 20000);

      return () => clearInterval(marketInterval);
    }
  }, [screen]);

  const startGame = () => {
    setScreen('farm');
  };

  return (
    <div className="min-h-screen">
      {screen === 'menu' && <MainMenu onStart={startGame} onContinue={startGame} />}
      {screen === 'farm' && <ImprovedBusinessFarm gameState={gameState} setGameState={setGameState} />}
      <Toaster />
    </div>
  );
}