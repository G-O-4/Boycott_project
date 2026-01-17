import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-dark-900 noise-overlay bg-grid-pattern">
      {/* Palestinian flag stripe at top */}
      <div className="palestine-stripe" />
      
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px]" />
      </div>
      
      <Header />
      
      <main className="pb-24 relative z-10">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}
