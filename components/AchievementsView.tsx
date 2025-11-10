import React, { useContext, useMemo, useEffect, useRef } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, Habit } from '../types';
import { TrophyIcon, achievementIconMap } from './icons';

const achievementTiers = [
    { name: '3 Days', days: 3, points: 10, iconName: 'leaf', color: 'text-green-500', description: "Complete a habit for 3 days straight." },
    { name: '7 Days', days: 7, points: 20, iconName: 'seedling', color: 'text-lime-500', description: "Stay consistent for a full week." },
    { name: '15 Days', days: 15, points: 30, iconName: 'flower', color: 'text-pink-500', description: "A solid two-week streak." },
    { name: '30 Days', days: 30, points: 50, iconName: 'sparkle', color: 'text-yellow-400', description: "You've made it a monthly habit!" },
    { name: '60 Days', days: 60, points: 75, iconName: 'bronze', color: 'text-[#cd7f32]', description: "Two months of dedication. Incredible!" },
    { name: '90 Days', days: 90, points: 100, iconName: 'silver', color: 'text-slate-400', description: "Three months strong. This is a lifestyle." },
    { name: '180 Days', days: 180, points: 150, iconName: 'gold', color: 'text-yellow-500', description: "Half a year of consistency!" },
    { name: '365 Days', days: 365, points: 300, iconName: 'gem', color: 'text-violet-500', description: "A full year of success. You're a legend!" },
];

const CUSTOM_TARGET_POINTS = 100;

const AchievementsView: React.FC = () => {
    const { habits, triggerConfetti, calculateStreaks } = useContext(HabitContext) as HabitContextType;

    const summary = useMemo(() => {
        let totalPoints = 0;
        let longestStreak = 0;
        let awardsEarned = 0;

        habits.forEach(habit => {
            const { bestStreak } = calculateStreaks(habit);
            if (bestStreak > longestStreak) {
                longestStreak = bestStreak;
            }
            // Standard streak achievements
            achievementTiers.forEach(tier => {
                if (bestStreak >= tier.days) {
                    totalPoints += tier.points;
                    awardsEarned++;
                }
            });
            // Custom target achievement
            if (habit.targetStreak && bestStreak >= habit.targetStreak) {
                totalPoints += CUSTOM_TARGET_POINTS;
                awardsEarned++;
            }
        });

        return { totalPoints, longestStreak, awardsEarned };
    }, [habits, calculateStreaks]);
    
    const prevAwardsEarned = useRef(summary.awardsEarned);

    useEffect(() => {
        if (summary.awardsEarned > prevAwardsEarned.current) {
            triggerConfetti();
        }
        prevAwardsEarned.current = summary.awardsEarned;
    }, [summary.awardsEarned, triggerConfetti]);

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="h-16 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Achievements</h1>
            </header>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-2 border-dashed border-[#A78BFA] dark:border-[#5B21B6] text-center animate-fade-in-up">
                <p className="text-4xl font-bold text-[#6D28D9] dark:text-[#A78BFA]">{summary.totalPoints}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{summary.longestStreak}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{summary.awardsEarned}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Awards Earned</p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-bold text-lg text-center">Streak Awards by Habit</h3>
                {habits.map((habit, habitIndex) => {
                    const { bestStreak } = calculateStreaks(habit);
                    const nextTier = achievementTiers.find(t => t.days > bestStreak);
                    const progressPercentage = nextTier ? (bestStreak / nextTier.days) * 100 : 100;

                    return (
                        <div key={habit.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-fade-in-up" style={{animationDelay: `${400 + habitIndex * 100}ms`}}>
                            <h3 className="font-bold text-lg mb-3">{habit.name}</h3>
                            
                            {nextTier && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <span>Progress to next award ({nextTier.name})</span>
                                        <span>{bestStreak} / {nextTier.days} days</span>
                                    </div>
                                    <div className="w-full bg-[#7C3AED]/20 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-[#7C3AED] h-2 rounded-full" style={{width: `${progressPercentage}%`}}></div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                {achievementTiers.map(tier => {
                                    const isUnlocked = bestStreak >= tier.days;
                                    const Icon = achievementIconMap[tier.iconName];
                                    const iconColor = isUnlocked ? tier.color : 'text-gray-400 dark:text-gray-600';
                                    
                                    return (
                                        <div key={tier.name} className="relative group">
                                            <div className={`text-center p-2 rounded-lg transition-colors ${isUnlocked ? 'bg-[#7C3AED]/10 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                                                <div className={`h-8 flex items-center justify-center transition-opacity ${!isUnlocked && 'opacity-50'}`}>
                                                    <Icon className={`w-8 h-8 ${iconColor}`} />
                                                </div>
                                                <p className={`text-xs font-bold mt-1 transition-opacity ${!isUnlocked && 'opacity-50'}`}>{tier.name}</p>
                                                <p className={`text-xs text-gray-500 dark:text-gray-400 transition-opacity ${!isUnlocked && 'opacity-50'}`}>{tier.points} pts</p>
                                            </div>
                                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-md py-1 px-2 z-10 shadow-lg">
                                                {tier.description}
                                            </div>
                                        </div>
                                    );
                                })}
                                 {habit.targetStreak && habit.targetStreak > 0 && (
                                    (() => {
                                        const isUnlocked = bestStreak >= habit.targetStreak;
                                        const iconColor = isUnlocked ? 'text-amber-500' : 'text-gray-400 dark:text-gray-600';
                                        return (
                                             <div className="relative group">
                                                <div className={`text-center p-2 rounded-lg transition-colors ${isUnlocked ? 'bg-amber-400/10 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800/50'}`}>
                                                    <div className={`h-8 flex items-center justify-center transition-opacity ${!isUnlocked && 'opacity-50'}`}>
                                                        <TrophyIcon className={`w-8 h-8 ${iconColor}`} />
                                                    </div>
                                                    <p className={`text-xs font-bold mt-1 transition-opacity ${!isUnlocked && 'opacity-50'}`}>Custom</p>
                                                    <p className={`text-xs text-gray-500 dark:text-gray-400 transition-opacity ${!isUnlocked && 'opacity-50'}`}>{CUSTOM_TARGET_POINTS} pts</p>
                                                </div>
                                                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-md py-1 px-2 z-10 shadow-lg">
                                                    Reach your custom target of {habit.targetStreak} days.
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsView;