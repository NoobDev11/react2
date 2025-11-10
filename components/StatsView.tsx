import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, Habit, COLOR_MAP } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, FlameIcon, FlagIcon, CheckIcon, markerIconMap, markerColorMap, iconMap } from './icons';

const BarChart: React.FC<{ data: { weekLabel: string, percentage: number }[] }> = ({ data }) => {
    const { theme } = useContext(HabitContext) as HabitContextType;
    const width = 320;
    const height = 150;
    const padding = 25;
    const axisLabelColor = theme === 'dark' ? '#9ca3af' : '#6b7281'; // gray-400 : gray-500
    const gridLineColor = theme === 'dark' ? '#374151' : '#e5e7eb';   // gray-700 : gray-200
    
    // Create a unique ID for the gradient
    const gradientId = `barGradient-${Math.random().toString(36).substr(2, 9)}`;

    if (data.length === 0) {
        return <div className="h-40 flex items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">Not enough data to show progress. Complete some habits to get started!</div>;
    }

    const barWidth = (width - 2 * padding) / data.length * 0.6; // 60% of available space for each bar
    const barSpacing = (width - 2 * padding) / data.length * 0.4;
    const maxY = 100;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
             <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" /> 
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            {/* Y-Axis labels and grid lines */}
            {[0, 25, 50, 75, 100].map(p => {
                const y = height - ((p / maxY) * (height - 2 * padding)) - padding;
                return (
                    <g key={p}>
                        <text x="0" y={y + 3} fontSize="10" fill={axisLabelColor}>{`${p}%`}</text>
                        <line x1={padding} y1={y} x2={width} y2={y} stroke={gridLineColor} strokeWidth="1" strokeDasharray="2,2" />
                    </g>
                );
            })}

            {/* Bars and X-Axis labels */}
            {data.map((point, i) => {
                const barHeight = (point.percentage / maxY) * (height - 2 * padding);
                const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
                const y = height - padding - barHeight;

                return (
                    <g key={i}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight > 0 ? barHeight : 0}
                            fill={`url(#${gradientId})`}
                            rx="3"
                            ry="3"
                        >
                            <title>{`${point.weekLabel}: ${point.percentage.toFixed(0)}% completion`}</title>
                        </rect>
                        <text
                            x={x + barWidth / 2}
                            y={height - 5}
                            fontSize="9"
                            textAnchor="middle"
                            fill={axisLabelColor}
                            transform={`rotate(-45, ${x + barWidth / 2}, ${height - 5})`}
                        >
                            {point.weekLabel}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};


const StatsView: React.FC = () => {
    const { habits, triggerConfetti, calculateStreaks, getLocalDateString } = useContext(HabitContext) as HabitContextType;
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(habits.length > 0 ? habits[0].id : null);
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const selectedHabit = useMemo(() => {
        return habits.find(h => h.id === selectedHabitId);
    }, [habits, selectedHabitId]);

    const colors = useMemo(() => {
        if (!selectedHabit) return COLOR_MAP.gray;
        return COLOR_MAP[selectedHabit.color] ?? COLOR_MAP.gray;
    }, [selectedHabit]);

    const { currentStreak, bestStreak } = useMemo(() => {
        if (!selectedHabit) return { currentStreak: 0, bestStreak: 0 };
        return calculateStreaks(selectedHabit);
    }, [selectedHabit, calculateStreaks]);
    
    const prevCurrentStreak = useRef(currentStreak);

    useEffect(() => {
        if (
            selectedHabit?.targetStreak &&
            currentStreak > prevCurrentStreak.current &&
            currentStreak === selectedHabit.targetStreak
        ) {
            triggerConfetti();
        }
        prevCurrentStreak.current = currentStreak;
    }, [currentStreak, selectedHabit?.targetStreak, triggerConfetti]);

    const weeklyProgress = useMemo(() => {
        if (!selectedHabit) return [];
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0

        return dayLabels.map((label, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (dayOfWeek - i));
            const dateDay = date.getDay(); // 0-6 for Sun-Sat
            const dateStr = getLocalDateString(date);
    
            const isScheduled = selectedHabit.frequencyType === 'everyday' || selectedHabit.frequencyDays.includes(dateDay);
            const isCompleted = selectedHabit.completions[dateStr] || false;
            const isCurrentDay = i === dayOfWeek;
            
            return { label, isScheduled, isCompleted, isCurrentDay };
        });
    }, [selectedHabit, getLocalDateString]);

    const overallProgressData = useMemo(() => {
        if (!selectedHabit) return [];
    
        const createdAt = new Date(selectedHabit.createdAt);
        const today = new Date();
        
        const getMonday = (d: Date) => {
            const date = new Date(d);
            date.setHours(0,0,0,0);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            return new Date(date.setDate(diff));
        }
    
        const endOfWeek = getMonday(today);
        
        // Calculate the start date to show the last 8 weeks
        const startOfWeek = new Date(endOfWeek);
        startOfWeek.setDate(startOfWeek.getDate() - 7 * 7); // 7 weeks before this week
        
        const weeklyData = [];
        let currentWeekStart = new Date(startOfWeek);
    
        while(currentWeekStart <= endOfWeek) {
            let completionsInWeek = 0;
            let scheduledDaysInWeek = 0;
            let weekEndDate = new Date(currentWeekStart);
            weekEndDate.setDate(weekEndDate.getDate() + 6);
    
            for (let i = 0; i < 7; i++) {
                const day = new Date(currentWeekStart);
                day.setDate(day.getDate() + i);
    
                if (day < createdAt || day > today) continue;
                
                const dayOfWeek = day.getDay();
                const isScheduled = selectedHabit.frequencyType === 'everyday' || selectedHabit.frequencyDays.includes(dayOfWeek);
                
                if(isScheduled) {
                    scheduledDaysInWeek++;
                    const dayStr = getLocalDateString(day);
                    if (selectedHabit.completions[dayStr]) {
                        completionsInWeek++;
                    }
                }
            }
            
            const percentage = scheduledDaysInWeek > 0 ? (completionsInWeek / scheduledDaysInWeek) * 100 : 0;
            
            const weekLabel = `${currentWeekStart.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}-${weekEndDate.toLocaleDateString('en-US', {day: 'numeric'})}`;
            
            weeklyData.push({ weekLabel, percentage });
    
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }
    
        return weeklyData;
    }, [selectedHabit, getLocalDateString]);
    
    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() + amount);
          return newDate;
        });
    };
    
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        
        // Previous month's days
        const firstDayIndex = (date.getDay() + 6) % 7; // Monday is 0
        const prevLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
          days.push({ day: prevLastDay - i + 1, isCurrentMonth: false, date: null });
        }
    
        // Current month's days
        while (date.getMonth() === month) {
          const d = new Date(date);
          const dateString = getLocalDateString(d);
          days.push({ day: d.getDate(), isCurrentMonth: true, date: dateString });
          date.setDate(date.getDate() + 1);
        }
        
        // Next month's days
        const lastDayIndex = (new Date(year, month + 1, 0).getDay() + 6) % 7;
        const nextDays = 6 - lastDayIndex;
        for (let i = 1; i <= nextDays; i++) {
            days.push({ day: i, isCurrentMonth: false, date: null });
        }
    
        return days;
    }, [currentDate, getLocalDateString]);

    if (habits.length === 0) {
        return (
            <div className="flex flex-col h-full justify-center animate-fade-in">
                 <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Stats Yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add some habits and complete them to see your stats here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="h-16 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center truncate">Stats: {selectedHabit?.name}</h1>
            </header>

            <div className="w-full">
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {habits.map(habit => {
                  const IconComponent = iconMap[habit.icon] || iconMap.book;
                  return (
                    <button
                      key={habit.id}
                      onClick={() => setSelectedHabitId(habit.id)}
                      className={`py-2 px-4 rounded-full font-semibold text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                        selectedHabitId === habit.id ? 'bg-[#7C3AED] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{habit.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center animate-fade-in-up">
                    <FlameIcon className="w-7 h-7 text-orange-500 mb-1"/>
                    <p className="text-3xl font-bold text-[#6D28D9] dark:text-[#A78BFA]">{currentStreak}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <FlameIcon className="w-7 h-7 text-gray-400 mb-1"/>
                    <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{bestStreak}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
                </div>
            </div>

            {selectedHabit && selectedHabit.targetStreak != null && selectedHabit.targetStreak > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><FlagIcon className="w-5 h-5"/>Target Streak</h3>
                        <span className="text-sm font-bold text-[#6D28D9] dark:text-[#A78BFA]">{currentStreak} / {selectedHabit.targetStreak} days</span>
                    </div>
                    <div className="w-full bg-[#7C3AED]/20 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-[#7C3AED] h-2.5 rounded-full" 
                            style={{ width: `${Math.min((currentStreak / selectedHabit.targetStreak) * 100, 100)}%` }}>
                        </div>
                    </div>
                    {currentStreak >= selectedHabit.targetStreak && (
                        <p className="text-center text-sm text-green-600 dark:text-green-400 font-semibold mt-2 animate-pulse">🎉 Target Reached! Keep it up! 🎉</p>
                    )}
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '300ms'}}>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-6 h-6" /></button>
                    <h2 className="text-lg font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day}>{day}</div>)}
                </div>
    
                <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((d, index) => {
                        const isCompleted = d.isCurrentMonth && selectedHabit?.completions[d.date!];
                        const MarkerIcon = isCompleted && selectedHabit ? markerIconMap[selectedHabit.marker] : null;
                        const markerColorKey = isCompleted && selectedHabit ? markerColorMap[selectedHabit.marker] : null;
                        const markerColor = markerColorKey ? COLOR_MAP[markerColorKey]?.text || 'text-gray-500' : 'text-gray-500';

                        return (
                            <div key={index} className={`w-10 h-10 flex justify-center items-center rounded-full mx-auto ${d.isCurrentMonth ? '' : 'text-gray-300 dark:text-gray-600'}`}>
                                {isCompleted && MarkerIcon ? (
                                    <MarkerIcon className={`w-7 h-7 ${markerColor}`} />
                                ) : (
                                    <span>{d.day}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">This Week's Progress</h3>
                <div className="flex justify-around items-center">
                    {weeklyProgress.map((day, i) => {
                        let statusClasses = '';
                        if (day.isScheduled) {
                            statusClasses = day.isCompleted 
                                ? 'bg-[#7C3AED] text-white' 
                                : `border-2 border-gray-300 dark:border-gray-600 ${day.isCurrentDay ? 'bg-gray-100 dark:bg-gray-700' : ''}`;
                        } else {
                            statusClasses = 'border-2 border-dashed border-gray-200 dark:border-gray-700';
                        }
                        
                        return (
                            <div key={i} className="flex flex-col items-center gap-2" title={day.isScheduled ? (day.isCompleted ? 'Completed' : 'Incomplete') : 'Not scheduled'}>
                                <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${statusClasses}`}>
                                    {day.isCompleted && <CheckIcon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-medium ${day.isCurrentDay ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {day.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: '500ms'}}>
                <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">Overall Progress (Last 8 Weeks)</h3>
                <BarChart data={overallProgressData} />
            </div>

        </div>
    );
};

export default StatsView;
