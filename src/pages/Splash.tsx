import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Camera } from 'lucide-react';

export function Splash() {
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile) {
        navigate('/home', { replace: true });
      } else {
        navigate('/setup', { replace: true });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, profile]);

  return (
    <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Camera size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">拍拍热量</h1>
        <p className="text-emerald-100 font-medium tracking-widest uppercase text-sm">SnapCalorie</p>
      </motion.div>
    </div>
  );
}
