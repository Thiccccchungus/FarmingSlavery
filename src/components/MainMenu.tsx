import { Button } from './ui/button';
import { Sprout, Play, BookOpen } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  onContinue: () => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-green-400 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sun */}
        <div className="absolute top-10 right-20 w-24 h-24 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-400/60 animate-pulse" />
        
        {/* Clouds */}
        <div className="absolute top-20 left-20 w-32 h-20 bg-white/60 rounded-full blur-sm" />
        <div className="absolute top-40 right-40 w-40 h-24 bg-white/60 rounded-full blur-sm" />
        
        {/* Floating emojis */}
        <div className="absolute top-1/4 left-1/4 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>
          🌾
        </div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>
          🌽
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>
          🍅
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-6xl animate-bounce" style={{ animationDelay: '1.5s' }}>
          🥕
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-8 transform hover:scale-105 transition-transform">
          <div className="inline-block bg-gradient-to-br from-amber-600 to-amber-800 px-12 py-6 rounded-3xl shadow-2xl border-8 border-amber-950 transform -rotate-2">
            <div className="flex items-center gap-4">
              <Sprout className="w-16 h-16 text-white" />
              <div>
                <h1 className="text-white text-shadow-lg text-5xl">Eco-Farm</h1>
                <h2 className="text-yellow-300 text-shadow-lg text-3xl">Tycoon</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-green-900 mb-12 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg border-2 border-green-600">
          Learn Business & Entrepreneurship Through Farming! 🌱💼
        </p>

        {/* Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <Button
            onClick={onStart}
            className="w-full py-8 rounded-3xl bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white shadow-2xl transform hover:scale-105 transition-all text-2xl border-4 border-green-800"
          >
            <Play className="w-8 h-8 mr-3 fill-white" />
            Start Farming!
          </Button>

          <Button
            variant="outline"
            className="w-full py-6 rounded-3xl bg-white/90 hover:bg-white border-4 border-amber-600 text-amber-900 shadow-xl transform hover:scale-105 transition-all text-xl"
          >
            <BookOpen className="w-6 h-6 mr-2" />
            How to Play
          </Button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { emoji: '💼', title: 'Manage Workers', desc: 'Hire & manage team' },
            { emoji: '📊', title: 'Track Finances', desc: 'ROI, profit & loss' },
            { emoji: '🚀', title: 'Grow Business', desc: 'Invest in upgrades' },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-400 transform hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-2">{feature.emoji}</div>
              <div className="text-green-900">{feature.title}</div>
              <div className="text-sm text-green-700">{feature.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-green-800 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
          Educational business sim for ages 13+ • Learn entrepreneurship through play
        </div>
      </div>
    </div>
  );
}