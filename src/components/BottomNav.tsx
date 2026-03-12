import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Book, Activity, User } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/diary', icon: Book, label: '日记' },
    { path: '/camera', icon: Camera, label: '拍照', isPrimary: true },
    { path: '/exercise', icon: Activity, label: '运动' },
    { path: '/profile', icon: User, label: '我' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-5 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              >
                <Icon size={28} />
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center justify-center w-16 h-full space-y-1',
                isActive ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon size={24} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
