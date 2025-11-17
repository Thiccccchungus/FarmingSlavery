import { GameState, Worker } from '../App';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { Briefcase, Heart, TrendingUp, DollarSign } from 'lucide-react';

interface WorkerPanelProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
}

export default function WorkerPanel({ gameState, setGameState }: WorkerPanelProps) {
  const handleHireWorker = (workerId: number) => {
    const worker = gameState.workers.find((w) => w.id === workerId);
    if (!worker) return;

    if (gameState.cash < worker.wage * 5) {
      toast.error(`Need $${worker.wage * 5} signing bonus!`);
      return;
    }

    setGameState((prev) => {
      const updatedWorkers = prev.workers.map((w) =>
        w.id === workerId ? { ...w, hired: true } : w
      );

      // Update quest
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === 2 && !q.completed) {
          const hiredCount = updatedWorkers.filter((w) => w.hired).length;
          return { ...q, current: hiredCount, completed: hiredCount >= q.target };
        }
        return q;
      });

      return {
        ...prev,
        workers: updatedWorkers,
        cash: prev.cash - worker.wage * 5,
        totalExpenses: prev.totalExpenses + worker.wage * 5,
        quests: updatedQuests,
      };
    });

    toast.success(`${worker.name} hired as ${worker.role}!`);
  };

  const handleFireWorker = (workerId: number) => {
    const worker = gameState.workers.find((w) => w.id === workerId);
    if (!worker) return;

    setGameState((prev) => ({
      ...prev,
      workers: prev.workers.map((w) => (w.id === workerId ? { ...w, hired: false } : w)),
    }));

    toast.info(`${worker.name} has been let go.`);
  };

  const hiredWorkers = gameState.workers.filter((w) => w.hired);
  const availableWorkers = gameState.workers.filter((w) => !w.hired);
  const totalPayroll = hiredWorkers.reduce((sum, w) => sum + w.wage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h2 className="text-green-900 mb-4">👷 Worker Management</h2>
        <p className="text-gray-700 mb-4">
          Hire workers to help manage your farm. Each worker has a daily wage that impacts your expenses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-100 rounded-xl p-4 border-2 border-purple-300">
            <div className="text-sm text-purple-700">Total Employees</div>
            <div className="text-2xl text-purple-900">{hiredWorkers.length}</div>
          </div>
          <div className="bg-red-100 rounded-xl p-4 border-2 border-red-300">
            <div className="text-sm text-red-700">Daily Payroll</div>
            <div className="text-2xl text-red-900">${totalPayroll}</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-4 border-2 border-blue-300">
            <div className="text-sm text-blue-700">Avg Efficiency</div>
            <div className="text-2xl text-blue-900">
              {hiredWorkers.length > 0
                ? Math.round(hiredWorkers.reduce((sum, w) => sum + w.efficiency, 0) / hiredWorkers.length)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Hired Workers */}
      {hiredWorkers.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h3 className="text-green-900 mb-4">Your Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hiredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                hired={true}
                onAction={() => handleFireWorker(worker.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Workers */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-green-900 mb-4">Available for Hire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              hired={false}
              onAction={() => handleHireWorker(worker.id)}
              signingBonus={worker.wage * 5}
            />
          ))}
        </div>
      </div>

      {/* Business Education */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="mb-2">💡 Business Concept: Labor Costs</h3>
        <p className="text-sm mb-4">
          Workers are an <strong>operating expense</strong>. They increase productivity but reduce profit margins.
          Balance your workforce to maximize efficiency while controlling costs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">📊 Key Metrics</div>
            <div>• Morale: Happy workers = better output</div>
            <div>• Efficiency: How productive they are</div>
            <div>• Wage: Your fixed cost per day</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="font-medium mb-1">💼 Management Tips</div>
            <div>• Monitor payroll vs revenue</div>
            <div>• Fire underperformers to cut costs</div>
            <div>• Invest in morale for better ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkerCard({
  worker,
  hired,
  onAction,
  signingBonus,
}: {
  worker: Worker;
  hired: boolean;
  onAction: () => void;
  signingBonus?: number;
}) {
  const getRoleIcon = (role: string) => {
    if (role === 'planter') return '🌱';
    if (role === 'harvester') return '🚜';
    if (role === 'manager') return '👔';
    return '👷';
  };

  const getRoleColor = (role: string) => {
    if (role === 'planter') return 'from-green-400 to-green-600';
    if (role === 'harvester') return 'from-yellow-400 to-yellow-600';
    if (role === 'manager') return 'from-purple-400 to-purple-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`bg-gradient-to-br ${getRoleColor(worker.role)} rounded-xl p-4 text-white shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getRoleIcon(worker.role)}</div>
          <div>
            <div className="font-medium">{worker.name}</div>
            <div className="text-xs opacity-90 capitalize">{worker.role}</div>
          </div>
        </div>
        <div className="bg-white/30 px-2 py-1 rounded-lg text-xs">
          ${worker.wage}/day
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> Morale
            </span>
            <span>{worker.morale}%</span>
          </div>
          <Progress value={worker.morale} className="h-2 bg-white/30" />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Efficiency
            </span>
            <span>{worker.efficiency}%</span>
          </div>
          <Progress value={worker.efficiency} className="h-2 bg-white/30" />
        </div>
      </div>

      <Button
        onClick={onAction}
        className={`w-full ${
          hired
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-white text-gray-900 hover:bg-gray-100'
        }`}
      >
        {hired ? (
          'Fire Worker'
        ) : (
          <span className="flex items-center gap-2">
            <span>Hire</span>
            {signingBonus && <span className="text-xs">(${signingBonus} bonus)</span>}
          </span>
        )}
      </Button>
    </div>
  );
}
