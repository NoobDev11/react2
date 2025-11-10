import React, { useMemo } from 'react';
import { Habit } from '../types';
import { XMarkIcon } from './icons';

interface HabitHistoryModalProps {
  habit: Habit;
  onClose: () => void;
}

const colorVariants: { [key: string]: { bg: string; } } = {
    red: { bg: 'bg-red-100 dark:bg-red-900/50' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/50' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    green: { bg: 'bg-green-100 dark:bg-green-900/50' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/50' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/50' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/50' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/50' },
    gray: { bg: 'bg-gray-100 dark:bg-gray-700' },
};

const HabitHistoryModal: React.FC<HabitHistoryModalProps> = ({ habit, onClose }) => {
  const currentDate = new Date();
  const color = colorVariants[habit.color] || colorVariants.gray;

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Previous month's padding days (for a Sunday-start week)
    const firstDayIndex = date.getDay(); 
    const prevLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({ day: prevLastDay - i + 1, isCurrentMonth: false, date: null, isCompleted: false });
    }

    // Current month's days
    while (date.getMonth() === month) {
      const d = new Date(date);
      const dateString = d.toISOString().split('T')[0];
      days.push({ day: d.getDate(), isCurrentMonth: true, date: dateString, isCompleted: !!habit.completions[dateString] });
      date.setDate(date.getDate() + 1);
    }
    
    // Next month's padding days
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 6 - lastDayIndex;
    for (let i = 1; i <= nextDays; i++) {
        days.push({ day: i, isCurrentMonth: false, date: null, isCompleted: false });
    }

    return days;
  }, [currentDate, habit.completions]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 text-2xl rounded-lg flex items-center justify-center ${color.bg}`}>
              <span className="transform scale-125">{habit.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{habit.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion History</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div>
          <h3 className="text-lg font-semibold text-center mb-3 text-gray-800 dark:text-gray-200">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((d, index) => (
                <div key={index} className={`w-9 h-9 flex justify-center items-center rounded-full mx-auto text-sm ${d.isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                    <span className={`w-full h-full flex items-center justify-center rounded-full ${d.isCompleted ? 'bg-purple-500 text-white font-bold' : ''}`}>
                        {d.day}
                    </span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitHistoryModal;
