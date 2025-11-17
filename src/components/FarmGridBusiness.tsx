import { Plot, MarketData, CROP_TYPES } from '../App';
import { Lock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FarmGridBusinessProps {
  plots: Plot[];
  selectedCrop: string | null;
  onPlantCrop: (plotId: number, cropId: string) => void;
  market: MarketData;
}

export default function FarmGridBusiness({ plots, selectedCrop, onPlantCrop, market }: FarmGridBusinessProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div className="mb-4 text-center">
        <h3 className="text-green-900">🌾 Your Farm Fields 🌾</h3>
        {selectedCrop && (
          <p className="text-sm text-green-700">Click empty plots to plant {CROP_TYPES.find((c) => c.id === selectedCrop)?.name}</p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {plots.map((plot) => (
          <FarmPlot
            key={plot.id}
            plot={plot}
            selectedCrop={selectedCrop}
            onPlantCrop={onPlantCrop}
            market={market}
          />
        ))}
      </div>
    </div>
  );
}

interface FarmPlotProps {
  plot: Plot;
  selectedCrop: string | null;
  onPlantCrop: (plotId: number, cropId: string) => void;
  market: MarketData;
}

function FarmPlot({ plot, selectedCrop, onPlantCrop, market }: FarmPlotProps) {
  const [bounce, setBounce] = useState(false);
  const [shimmer, setShimmer] = useState(false);

  const crop = plot.crop ? CROP_TYPES.find((c) => c.id === plot.crop) : null;

  useEffect(() => {
    if (plot.stage === 'mature') {
      const interval = setInterval(() => {
        setShimmer(true);
        setTimeout(() => setShimmer(false), 500);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [plot.stage]);

  const handleClick = () => {
    if (!plot.unlocked) return;

    if (selectedCrop && !plot.crop) {
      setBounce(true);
      setTimeout(() => setBounce(false), 300);
      onPlantCrop(plot.id, selectedCrop);
    }
  };

  const getCropScale = () => {
    if (plot.stage === 'seedling') return 'scale-50';
    if (plot.stage === 'growing') return 'scale-75';
    if (plot.stage === 'mature') return 'scale-100';
    return 'scale-0';
  };

  if (!plot.unlocked) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-lg border-4 border-gray-700 flex flex-col items-center justify-center cursor-not-allowed relative">
        <Lock className="w-8 h-8 text-gray-300 mb-2" />
        <span className="text-xs text-gray-200">Locked</span>
      </div>
    );
  }

  const isClickable = selectedCrop && !plot.crop;

  return (
    <div
      onClick={handleClick}
      className={`aspect-square bg-gradient-to-br from-amber-200 via-green-200 to-green-300 rounded-2xl shadow-lg border-4 ${
        plot.stage === 'mature'
          ? 'border-yellow-400 shadow-yellow-300/50'
          : 'border-green-600'
      } flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
        isClickable
          ? 'cursor-pointer hover:scale-105 hover:shadow-2xl ring-4 ring-green-400 ring-opacity-50 animate-pulse'
          : plot.stage === 'mature'
          ? 'cursor-pointer hover:scale-105'
          : 'cursor-default'
      } ${bounce ? 'animate-bounce' : ''}`}
    >
      {/* Soil texture */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #654321 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        />
      </div>

      {/* Shimmer */}
      {shimmer && plot.stage === 'mature' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {plot.crop && crop ? (
          <>
            <div className={`transition-all duration-700 ${getCropScale()}`}>
              <div className={`text-5xl ${plot.stage === 'mature' ? 'animate-pulse' : ''}`}>{crop.icon}</div>
              {plot.stage === 'mature' && (
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-300" />
                </div>
              )}
            </div>
            <div className="mt-2">
              {plot.stage === 'mature' && (
                <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs shadow-lg animate-bounce">
                  Ready! ✨
                </div>
              )}
              {plot.stage === 'growing' && (
                <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">Growing</div>
              )}
              {plot.stage === 'seedling' && (
                <div className="bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs">Sprouting</div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            {isClickable ? (
              <>
                <div className="text-3xl mb-1 animate-bounce">👆</div>
                <div className="text-xs text-green-800 bg-white/70 px-2 py-1 rounded-full">Plant</div>
              </>
            ) : (
              <div className="text-5xl opacity-30">🌱</div>
            )}
          </div>
        )}
      </div>

      {/* Plot number */}
      <div className="absolute top-2 left-2 bg-white/80 w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-700">
        {plot.id}
      </div>
    </div>
  );
}
