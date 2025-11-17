import { Plot, MarketData, CROP_TYPES } from '../App';
import { Lock, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FarmGridProps {
  plots: Plot[];
  plantMode: boolean;
  selectedCrop: string | null;
  onPlantCrop: (plotId: number, cropId: string) => void;
  market: MarketData;
}

export default function FarmGrid({ plots, plantMode, selectedCrop, onPlantCrop, market }: FarmGridProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Farm Sign */}
      <div className="text-center mb-8 relative">
        <div className="inline-block bg-gradient-to-br from-amber-600 to-amber-800 px-8 py-4 rounded-2xl shadow-2xl border-4 border-amber-950 transform -rotate-1">
          <h2 className="text-white text-shadow-lg">🌾 Growing Fields 🌾</h2>
        </div>
      </div>

      {/* 3D Grid Layout */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 perspective-1000">
        {plots.map((plot) => (
          <FarmPlotCard
            key={plot.id}
            plot={plot}
            plantMode={plantMode}
            selectedCrop={selectedCrop}
            onPlantCrop={onPlantCrop}
            market={market}
          />
        ))}
      </div>
    </div>
  );
}

interface FarmPlotCardProps {
  plot: Plot;
  plantMode: boolean;
  selectedCrop: string | null;
  onPlantCrop: (plotId: number, cropId: string) => void;
  market: MarketData;
}

function FarmPlotCard({ plot, plantMode, selectedCrop, onPlantCrop, market }: FarmPlotCardProps) {
  const [bounce, setBounce] = useState(false);
  const [shimmer, setShimmer] = useState(false);

  const crop = plot.crop ? CROP_TYPES.find((c) => c.id === plot.crop) : null;

  // Shimmer effect for mature crops
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
    
    if (plantMode && selectedCrop && !plot.crop) {
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

  const getCropVisual = () => {
    if (!crop) return null;
    
    return (
      <div className={`transition-all duration-700 ${getCropScale()}`}>
        <div className={`text-5xl md:text-6xl transform ${bounce ? 'animate-bounce' : ''} ${plot.stage === 'mature' ? 'animate-pulse' : ''}`}>
          {crop.icon}
        </div>
        {plot.stage === 'mature' && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-300" />
          </div>
        )}
      </div>
    );
  };

  if (!plot.unlocked) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl shadow-lg border-4 border-gray-700 flex flex-col items-center justify-center transform hover:scale-105 transition-all cursor-not-allowed relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <Lock className="w-8 h-8 text-gray-300 mb-2 relative z-10" />
        <span className="text-xs text-gray-200 relative z-10">Locked</span>
      </div>
    );
  }

  const isClickable = plantMode && selectedCrop && !plot.crop;

  return (
    <div
      onClick={handleClick}
      className={`aspect-square bg-gradient-to-br from-amber-200 via-green-200 to-green-300 rounded-3xl shadow-xl border-4 ${
        plot.stage === 'mature'
          ? 'border-yellow-400 shadow-yellow-300/50'
          : 'border-green-600'
      } flex items-center justify-center transform transition-all duration-300 relative overflow-hidden ${
        isClickable
          ? 'cursor-pointer hover:scale-105 hover:shadow-2xl ring-4 ring-green-400 ring-opacity-50 animate-pulse'
          : plot.stage === 'mature'
          ? 'cursor-pointer hover:scale-105'
          : 'cursor-default'
      } ${bounce ? 'animate-bounce' : ''}`}
      style={{
        boxShadow: plot.stage === 'mature' 
          ? '0 10px 40px rgba(250, 204, 21, 0.4), 0 0 20px rgba(250, 204, 21, 0.3)' 
          : undefined,
      }}
    >
      {/* Soil texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, #654321 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }} />
      </div>

      {/* Shimmer effect */}
      {shimmer && plot.stage === 'mature' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {plot.crop && crop ? (
          <>
            {getCropVisual()}
            <div className="mt-2 text-center">
              {plot.stage === 'mature' && (
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-bounce">
                  Ready! ✨
                </div>
              )}
              {plot.stage === 'growing' && (
                <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                  Growing...
                </div>
              )}
              {plot.stage === 'seedling' && (
                <div className="bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs">
                  Sprouting 🌱
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            {isClickable ? (
              <>
                <div className="text-4xl mb-2 animate-bounce">👆</div>
                <div className="text-xs text-green-800 bg-white/70 px-2 py-1 rounded-full">
                  Plant here
                </div>
              </>
            ) : (
              <div className="text-6xl opacity-30">🌱</div>
            )}
          </div>
        )}
      </div>

      {/* Plot number badge */}
      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center text-xs text-gray-700 shadow">
        {plot.id}
      </div>
    </div>
  );
}
