import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './ui/card';
import { MarketData, CROP_TYPES } from '../App';

interface MarketPricesProps {
  market: MarketData;
}

export default function MarketPrices({ market }: MarketPricesProps) {
  return (
    <Card className="p-4 bg-white rounded-3xl shadow-xl border-2 border-blue-200">
      <h3 className="text-blue-800 mb-4 flex items-center gap-2">
        📊 Market Prices
      </h3>
      
      <div className="space-y-2">
        {CROP_TYPES.map((crop) => {
          const marketData = market[crop.id];
          if (!marketData) return null;

          return (
            <div
              key={crop.id}
              className={`p-3 rounded-xl border-2 transition-all ${
                marketData.trend === 'up'
                  ? 'bg-green-50 border-green-200'
                  : marketData.trend === 'down'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{crop.icon}</span>
                  <div>
                    <div className="text-sm text-gray-900">{crop.name}</div>
                    <div className="text-xs text-gray-600">
                      Demand: {Math.round(marketData.demand)}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {marketData.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                    {marketData.trend === 'down' && (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    {marketData.trend === 'stable' && (
                      <Minus className="w-4 h-4 text-gray-600" />
                    )}
                    <span
                      className={`${
                        marketData.trend === 'up'
                          ? 'text-green-700'
                          : marketData.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      ${marketData.currentPrice}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Base: ${crop.basePrice}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
        <p className="text-xs text-gray-800">
          💡 Prices update based on demand. 📈 = Rising, 📉 = Falling, ➡️ = Stable
        </p>
      </div>
    </Card>
  );
}
