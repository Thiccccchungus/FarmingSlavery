import { Plot, MarketData, CROP_TYPES } from '../App';
import { Lock, Sparkles, Droplet } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImprovedFarmGridProps {
  plots: Plot[];
  plantingMode: boolean;
  selectedCrop: string | null;
  onPlantCrop: (plotId: number) => void;
  market: MarketData;
  nextPlotCost: number;
}

export default function ImprovedFarmGrid({
  plots,
  plantingMode,
  selectedCrop,
  onPlantCrop,
  market,
  nextPlotCost,
}: ImprovedFarmGridProps) {
  return (
    <div className="bg-gradient-to-br from-green-800/20 to-green-600/20 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-700/30">
      {/* Farm Info Banner */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-4 bg-white/90 px-6 py-3 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-700">🏡 Plots Unlocked:</span>
            <span className="font-bold text-green-900">{plots.filter((p) => p.unlocked).length}/{plots.length}</span>
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">🌾 Growing:</span>
            <span className="font-bold text-yellow-900">{plots.filter((p) => p.crop).length}</span>
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-green-700">✨ Ready:</span>
            <span className="font-bold text-green-900">{plots.filter((p) => p.stage === 'mature').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {plots.map((plot) => (
          <ImprovedPlot
            key={plot.id}
            plot={plot}
            plantingMode={plantingMode}
            selectedCrop={selectedCrop}
            onPlantCrop={onPlantCrop}
            market={market}
            nextPlotCost={nextPlotCost}
          />
        ))}
      </div>
    </div>
  );
}

interface ImprovedPlotProps {
  plot: Plot;
  plantingMode: boolean;
  selectedCrop: string | null;
  onPlantCrop: (plotId: number) => void;
  market: MarketData;
  nextPlotCost: number;
}

function ImprovedPlot({ plot, plantingMode, selectedCrop, onPlantCrop, market, nextPlotCost }: ImprovedPlotProps) {
  const [bounce, setBounce] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const [waterDrop, setWaterDrop] = useState(false);

  const crop = plot.crop ? CROP_TYPES.find((c) => c.id === plot.crop) : null;

  // Shimmer effect for mature crops
  useEffect(() => {
    if (plot.stage === 'mature') {
      const interval = setInterval(() => {
        setShimmer(true);
        setTimeout(() => setShimmer(false), 600);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [plot.stage]);

  // Water drops for growing crops
  useEffect(() => {
    if (plot.stage === 'growing' || plot.stage === 'seedling') {
      const interval = setInterval(() => {
        setWaterDrop(true);
        setTimeout(() => setWaterDrop(false), 1000);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [plot.stage]);

  const handleClick = () => {
    if (!plot.unlocked) {
      return;
    }

    if (plantingMode && selectedCrop && !plot.crop) {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
      onPlantCrop(plot.id);
    }
  };

  const getCropSize = () => {
    if (plot.stage === 'seedling') return 'text-3xl scale-50';
    if (plot.stage === 'growing') return 'text-5xl scale-75';
    if (plot.stage === 'mature') return 'text-6xl scale-100';
    return 'text-4xl scale-0';
  };

  const getCropOpacity = () => {
    if (plot.stage === 'seedling') return 'opacity-60';
    if (plot.stage === 'growing') return 'opacity-80';
    if (plot.stage === 'mature') return 'opacity-100';
    return 'opacity-0';
  };

  if (!plot.unlocked) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 rounded-3xl shadow-xl border-4 border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all group relative overflow-hidden">
        {/* Lock icon */}
        <div className="relative z-10">
          <Lock className="w-10 h-10 text-gray-300 mb-2 group-hover:animate-bounce" />
          <span className="text-xs text-gray-200 font-medium">Buy Plot</span>
          <div className="text-yellow-300 font-bold mt-1">${nextPlotCost}</div>
        </div>

        {/* Locked pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #333 0, #333 10px, transparent 10px, transparent 20px)',
            }}
          />
        </div>
      </div>
    );
  }

  const isClickable = plantingMode && selectedCrop && !plot.crop;

  return (
    <div
      onClick={handleClick}
      className={`aspect-square bg-gradient-to-br from-amber-300 via-amber-200 to-green-300 rounded-3xl shadow-xl border-4 ${
        plot.stage === 'mature'
          ? 'border-yellow-400 shadow-yellow-400/50 shadow-2xl'
          : 'border-green-700'
      } flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
        isClickable
          ? 'cursor-pointer hover:scale-110 hover:shadow-2xl ring-4 ring-green-500 ring-opacity-70 animate-pulse'
          : plot.stage === 'mature'
          ? 'cursor-pointer hover:scale-105 animate-pulse'
          : 'cursor-default'
      } ${bounce ? 'animate-bounce' : ''}`}
      style={{
        transform: plot.stage === 'mature' ? 'perspective(1000px) rotateX(5deg)' : 'none',
      }}
    >
      {/* Soil texture with depth */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/80 via-amber-300/60 to-green-400/80" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(101, 67, 33, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.3) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, rgba(101, 67, 33, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '15px 15px, 12px 12px, 18px 18px',
          }}
        />
      </div>

      {/* Shadow effect */}
      {plot.crop && (
        <div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm"
          style={{
            width: plot.stage === 'mature' ? '80%' : plot.stage === 'growing' ? '60%' : '40%',
          }}
        />
      )}

      {/* Shimmer effect */}
      {shimmer && plot.stage === 'mature' && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
          style={{
            animation: 'shimmer 0.6s ease-in-out',
          }}
        />
      )}

      {/* Water drops */}
      {waterDrop && (plot.stage === 'growing' || plot.stage === 'seedling') && (
        <div className="absolute top-2 right-2 animate-bounce">
          <Droplet className="w-4 h-4 text-blue-400 fill-blue-300" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {plot.crop && crop ? (
          <>
            <div
              className={`transition-all duration-700 ${getCropSize()} ${getCropOpacity()} relative`}
              style={{
                filter: plot.stage === 'mature' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none',
              }}
            >
              <div className={`${plot.stage === 'mature' ? 'animate-bounce-slow' : ''}`}>{crop.icon}</div>

              {/* Sparkles for mature crops */}
              {plot.stage === 'mature' && (
                <>
                  <div className="absolute -top-2 -right-2 animate-ping">
                    <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-300" />
                  </div>
                  <div className="absolute -top-1 -left-1 animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-200" />
                  </div>
                </>
              )}
            </div>

            {/* Growth stage indicator */}
            <div className="mt-2">
              {plot.stage === 'mature' && (
                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse border-2 border-green-300">
                  ✨ Ready! ✨
                </div>
              )}
              {plot.stage === 'growing' && (
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full text-xs border-2 border-blue-300">
                  🌱 Growing
                </div>
              )}
              {plot.stage === 'seedling' && (
                <div className="bg-gradient-to-r from-green-300 to-green-500 text-green-900 px-3 py-1 rounded-full text-xs border-2 border-green-600">
                  🌿 Sprouting
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            {isClickable ? (
              <>
                <div className="text-4xl mb-2 animate-bounce">👇</div>
                <div className="text-xs text-green-900 bg-white/80 px-3 py-1 rounded-full font-medium shadow-md border-2 border-green-500">
                  Click to Plant
                </div>
              </>
            ) : (
              <div className="text-6xl opacity-20">🌱</div>
            )}
          </div>
        )}
      </div>

      {/* Plot number badge */}
      <div className="absolute top-2 left-2 bg-white/90 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-md border-2 border-gray-300">
        {plot.id}
      </div>

      {/* Profit indicator for mature crops */}
      {plot.stage === 'mature' && crop && (
        <div className="absolute bottom-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-yellow-600 animate-bounce">
          ${market[crop.id]?.currentPrice || crop.basePrice}
        </div>
      )}
    </div>
  );
}