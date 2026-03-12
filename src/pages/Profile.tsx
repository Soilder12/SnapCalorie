import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Download, Trash2, Moon, Globe, Target } from 'lucide-react';
import { generateWeightLossPlan } from '../lib/gemini';
import { useState } from 'react';

export function Profile() {
  const { profile, plan, setPlan, clearData } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const handleRegeneratePlan = async () => {
    if (!confirm('确定要重新生成减重计划吗？')) return;
    setLoading(true);
    try {
      const newPlan = await generateWeightLossPlan(profile);
      setPlan(newPlan);
      alert('计划已更新！');
    } catch (error) {
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    if (confirm('警告：此操作将清除所有本地数据，且无法恢复。确定要继续吗？')) {
      clearData();
      navigate('/setup', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4 space-y-6">
      <header className="pt-8 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
          {profile.gender === 'male' ? '👨' : '👩'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的</h1>
          <p className="text-sm text-gray-500">TDEE: {Math.round(profile.tdee)} kcal</p>
        </div>
      </header>

      <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-emerald-500" size={20} />
          <h2 className="font-bold text-gray-900">当前目标</h2>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-4">
          <p className="text-emerald-800 font-medium">
            在 {profile.targetMonths} 个月内减去 {profile.targetWeightLoss} 斤
          </p>
        </div>
        <button 
          onClick={handleRegeneratePlan}
          disabled={loading}
          className="w-full py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
        >
          {loading ? '正在生成...' : '重新生成 AI 计划'}
        </button>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-50">
          <li className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3 text-gray-700">
              <Settings size={20} className="text-gray-400" />
              <span>个人信息设置</span>
            </div>
          </li>
          <li className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3 text-gray-700">
              <Download size={20} className="text-gray-400" />
              <span>导出数据 (CSV)</span>
            </div>
          </li>
          <li className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3 text-gray-700">
              <Moon size={20} className="text-gray-400" />
              <span>深色模式 (开发中)</span>
            </div>
          </li>
          <li className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3 text-gray-700">
              <Globe size={20} className="text-gray-400" />
              <span>语言 (简体中文)</span>
            </div>
          </li>
          <li 
            onClick={handleClearData}
            className="flex items-center justify-between p-4 hover:bg-red-50 cursor-pointer"
          >
            <div className="flex items-center gap-3 text-red-500">
              <Trash2 size={20} />
              <span>清除所有数据</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
