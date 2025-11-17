import { GameState } from '../App';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Check, Lock } from 'lucide-react';

interface UpgradesPanelProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

export default function UpgradesPanel({ gameState, setGameState }: UpgradesPanelProps) {
  const handlePurchaseUpgrade = (upgradeId: string) => {
    const upgrade = gameState.upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || upgrade.owned) return;

    if (gameState.cash < upgrade.cost) {
      toast.error('Not enough cash!');
      return;
    }

    setGameState((prev) => {
      const updatedUpgrades = prev.upgrades.map((u) =>
        u.id === upgradeId ? { ...u, owned: true } : u
      );

      // Apply automation
      let automationLevel = { ...prev.automationLevel };
      if (upgradeId === 'auto-planter') automationLevel.planting = true;
      if (upgradeId === 'auto-harvester') automationLevel.harvesting = true;

      return {
        ...prev,
        upgrades: updatedUpgrades,
        cash: prev.cash - upgrade.cost,
        totalExpenses: prev.totalExpenses + upgrade.cost,
        automationLevel,
      };
    });

    toast.success(`${upgrade.icon} ${upgrade.name} purchased!`);
  };

  const automationUpgrades = gameState.upgrades.filter((u) => u.type === 'automation');
  const greenTechUpgrades = gameState.upgrades.filter((u) => u.type === 'green-tech');
  const processingUpgrades = gameState.upgrades.filter((u) => u.type === 'processing');
  const researchUpgrades = gameState.upgrades.filter((u) => u.type === 'research');
  const marketingUpgrades = gameState.upgrades.filter((u) => u.type === 'marketing');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-green-900 mb-2">🏭 Technology & Upgrades</h2>
        <p className="text-gray-700">
          Invest in technology to automate, increase efficiency, and boost profitability
        </p>
      </div>

      {/* Automation */}
      <UpgradeSection
        title="🤖 Automation Systems"
        description="Reduce labor costs and increase productivity"
        upgrades={automationUpgrades}
        onPurchase={handlePurchaseUpgrade}
        gameState={gameState}
      />

      {/* Green Tech */}
      <UpgradeSection
        title="🌱 Sustainable Technology"
        description="Eco-friendly solutions that reduce costs and boost growth"
        upgrades={greenTechUpgrades}
        onPurchase={handlePurchaseUpgrade}
        gameState={gameState}
      />

      {/* Processing */}
      <UpgradeSection
        title="🏭 Processing & Manufacturing"
        description="Add value to your crops with processing facilities"
        upgrades={processingUpgrades}
        onPurchase={handlePurchaseUpgrade}
        gameState={gameState}
      />

      {/* Research */}
      <UpgradeSection
        title="🔬 Research & Development"
        description="Invest in innovation for competitive advantage"
        upgrades={researchUpgrades}
        onPurchase={handlePurchaseUpgrade}
        gameState={gameState}
      />

      {/* Marketing */}
      <UpgradeSection
        title="📢 Marketing & Sales"
        description="Boost demand and command premium prices"
        upgrades={marketingUpgrades}
        onPurchase={handlePurchaseUpgrade}
        gameState={gameState}
      />

      {/* Business Education */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="mb-2">💡 Business Concept: Capital Investment</h3>
        <p className="text-sm mb-4">
          Upgrades are <strong>capital investments</strong> that provide long-term benefits. Calculate ROI to determine
          which investments will pay off fastest.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">📊 Investment Strategy</div>
            <div>• Prioritize high-ROI upgrades</div>
            <div>• Automation saves labor costs</div>
            <div>• Marketing increases revenue</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">💼 Business Impact</div>
            <div>• Lower operating expenses</div>
            <div>• Higher profit margins</div>
            <div>• Competitive advantage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradeSection({
  title,
  description,
  upgrades,
  onPurchase,
  gameState,
}: {
  title: string;
  description: string;
  upgrades: GameState['upgrades'];
  onPurchase: (id: string) => void;
  gameState: GameState;
}) {
  if (upgrades.length === 0) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h3 className="text-green-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map((upgrade) => (
          <div
            key={upgrade.id}
            className={`rounded-xl p-5 border-2 transition-all ${
              upgrade.owned
                ? 'bg-green-100 border-green-500'
                : gameState.cash >= upgrade.cost
                ? 'bg-white border-gray-300 hover:border-green-400 hover:shadow-lg'
                : 'bg-gray-100 border-gray-300 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{upgrade.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{upgrade.name}</div>
                  <div className="text-xs text-gray-600">{upgrade.type}</div>
                </div>
              </div>
              {upgrade.owned && (
                <div className="bg-green-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-3">{upgrade.description}</p>

            <div className="bg-blue-50 rounded-lg p-2 mb-3 border border-blue-200">
              <div className="text-xs text-blue-900">
                <strong>Benefit:</strong> {upgrade.benefit}
              </div>
            </div>

            <Button
              onClick={() => onPurchase(upgrade.id)}
              disabled={upgrade.owned || gameState.cash < upgrade.cost}
              className={`w-full ${
                upgrade.owned
                  ? 'bg-green-600'
                  : gameState.cash >= upgrade.cost
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                  : 'bg-gray-400'
              }`}
            >
              {upgrade.owned ? (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> Owned
                </span>
              ) : gameState.cash >= upgrade.cost ? (
                `Purchase for $${upgrade.cost}`
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Need ${upgrade.cost}
                </span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
