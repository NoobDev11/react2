import React, { useContext, useMemo, useState } from 'react';
import { HabitContext } from '../App';
import { HabitContextType } from '../types';
import HabitCard from './HabitCard';
import TodoItem from './TodoItem';
import { ExclamationTriangleIcon } from './icons';

const HomeView: React.FC = () => {
    const { habits, todos, getLocalDateString } = useContext(HabitContext) as HabitContextType;
    const [activeTab, setActiveTab] = useState<'habits' | 'tasks'>('habits');

    const today = useMemo(() => getLocalDateString(new Date()), [getLocalDateString]);
    const dayOfWeek = useMemo(() => new Date().getDay(), []); // 0 for Sunday, 1 for Monday etc.

    const habitsForToday = useMemo(() => {
        return habits.filter(habit => {
            if (habit.frequencyType === 'everyday') {
                return true;
            }
            return habit.frequencyDays.includes(dayOfWeek);
        });
    }, [habits, dayOfWeek]);
    
    const incompleteTodos = useMemo(() => todos.filter(t => !t.completed), [todos]);

    const missedHabitsCount = useMemo(() => {
        const now = new Date();
        if (now.getHours() < 12) return 0;
        return habitsForToday.filter(h => !h.completions[today]).length;
    }, [habitsForToday, today]);

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="h-16 flex flex-col justify-center text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Today</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </header>

            <div className="bg-white dark:bg-gray-800 p-1 rounded-full flex gap-1 shadow-sm">
                <button 
                    onClick={() => setActiveTab('habits')}
                    className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${activeTab === 'habits' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:bg-[#7C3AED]/10 dark:hover:bg-gray-700'}`}
                >
                    Habits
                </button>
                <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${activeTab === 'tasks' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:bg-[#7C3AED]/10 dark:hover:bg-gray-700'}`}
                >
                    Tasks ({incompleteTodos.length})
                </button>
            </div>

            <section>
                {activeTab === 'habits' ? (
                     <>
                        {habitsForToday.length > 0 ? (
                            <div className="space-y-3">
                                {habitsForToday.map(habit => (
                                    <HabitCard 
                                        key={habit.id} 
                                        habit={habit} 
                                        date={today}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                <h3 className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                                   {habits.length > 0 ? "All done for today!" : "No Habits Yet"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {habits.length > 0 ? "Enjoy your break, or check the calendar for other habits." : "Tap the '+' button to add your first habit and start your journey."}
                                </p>
                            </div>
                        )}
                        {missedHabitsCount > 0 && (
                             <div className="mt-6 bg-red-100 dark:bg-[#402424] border-l-4 border-red-500 text-red-800 dark:text-red-400 p-4 rounded-r-lg flex items-center gap-3">
                                <ExclamationTriangleIcon className="w-6 h-6" />
                                <p className="font-semibold">You have {missedHabitsCount} habit{missedHabitsCount > 1 ? 's' : ''} left for today!</p>
                            </div>
                        )}
                    </>
                ) : (
                     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-2">
                        {incompleteTodos.length > 0 ? (
                            incompleteTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
                        ) : (
                            <div className="text-center py-16 px-4">
                                <h3 className="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">All tasks completed!</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Great job staying on top of your list.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomeView;