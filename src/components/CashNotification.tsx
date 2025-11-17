import { useEffect, useState } from 'react';

interface CashNotificationProps {
  amount: number;
  onComplete: () => void;
}

export default function CashNotification({ amount, onComplete }: CashNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-green-300 animate-bounce">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <div className="text-sm opacity-90">Sold!</div>
            <div className="text-xl">+${amount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
