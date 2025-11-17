import { ArrowLeft, UserPlus, GraduationCap, DollarSign, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { GameState } from '../App';

interface StaffManagementProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onBack: () => void;
}

export default function StaffManagement({ gameState, setGameState, onBack }: StaffManagementProps) {
  const giveBonus = (staffId: number) => {
    const bonusAmount = 100;
    if (gameState.cash < bonusAmount) return;

    const updatedStaff = gameState.staff.map((s) =>
      s.id === staffId ? { ...s, happiness: Math.min(100, s.happiness + 15) } : s
    );

    setGameState({
      ...gameState,
      staff: updatedStaff,
      cash: gameState.cash - bonusAmount,
      staffHappiness: updatedStaff.reduce((sum, s) => sum + s.happiness, 0) / updatedStaff.length,
    });
  };

  const trainStaff = (staffId: number) => {
    const trainingCost = 200;
    if (gameState.cash < trainingCost) return;

    const updatedStaff = gameState.staff.map((s) =>
      s.id === staffId
        ? { ...s, skillLevel: Math.min(5, s.skillLevel + 1), efficiency: Math.min(100, s.efficiency + 10) }
        : s
    );

    setGameState({
      ...gameState,
      staff: updatedStaff,
      cash: gameState.cash - trainingCost,
    });
  };

  const fireWorker = (staffId: number) => {
    const updatedStaff = gameState.staff.filter((s) => s.id !== staffId);
    const newLabourCost = updatedStaff.reduce((sum, s) => sum + s.wage, 0);

    setGameState({
      ...gameState,
      staff: updatedStaff,
      costs: { ...gameState.costs, labour: newLabourCost },
      staffHappiness: updatedStaff.length > 0 
        ? updatedStaff.reduce((sum, s) => sum + s.happiness, 0) / updatedStaff.length 
        : 0,
    });
  };

  const hireWorker = () => {
    const hireCost = 500;
    if (gameState.cash < hireCost) return;

    const newWorker = {
      id: gameState.staff.length + 1,
      name: `Worker ${gameState.staff.length + 1}`,
      skillLevel: 1,
      wage: 150,
      happiness: 75,
      efficiency: 60,
      role: 'Farmer',
    };

    const updatedStaff = [...gameState.staff, newWorker];

    setGameState({
      ...gameState,
      staff: updatedStaff,
      cash: gameState.cash - hireCost,
      costs: { ...gameState.costs, labour: gameState.costs.labour + newWorker.wage },
      staffHappiness: updatedStaff.reduce((sum, s) => sum + s.happiness, 0) / updatedStaff.length,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-pink-900">Staff Management</h2>
          </div>
          <Button onClick={hireWorker} className="bg-green-600 hover:bg-green-700 rounded-xl">
            <UserPlus className="w-4 h-4 mr-2" />
            Hire Worker ($500)
          </Button>
        </div>

        {/* Info bubble */}
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Staff morale affects profits!</strong> Happy workers are more efficient and productive. 
            Train them to increase skills, give bonuses to boost morale.
          </p>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameState.staff.map((staff) => (
          <Card key={staff.id} className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                {staff.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-pink-900">{staff.name}</h3>
                <p className="text-sm text-pink-600">{staff.role}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Skill Level</span>
                  <span className="text-gray-900">⭐ {staff.skillLevel}/5</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Happiness</span>
                  <span className="text-gray-900">{staff.happiness}%</span>
                </div>
                <Progress value={staff.happiness} className="h-2 bg-pink-200" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Efficiency</span>
                  <span className="text-gray-900">{staff.efficiency}%</span>
                </div>
                <Progress value={staff.efficiency} className="h-2 bg-purple-200" />
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-700">Weekly Wage</span>
                <span className="text-green-700">${staff.wage}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => giveBonus(staff.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
                disabled={gameState.cash < 100}
              >
                <Heart className="w-4 h-4 mr-1" />
                Bonus $100
              </Button>
              <Button
                onClick={() => trainStaff(staff.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                disabled={gameState.cash < 200 || staff.skillLevel >= 5}
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                Train $200
              </Button>
            </div>

            <Button
              onClick={() => fireWorker(staff.id)}
              variant="outline"
              className="w-full mt-2 text-red-600 border-red-300 hover:bg-red-50 rounded-xl"
            >
              Fire Worker
            </Button>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-4 p-6 bg-white rounded-3xl shadow-lg">
        <h3 className="text-pink-900 mb-4">Team Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <div className="text-pink-900">Total Staff</div>
            <div className="text-pink-700">{gameState.staff.length}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-purple-900">Avg Happiness</div>
            <div className="text-purple-700">{Math.round(gameState.staffHappiness)}%</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-blue-900">Avg Skill</div>
            <div className="text-blue-700">
              {(gameState.staff.reduce((sum, s) => sum + s.skillLevel, 0) / gameState.staff.length).toFixed(1)}/5
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-green-900">Weekly Cost</div>
            <div className="text-green-700">${gameState.costs.labour}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
