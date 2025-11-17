import { useEffect, useState } from 'react';

interface AmbientEffectsProps {
  time: number;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function AmbientEffects({ time }: AmbientEffectsProps) {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  // Initialize clouds
  useEffect(() => {
    const initialClouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 30,
      size: 60 + Math.random() * 40,
      speed: 0.02 + Math.random() * 0.03,
    }));
    setClouds(initialClouds);
  }, []);

  // Animate clouds
  useEffect(() => {
    const interval = setInterval(() => {
      setClouds((prev) =>
        prev.map((cloud) => ({
          ...cloud,
          x: cloud.x > 110 ? -10 : cloud.x + cloud.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Background color based on time
  const getBackgroundGradient = () => {
    if (time >= 6 && time < 12) {
      // Morning: light blue to yellow
      return 'from-sky-300 via-sky-200 to-yellow-100';
    } else if (time >= 12 && time < 18) {
      // Afternoon: bright blue
      return 'from-sky-400 via-sky-200 to-green-100';
    } else if (time >= 18 && time < 22) {
      // Evening: orange to purple
      return 'from-orange-400 via-pink-300 to-purple-400';
    } else {
      // Night: dark blue to purple
      return 'from-indigo-900 via-purple-900 to-blue-900';
    }
  };

  const isNight = time >= 22 || time < 6;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getBackgroundGradient()} transition-all duration-1000`} />

      {/* Sun/Moon */}
      <div
        className="absolute transition-all duration-1000"
        style={{
          left: `${10 + (time / 24) * 80}%`,
          top: `${20 - Math.abs(12 - time) * 1}%`,
        }}
      >
        {isNight ? (
          <div className="w-16 h-16 bg-yellow-100 rounded-full shadow-lg shadow-yellow-200/50">
            <div className="w-12 h-12 bg-indigo-900 rounded-full mt-1 ml-2" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-400/60 animate-pulse" />
        )}
      </div>

      {/* Stars at night */}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Clouds */}
      {!isNight &&
        clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute transition-all duration-75"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: `${cloud.size}px`,
              height: `${cloud.size * 0.6}px`,
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute bg-white/80 rounded-full w-full h-full blur-sm" />
              <div className="absolute bg-white/60 rounded-full w-3/4 h-3/4 top-1/4 left-1/4 blur-sm" />
            </div>
          </div>
        ))}

      {/* Birds (daytime only) */}
      {!isNight && time >= 6 && time < 18 && (
        <>
          <div
            className="absolute text-2xl animate-fly"
            style={{ left: '20%', top: '15%', animationDuration: '15s' }}
          >
            🐦
          </div>
          <div
            className="absolute text-2xl animate-fly"
            style={{ left: '60%', top: '25%', animationDuration: '20s', animationDelay: '5s' }}
          >
            🐦
          </div>
        </>
      )}
    </div>
  );
}
