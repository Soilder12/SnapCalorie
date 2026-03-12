import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera as CameraIcon, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { recognizeFood } from '../lib/gemini';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';

export function Camera() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addMeal = useAppStore((state) => state.addMeal);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        processImage(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string, mimeType: string) => {
    setLoading(true);
    try {
      const foodItem = await recognizeFood(base64, mimeType);
      
      // Auto-add to today's lunch (for simplicity, real app would ask meal type)
      addMeal({
        id: Date.now().toString(),
        date: format(new Date(), 'yyyy-MM-dd'),
        mealType: 'lunch',
        food: foodItem,
        amount: 1,
      });

      alert(`识别成功！\n${foodItem.name}\n热量: ${foodItem.calories} kcal`);
      navigate('/diary', { replace: true });
    } catch (error) {
      console.error(error);
      alert('识别失败，请重试');
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pt-safe">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
          <X size={24} />
        </button>
        <span className="font-bold tracking-widest text-sm uppercase">拍拍热量</span>
        <div className="w-10" />
      </div>

      {/* Main Area */}
      {image ? (
        <div className="relative w-full h-full flex-1">
          <img src={image} alt="Captured" className="w-full h-full object-cover" />
          {loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
              <p className="text-lg font-medium tracking-wider animate-pulse">AI 正在识别食物...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-8">
          <div className="w-48 h-48 border-2 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center text-white/50 mb-8">
            <CameraIcon size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-medium tracking-wider">对准食物拍照</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {!image && (
        <div className="absolute bottom-24 left-0 right-0 p-8 flex justify-center items-center gap-12">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <ImageIcon size={28} />
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full bg-emerald-500 border-4 border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-90 transition-transform"
          >
            <div className="w-16 h-16 rounded-full border-2 border-white/50" />
          </button>

          <div className="w-14" /> {/* Spacer for balance */}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        className="hidden"
        onChange={handleCapture}
      />
    </div>
  );
}
