import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 max-w-md mx-auto relative shadow-2xl">
      <main className="min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
