import React, { useContext, useMemo } from 'react';
import { Habit, HabitContextType, COLOR_MAP } from '../types';
import { HabitContext } from '../App';
import { ClockIcon, FlagIcon, RepeatIcon } from './icons';
import { iconMap, markerIconMap, markerColorMap } from './icons';

interface HabitCardProps {
  habit: Habit;
  date: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, date }) => {
  const { toggleHabitCompletion } = useContext(HabitContext) as HabitContextType;

  const isCompleted = habit.completions[date] || false;
  const colors = COLOR_MAP[habit.color] ?? COLOR_MAP['gray'];
  const IconComponent = iconMap[habit.icon] || iconMap['book'];

  const MarkerIcon = markerIconMap[habit.marker];
  const markerColorKey = markerColorMap[habit.marker] || 'deep-violet';
  const markerColor = COLOR_MAP[markerColorKey]?.text || 'text-gray-500';

  const frequencyText = useMemo(() => {
    if (habit.frequencyType === 'everyday' || habit.frequencyDays.length === 7) {
        return 'Everyday';
    }
    if (habit.frequencyDays.length === 0 && habit.frequencyType === 'specific_days') {
        return 'No days selected';
    }
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // Order days starting from Monday for better readability
    const sortedDays = [...habit.frequencyDays].sort((a, b) => {
        const dayA = a === 0 ? 7 : a; // Move Sunday to the end
        const dayB = b === 0 ? 7 : b;
        return dayA - dayB;
    });
    return sortedDays.map(d => dayMap[d]).join(', ');
  }, [habit.frequencyType, habit.frequencyDays]);

  return (
    <div
      className="p-3 rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md animate-fade-in-up"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-grow min-w-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0">
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">{habit.name}</p>
                 {habit.description && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{habit.description}</p>}
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {habit.reminders?.length > 0 && (
                        <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span className="truncate">{habit.reminders.join(', ')}</span>
                        </div>
                    )}
                     <div className="flex items-center gap-1">
                        <RepeatIcon className="w-4 h-4" />
                        <span>{frequencyText}</span>
                    </div>
                    {habit.targetStreak && (
                        <div className="flex items-center gap-1">
                            <FlagIcon className="w-4 h-4" />
                            <span>{habit.targetStreak} days</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
            <button 
                onClick={() => toggleHabitCompletion(habit.id, date)}
                className="w-10 h-10 flex items-center justify-center text-2xl group transition-transform active:scale-90"
                aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
                {isCompleted ? (
                    <span className="transform transition-all duration-300 ease-out animate-pop-in">
                      {MarkerIcon && <MarkerIcon className={`w-8 h-8 ${markerColor}`} />}
                    </span>
                ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all group-hover:border-[#A78BFA] dark:group-hover:border-[#7C3AED] group-hover:scale-110"></div>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;