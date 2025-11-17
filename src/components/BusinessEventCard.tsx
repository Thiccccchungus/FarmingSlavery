import { GameEvent } from '../App';
import { Button } from './ui/button';

interface BusinessEventCardProps {
  event: GameEvent;
  onChoice: (choice: GameEvent['choices'][0]) => void;
}

export default function BusinessEventCard({ event, onChoice }: BusinessEventCardProps) {
  const getEventColor = () => {
    switch (event.type) {
      case 'worker':
        return 'from-purple-500 to-purple-700';
      case 'market':
        return 'from-green-500 to-green-700';
      case 'weather':
        return 'from-blue-500 to-blue-700';
      case 'order':
        return 'from-yellow-500 to-yellow-700';
      case 'breakdown':
        return 'from-orange-500 to-orange-700';
      case 'investment':
        return 'from-teal-500 to-teal-700';
      case 'competitor':
        return 'from-red-500 to-red-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="max-w-lg w-full animate-in zoom-in">
        {/* Event Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-800">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getEventColor()} p-6 text-center relative`}>
            <div className="text-7xl mb-3 animate-bounce">{event.icon}</div>
            <h2 className="text-white text-shadow-lg mb-2">{event.title}</h2>
            <p className="text-white/90 text-sm mb-3">{event.description}</p>

            {/* Business Concept Badge */}
            {event.businessConcept && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <div className="text-xs text-white/80 mb-1">💡 Business Lesson</div>
                <div className="text-sm text-white font-medium">{event.businessConcept}</div>
              </div>
            )}
          </div>

          {/* Choices */}
          <div className="p-6 space-y-3">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">What will you do?</p>
            </div>

            {event.choices.map((choice, index) => (
              <div key={index}>
                <Button
                  onClick={() => onChoice(choice)}
                  className={`w-full py-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600'
                      : 'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span>{choice.text}</span>
                      {choice.cost && (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">💰 ${choice.cost}</span>
                      )}
                    </div>
                  </div>
                </Button>

                {/* Explanation */}
                {choice.explanation && (
                  <div className="mt-2 text-xs text-gray-600 text-center italic">
                    💡 {choice.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="bg-gray-100 px-6 py-3 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Think like an entrepreneur - consider costs, benefits, and long-term impact!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
