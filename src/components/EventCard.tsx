import { GameEvent } from '../App';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface EventCardProps {
  event: GameEvent;
  onChoice: (choice: GameEvent['choices'][0]) => void;
}

export default function EventCard({ event, onChoice }: EventCardProps) {
  const getEventColor = () => {
    switch (event.type) {
      case 'disease': return 'from-red-500 to-red-700';
      case 'market': return 'from-green-500 to-green-700';
      case 'weather': return 'from-blue-500 to-blue-700';
      case 'order': return 'from-purple-500 to-purple-700';
      case 'breakdown': return 'from-orange-500 to-orange-700';
      case 'cost': return 'from-yellow-500 to-yellow-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="max-w-md w-full animate-in zoom-in">
        {/* Event Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getEventColor()} p-6 text-center relative`}>
            <div className="text-6xl mb-3 animate-bounce">{event.icon}</div>
            <h2 className="text-white text-shadow-lg mb-2">{event.title}</h2>
            <p className="text-white/90 text-sm">{event.description}</p>
          </div>

          {/* Choices */}
          <div className="p-6 space-y-3">
            {event.choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => onChoice(choice)}
                className={`w-full py-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{choice.text}</span>
                  {choice.cost && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      💰 {choice.cost}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Close hint */}
        <div className="text-center mt-4 text-white/60 text-sm">
          Make your choice to continue
        </div>
      </div>
    </div>
  );
}
