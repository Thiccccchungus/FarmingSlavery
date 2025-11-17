import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface FarmHelperProps {
  tutorialStep: number;
  onDismiss: () => void;
  level: number;
}

export default function FarmHelper({ tutorialStep, onDismiss, level }: FarmHelperProps) {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      character: '👨‍🌾',
      message: "Howdy, farmer! Welcome to your new farm!",
      hint: "Tap the Plant button to get started"
    },
    {
      character: '👩‍🌾',
      message: "Great job! Now watch your crops grow!",
      hint: "Different crops take different time to grow"
    },
    {
      character: '🧑‍🌾',
      message: "When crops are ready, they'll sparkle! ✨",
      hint: "Tap Harvest to collect and sell them"
    },
  ];

  const currentMessage = tips[Math.min(currentTip, tips.length - 1)];

  return (
    <div className="fixed bottom-32 left-6 z-40 animate-in slide-in-from-left">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-green-600 p-4 max-w-xs relative">
        {/* Close button */}
        <Button
          onClick={onDismiss}
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 shadow-lg"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Character */}
        <div className="flex items-start gap-3">
          <div className="text-5xl animate-bounce">{currentMessage.character}</div>
          <div className="flex-1">
            <div className="bg-green-100 rounded-2xl p-3 mb-2 relative">
              <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-100 border-b-8 border-b-transparent" />
              <p className="text-sm text-gray-800">{currentMessage.message}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-2 border-2 border-yellow-300">
              <p className="text-xs text-yellow-900">💡 {currentMessage.hint}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {currentTip < tips.length - 1 && (
          <div className="mt-3 text-center">
            <Button
              onClick={() => setCurrentTip(currentTip + 1)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-1 text-sm"
            >
              Next Tip →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
