import { useEffect, useState } from 'react';

interface FloatingRewardProps {
  type: 'coin' | 'xp';
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export default function FloatingReward({ type, amount, x, y, onComplete }: FloatingRewardProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none animate-float-up"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <div
        className={`text-2xl font-bold drop-shadow-lg ${
          type === 'coin' ? 'text-yellow-400' : 'text-purple-400'
        }`}
      >
        {type === 'coin' ? '💰' : '⭐'} +{amount}
      </div>
    </div>
  );
}
