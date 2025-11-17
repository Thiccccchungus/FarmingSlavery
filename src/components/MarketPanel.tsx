import { GameState, CROP_TYPES } from '../App';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Progress } from './ui/progress';

interface MarketPanelProps {
  gameState: GameState;
}

export default function MarketPanel({ gameState }: MarketPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-green-900 mb-2">📊 Market Intelligence</h2>
        <p className="text-gray-700">
          Monitor real-time prices and market trends to maximize profit
        </p>
      </div>

      {/* Market Overview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4">Live Market Prices</h3>

        <div className="space-y-3">
          {CROP_TYPES.map((crop) => {
            const marketData = gameState.market[crop.id];
            if (!marketData) return null;

            const profit = marketData.currentPrice - crop.seedCost;
            const roi = ((profit / crop.seedCost) * 100).toFixed(0);
            const profitPerSecond = (profit / crop.growthTime).toFixed(2);

            return (
              <div
                key={crop.id}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-green-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Crop Info */}
                  <div className="text-5xl">{crop.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{crop.name}</div>
                        <div className="text-xs text-gray-600">Growth: {crop.growthTime}s</div>
                      </div>

                      {/* Trend Indicator */}
                      <div className="flex items-center gap-2">
                        {marketData.trend === 'up' && (
                          <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs">Rising</span>
                          </div>
                        )}
                        {marketData.trend === 'down' && (
                          <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-lg">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs">Falling</span>
                          </div>
                        )}
                        {marketData.trend === 'stable' && (
                          <div className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                            <ArrowRight className="w-4 h-4" />
                            <span className="text-xs">Stable</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="grid grid-cols-4 gap-3 mb-2">
                      <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                        <div className="text-xs text-yellow-700">Seed Cost</div>
                        <div className="text-sm font-medium text-yellow-900">${crop.seedCost}</div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                        <div className="text-xs text-green-700">Market Price</div>
                        <div className="text-sm font-medium text-green-900">${marketData.currentPrice}</div>
                      </div>

                      <div className={`${profit > 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} rounded-lg p-2 border`}>
                        <div className={`text-xs ${profit > 0 ? 'text-blue-700' : 'text-red-700'}`}>Profit</div>
                        <div className={`text-sm font-medium ${profit > 0 ? 'text-blue-900' : 'text-red-900'}`}>
                          ${profit}
                        </div>
                      </div>

                      <div className={`${parseFloat(roi) > 0 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'} rounded-lg p-2 border`}>
                        <div className={`text-xs ${parseFloat(roi) > 0 ? 'text-purple-700' : 'text-gray-700'}`}>ROI</div>
                        <div className={`text-sm font-medium ${parseFloat(roi) > 0 ? 'text-purple-900' : 'text-gray-900'}`}>
                          {roi}%
                        </div>
                      </div>
                    </div>

                    {/* Demand Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Market Demand</span>
                        <span>{marketData.demand}%</span>
                      </div>
                      <Progress
                        value={marketData.demand}
                        className="h-2 bg-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                  <span>💰 Profit/second: ${profitPerSecond}</span>
                  <span>⭐ XP: {crop.xp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="mb-2">💡 Business Concept: Supply & Demand</h3>
        <p className="text-sm mb-4">
          Market prices fluctuate based on demand. High demand = higher prices = more profit. Watch the trends and
          plant crops strategically!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">📈 Rising Trend</div>
            <p>Demand increasing, prices going up. Good time to sell!</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">📉 Falling Trend</div>
            <p>Demand dropping, prices falling. Hold inventory or diversify.</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">➡️ Stable Market</div>
            <p>Balanced supply and demand. Predictable returns.</p>
          </div>
        </div>
      </div>

      {/* Best Opportunities */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4">🎯 Top Opportunities</h3>

        <div className="space-y-3">
          {CROP_TYPES.map((crop) => {
            const marketData = gameState.market[crop.id];
            const profit = marketData.currentPrice - crop.seedCost;
            const roi = (profit / crop.seedCost) * 100;
            return { crop, roi, profit };
          })
            .sort((a, b) => b.roi - a.roi)
            .slice(0, 3)
            .map(({ crop, roi, profit }, index) => (
              <div
                key={crop.id}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="text-2xl">{index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}</div>
                <div className="text-3xl">{crop.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{crop.name}</div>
                  <div className="text-xs text-gray-600">
                    ${profit} profit · {roi.toFixed(0)}% ROI
                  </div>
                </div>
                {index === 0 && (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Best ROI
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
