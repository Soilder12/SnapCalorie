import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { calculateTDEE } from '../lib/calculations';
import { generateWeightLossPlan } from '../lib/gemini';
import { ActivityLevel, Gender, UserProfile } from '../types';
import { Loader2 } from 'lucide-react';

export function SetupWizard() {
  const navigate = useNavigate();
  const setProfile = useAppStore((state) => state.setProfile);
  const setPlan = useAppStore((state) => state.setPlan);

  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(25);
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(65);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [targetWeightLoss, setTargetWeightLoss] = useState<number>(0);
  const [targetMonths, setTargetMonths] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const profile: UserProfile = {
        gender,
        age,
        height,
        weight,
        activityLevel,
        targetWeightLoss,
        targetMonths,
        tdee: 0,
      };
      
      profile.tdee = calculateTDEE(profile);
      setProfile(profile);

      const plan = await generateWeightLossPlan(profile);
      setPlan(plan);

      alert('您的减重计划已生成！');
      navigate('/home', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成计划失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎使用拍拍热量</h1>
      <p className="text-gray-500 mb-8">请填写您的个人信息，我们将为您量身定制热量计划。</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">性别</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex-1 py-3 rounded-xl border ${gender === 'male' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}
            >
              男
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex-1 py-3 rounded-xl border ${gender === 'female' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}
            >
              女
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">年龄 (岁)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">身高 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">活动水平</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
          >
            <option value="sedentary">久坐 (几乎不运动)</option>
            <option value="lightly_active">轻度活跃 (每周运动1-3天)</option>
            <option value="moderately_active">中度活跃 (每周运动3-5天)</option>
            <option value="very_active">高度活跃 (每周运动6-7天)</option>
          </select>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700">减重目标 (选填)</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">我想在</span>
            <input
              type="number"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value))}
              className="w-16 p-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-gray-600">个月内减去</span>
            <input
              type="number"
              value={targetWeightLoss}
              onChange={(e) => setTargetWeightLoss(Number(e.target.value))}
              className="w-16 p-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-gray-600">斤</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">留空或填0表示维持当前体重</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-[0.98] transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              正在生成专属计划...
            </>
          ) : (
            '生成减重计划'
          )}
        </button>
      </form>
    </div>
  );
}
