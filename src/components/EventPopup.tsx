import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GameEvent } from '../App';

interface EventPopupProps {
  event: GameEvent;
  onChoice: (choice: GameEvent['choices'][0]) => void;
}

export default function EventPopup({ event, onChoice }: EventPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <Card className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-gray-900 mb-3">{event.title}</h2>

        {/* Description */}
        <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border-2 border-yellow-200">
          <p className="text-center text-gray-800">{event.description}</p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {event.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => onChoice(choice)}
              className={`w-full h-auto py-4 rounded-2xl text-left flex items-center justify-center transition-all hover:scale-105 ${
                index === 0
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <span>{choice.text}</span>
            </Button>
          ))}
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Choose wisely! Your decision will affect your farm's performance.
        </p>
      </Card>
    </div>
  );
}
