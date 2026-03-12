import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { Activity, Plus, Trash2, Search, X } from 'lucide-react';
import { EXERCISE_DB, calculateExerciseCalories } from '../lib/calculations';

export function Exercise() {
  const { profile, exercises, addExercise, removeExercise } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISE_DB[0] | null>(null);
  const [duration, setDuration] = useState(30);
  const [inputType, setInputType] = useState<'duration' | 'steps'>('duration');
  const [steps, setSteps] = useState(6000);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayExercises = exercises.filter((e) => e.date === today);
  const totalBurned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

  const filteredDB = search 
    ? EXERCISE_DB.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : EXERCISE_DB.slice(0, 6);

  const isStepCompatible = selectedExercise?.name.includes('步行') || selectedExercise?.name.includes('跑步');

  const calculateCalories = () => {
    if (!selectedExercise || !profile) return 0;
    const effectiveDuration = inputType === 'steps' && isStepCompatible ? steps / 100 : duration;
    return calculateExerciseCalories(selectedExercise.met, profile.weight, effectiveDuration);
  };

  const handleAdd = () => {
    if (!selectedExercise) return;
    if (!profile) {
      alert('请先完善个人信息');
      return;
    }
    
    const effectiveDuration = inputType === 'steps' && isStepCompatible ? steps / 100 : duration;
    const calories = calculateExerciseCalories(selectedExercise.met, profile.weight, effectiveDuration);
    
    addExercise({
      id: Date.now().toString(),
      date: today,
      name: inputType === 'steps' && isStepCompatible ? `${selectedExercise.name} (${steps}步)` : selectedExercise.name,
      duration: Math.round(effectiveDuration),
      caloriesBurned: calories,
    });
    
    setSelectedExercise(null);
    setSearch('');
    setDuration(30);
    setSteps(6000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4 space-y-6">
      <header className="pt-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">运动记录</h1>
        <div className="bg-orange-500 text-white p-6 rounded-3xl shadow-lg shadow-orange-500/30 flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium tracking-wider uppercase mb-1">今日消耗</p>
            <p className="text-4xl font-black">{Math.round(totalBurned)} <span className="text-lg font-normal">kcal</span></p>
          </div>
          <Activity size={48} className="opacity-50" />
        </div>
      </header>

      {/* Add Exercise */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="text-orange-500" size={20} />
          添加运动
        </h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索运动 (如: 步行, 跑步)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        {!selectedExercise && (
          <ul className="max-h-64 overflow-y-auto mb-4 border border-gray-100 rounded-xl divide-y divide-gray-50">
            {filteredDB.map((ex) => (
              <li 
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex);
                  setInputType((ex.name.includes('步行') || ex.name.includes('跑步')) ? 'steps' : 'duration');
                }}
                className="p-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{ex.name}</span>
                <span className="text-xs text-gray-400">MET: {ex.met}</span>
              </li>
            ))}
            {!search && (
              <li className="p-3 text-center text-xs text-gray-400 bg-gray-50">
                输入关键词搜索更多运动
              </li>
            )}
          </ul>
        )}

        {selectedExercise && (
          <div className="bg-orange-50 p-4 rounded-xl mb-4 border border-orange-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-orange-900">{selectedExercise.name}</span>
              <button onClick={() => setSelectedExercise(null)} className="text-orange-400 hover:text-orange-600">
                <X size={18} />
              </button>
            </div>

            {isStepCompatible && (
              <div className="flex gap-2 mb-4 bg-orange-100/50 p-1 rounded-lg">
                <button
                  onClick={() => setInputType('duration')}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${inputType === 'duration' ? 'bg-white text-orange-600 shadow-sm font-medium' : 'text-orange-600/60'}`}
                >
                  按时长
                </button>
                <button
                  onClick={() => setInputType('steps')}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${inputType === 'steps' ? 'bg-white text-orange-600 shadow-sm font-medium' : 'text-orange-600/60'}`}
                >
                  按步数
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {inputType === 'steps' && isStepCompatible ? (
                  <>
                    <label className="block text-xs text-orange-600/70 mb-1">步数</label>
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                    />
                  </>
                ) : (
                  <>
                    <label className="block text-xs text-orange-600/70 mb-1">时长 (分钟)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                    />
                  </>
                )}
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-orange-600/70 mb-1">预计消耗</p>
                <p className="text-xl font-bold text-orange-600">
                  {Math.round(calculateCalories())} kcal
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleAdd}
              className="w-full mt-4 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
            >
              确认添加
            </button>
          </div>
        )}
      </section>

      {/* Today's List */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4">今日记录</h2>
        {todayExercises.length > 0 ? (
          <ul className="space-y-3">
            {todayExercises.map((ex) => (
              <li key={ex.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{ex.name}</p>
                    <p className="text-xs text-gray-400">{ex.duration} 分钟</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-orange-500">{Math.round(ex.caloriesBurned)} kcal</span>
                  <button 
                    onClick={() => removeExercise(ex.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400 py-4 text-sm">暂无运动记录</p>
        )}
      </section>
    </div>
  );
}
