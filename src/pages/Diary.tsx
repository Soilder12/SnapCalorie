import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export function Diary() {
  const { meals, removeMeal } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dailyMeals = meals.filter((m) => m.date === dateStr);

  const mealTypes = [
    { id: 'breakfast', label: '早餐', icon: '🌅' },
    { id: 'lunch', label: '午餐', icon: '☀️' },
    { id: 'dinner', label: '晚餐', icon: '🌙' },
    { id: 'snack', label: '加餐', icon: '🍎' },
  ];

  const totalCalories = dailyMeals.reduce((sum, m) => sum + m.food.calories * m.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">
              {format(currentDate, 'MM月dd日')}
            </h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {format(currentDate, 'EEEE')}
            </p>
          </div>

          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500 font-medium">总摄入</p>
            <p className="text-3xl font-black text-emerald-500">
              {Math.round(totalCalories)} <span className="text-sm text-gray-400 font-normal">kcal</span>
            </p>
          </div>
        </div>
      </header>

      {/* Meal Sections */}
      <div className="p-4 space-y-6">
        {mealTypes.map((type) => {
          const typeMeals = dailyMeals.filter((m) => m.mealType === type.id);
          const typeCalories = typeMeals.reduce((sum, m) => sum + m.food.calories * m.amount, 0);

          return (
            <section key={type.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{type.icon}</span>
                  <h2 className="font-bold text-gray-900">{type.label}</h2>
                </div>
                <span className="text-sm font-bold text-emerald-500">{Math.round(typeCalories)} kcal</span>
              </div>

              {typeMeals.length > 0 ? (
                <ul className="space-y-3">
                  {typeMeals.map((meal) => (
                    <li key={meal.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{meal.food.name}</p>
                        <p className="text-xs text-gray-400">
                          {meal.amount} {meal.food.servingSize} • {Math.round(meal.food.calories * meal.amount)} kcal
                        </p>
                      </div>
                      <button 
                        onClick={() => removeMeal(meal.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-4 text-center text-gray-400 text-sm">
                  暂无记录
                </div>
              )}

              <Link 
                to="/camera" 
                className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-emerald-100 text-emerald-600 font-medium flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
              >
                <Plus size={18} />
                添加食物
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
