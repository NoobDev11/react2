import React from 'react';
import { View } from '../types';
import { HomeIcon, ChartBarIcon, TrophyIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon, FolderIcon } from './icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems = [
  { id: 'home' as View, label: 'Home', icon: HomeIcon },
  { id: 'organize' as View, label: 'Organize', icon: FolderIcon },
  { id: 'stats' as View, label: 'Stats', icon: ChartBarIcon },
  { id: 'achievements' as View, label: 'Achievements', icon: TrophyIcon },
  { id: 'settings' as View, label: 'Settings', icon: Cog6ToothIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl shadow-[#DDD6FE]/50 dark:shadow-[#4C1D95]/50 z-30">
      <div className="flex items-center h-16 px-4 gap-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              aria-label={item.label}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30 text-[#6D28D9] dark:text-[#A78BFA]' 
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-7 h-7" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;