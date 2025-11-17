import { GameState } from '../App';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { Check, Target, Trophy } from 'lucide-react';

interface QuestsPanelProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

export default function QuestsPanel({ gameState, setGameState }: QuestsPanelProps) {
  const handleClaimReward = (questId: number) => {
    const quest = gameState.quests.find((q) => q.id === questId);
    if (!quest || !quest.completed) return;

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash + quest.reward,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));

    toast.success(`🎉 Quest completed! +$${quest.reward}`);
  };

  const activeQuests = gameState.quests.filter((q) => !q.completed);
  const completedQuests = gameState.quests.filter((q) => q.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-green-900 mb-2">🎯 Entrepreneur Quests</h2>
        <p className="text-gray-700">
          Complete quests to learn business concepts and earn rewards
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Active Quests</div>
              <div className="text-2xl font-medium">{activeQuests.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Ready to Claim</div>
              <div className="text-2xl font-medium">{completedQuests.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8" />
            <div>
              <div className="text-sm opacity-90">Total Rewards</div>
              <div className="text-2xl font-medium">
                ${gameState.quests.reduce((sum, q) => (q.completed ? sum + q.reward : sum), 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h3 className="text-green-900 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Ready to Claim
          </h3>

          <div className="space-y-3">
            {completedQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-400"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🎉</div>
                      <div className="font-medium text-green-900">{quest.title}</div>
                    </div>
                    <p className="text-sm text-green-800 mb-2">{quest.description}</p>
                    <div className="bg-green-200 rounded-lg p-2 border border-green-300 mb-3">
                      <div className="text-xs text-green-900">
                        <strong>💡 {quest.concept}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-800">
                    Completed: {quest.current}/{quest.target}
                  </div>
                  <Button
                    onClick={() => handleClaimReward(quest.id)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white"
                  >
                    Claim ${quest.reward}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h3 className="text-green-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Active Quests
          </h3>

          <div className="space-y-4">
            {activeQuests.map((quest) => {
              const progress = (quest.current / quest.target) * 100;

              return (
                <div key={quest.id} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">📋</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{quest.title}</div>
                      <p className="text-sm text-gray-600 mb-2">{quest.description}</p>

                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
                        <div className="text-xs text-blue-900">
                          <strong>💡 Learn:</strong> {quest.concept}
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
                          <span>Progress</span>
                          <span>
                            {quest.current}/{quest.target}
                          </span>
                        </div>
                        <Progress value={progress} className="h-3 bg-gray-200" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {quest.target - quest.current} more to complete
                        </div>
                        <div className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium border border-yellow-300">
                          Reward: ${quest.reward}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Business Education */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="mb-2">💡 Why Quests Matter</h3>
        <p className="text-sm mb-4">
          Each quest teaches a core entrepreneurship concept. Complete them to build business knowledge while earning
          cash rewards!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">📚 Learn</div>
            <p>Understand business fundamentals through hands-on experience</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">💰 Earn</div>
            <p>Get rewarded with cash to reinvest in your business</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">🚀 Grow</div>
            <p>Apply concepts to scale your farm into an empire</p>
          </div>
        </div>
      </div>
    </div>
  );
}
