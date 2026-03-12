import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { Flame, Utensils, Activity, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { profile, plan, meals, exercises } = useAppStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayMeals = meals.filter((m) => m.date === today);
  const todayExercises = exercises.filter((e) => e.date === today);

  const intake = todayMeals.reduce((sum, m) => sum + m.food.calories * m.amount, 0);
  const burned = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  const netCalories = intake - burned;

  const target = plan?.dailyTotal || profile?.tdee || 2000;
  const progress = Math.min((intake / target) * 100, 100);

  const protein = todayMeals.reduce((sum, m) => sum + m.food.protein * m.amount, 0);
  const carbs = todayMeals.reduce((sum, m) => sum + m.food.carbs * m.amount, 0);
  const fat = todayMeals.reduce((sum, m) => sum + m.food.fat * m.amount, 0);

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center pt-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">今日概览</h1>
          <p className="text-sm text-gray-500">{format(new Date(), 'yyyy年MM月dd日')}</p>
        </div>
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
          {profile?.gender === 'male' ? '👨' : '👩'}
        </div>
      </header>

      {/* Main Dashboard Ring */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">摄入</p>
            <p className="text-xl font-bold text-gray-900">{Math.round(intake)}</p>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={`${progress * 2.83} 283`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-500">{Math.round(target - netCalories)}</span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">剩余大卡</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">消耗</p>
            <p className="text-xl font-bold text-orange-500">{Math.round(burned)}</p>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">碳水</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
              <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${Math.min((carbs / 250) * 100, 100)}%` }}></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{Math.round(carbs)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">蛋白质</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
              <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: `${Math.min((protein / 150) * 100, 100)}%` }}></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{Math.round(protein)}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">脂肪</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
              <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.min((fat / 70) * 100, 100)}%` }}></div>
            </div>
            <p className="text-sm font-semibold text-gray-700">{Math.round(fat)}g</p>
          </div>
        </div>
      </section>

      {/* AI Plan */}
      {plan && (
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-emerald-500" size={20} />
            <h2 className="font-bold text-emerald-900">AI 减重计划</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xs text-emerald-600/70 mb-1">早餐</p>
              <p className="font-bold text-emerald-900">{plan.breakfastCal}</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xs text-emerald-600/70 mb-1">午餐</p>
              <p className="font-bold text-emerald-900">{plan.lunchCal}</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-3 text-center">
              <p className="text-xs text-emerald-600/70 mb-1">晚餐</p>
              <p className="font-bold text-emerald-900">{plan.dinnerCal}</p>
            </div>
          </div>
          <p className="text-sm text-emerald-800/80 leading-relaxed bg-white/40 p-3 rounded-xl">
            {plan.tips}
          </p>
        </section>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/camera" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
            <Utensils size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">记录饮食</p>
            <p className="text-xs text-gray-400">拍照秒算热量</p>
          </div>
        </Link>
        <Link to="/exercise" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Activity size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-900">记录运动</p>
            <p className="text-xs text-gray-400">消耗卡路里</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
