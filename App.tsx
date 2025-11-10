import React, { useState, createContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { Habit, View, HabitContextType, Todo, Folder, User } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import OrganizeView from './components/Dashboard';
import StatsView from './components/StatsView';
import AchievementsView from './components/AchievementsView';
import SettingsView from './components/SettingsView';
import { PlusIcon } from './components/icons';
import { CheckBadgeIcon, ClipboardDocumentCheckIcon } from './components/icons';
import AddHabitModal from './components/AddHabitModal';
import AddTodoModal from './components/AddItemModal';
import AddFolderModal from './components/Modal';
import WelcomeView from './components/WelcomeView';

// Add confetti to the global window object type
declare global {
  interface Window {
    confetti: any;
  }
}

export const HabitContext = createContext<HabitContextType | null>(null);

const App: React.FC = () => {
  const [activeView, setActiveView] = useLocalStorage<View>('activeView', 'home');
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [taskFolders, setTaskFolders] = useLocalStorage<Folder[]>('taskFolders', []);
  const [habitFolders, setHabitFolders] = useLocalStorage<Folder[]>('habitFolders', []);
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  
  const [isAddHabitModalOpen, setAddHabitModalOpen] = useState(false);
  const [isAddTodoModalOpen, setAddTodoModalOpen] = useState(false);
  const [isAddFolderModalOpen, setAddFolderModalOpen] = useState<false | 'task' | 'habit'>(false);
  const [isFabOpen, setFabOpen] = useState(false);
  const [isModalOpenByChild, setIsModalOpen] = useState(false);
  
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [isInitialized, setInitialized] = useState(false);
  const notificationTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const areModalsOpen = isAddHabitModalOpen || isAddTodoModalOpen || !!isAddFolderModalOpen || isModalOpenByChild;


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Effect to handle the initial welcome/greeting screen
  useEffect(() => {
    if (user) {
      // If a user exists, show the greeting screen for a short duration
      const timer = setTimeout(() => {
        setInitialized(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
    // If no user, we wait for the onboarding process to complete.
    // isInitialized remains false.
  }, [user]);

  // Effect for scheduling notifications
  useEffect(() => {
    notificationTimeouts.current.forEach(clearTimeout);
    notificationTimeouts.current = [];

    if (notificationPermission === 'granted') {
      const now = new Date();
      
      // Habit reminders
      habits.forEach(habit => {
        habit.reminders.forEach(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const reminderDate = new Date();
          reminderDate.setHours(hours, minutes, 0, 0);

          if (reminderDate > now) {
            const timeoutId = setTimeout(() => {
              new Notification(habit.name, {
                body: `Time for your habit! Don't forget to complete it.`,
                icon: '/vite.svg',
              });
            }, reminderDate.getTime() - now.getTime());
            notificationTimeouts.current.push(timeoutId);
          }
        });
      });

      // Hourly summary for incomplete tasks
      const incompleteTasks = todos.filter(t => !t.completed);
      if (incompleteTasks.length > 0) {
        const currentHour = now.getHours();
        // Remind users hourly between 9 AM and 10 PM.
        const startHour = Math.max(9, currentHour + 1);
        for (let hour = startHour; hour <= 22; hour++) {
          const reminderDate = new Date();
          reminderDate.setHours(hour, 0, 0, 0);

          const timeoutId = setTimeout(() => {
            new Notification('Task Reminder', {
                body: `You have ${incompleteTasks.length} task(s) left to complete today. Keep going!`,
                icon: '/vite.svg',
            });
          }, reminderDate.getTime() - now.getTime());
          notificationTimeouts.current.push(timeoutId);
        }
      }
    }

    return () => {
      notificationTimeouts.current.forEach(clearTimeout);
    };
  }, [habits, todos, notificationPermission]);

  const triggerConfetti = useCallback(() => {
    if(window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        drift: -0.5,
      });
    }
  }, []);

  // --- Utility Functions ---
  const getLocalDateString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const calculateStreaks = useCallback((habit: Habit) => {
    if (!habit) return { currentStreak: 0, bestStreak: 0 };
    
    const { completions, frequencyType, frequencyDays, createdAt } = habit;

    const isScheduled = (date: Date): boolean => {
        if (frequencyType === 'everyday') return true;
        if (frequencyType === 'specific_days') {
            return frequencyDays.includes(date.getDay());
        }
        return false;
    };

    const completionSet = new Set(Object.keys(completions).filter(d => completions[d]));
    if (completionSet.size === 0) {
        return { currentStreak: 0, bestStreak: 0 };
    }

    const startDate = new Date(createdAt);
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Current Streak Calculation ---
    let currentStreak = 0;
    for (let d = new Date(today); d >= startDate; d.setDate(d.getDate() - 1)) {
        if (isScheduled(d)) {
            const dateStr = getLocalDateString(d);
            if (completionSet.has(dateStr)) {
                currentStreak++;
            } else {
                break; // Streak broken
            }
        }
    }

    // --- Best Streak Calculation ---
    let bestStreak = 0;
    let currentSegmentStreak = 0;
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        if (isScheduled(d)) {
            const dateStr = getLocalDateString(d);
            if (completionSet.has(dateStr)) {
                currentSegmentStreak++;
            } else {
                bestStreak = Math.max(bestStreak, currentSegmentStreak);
                currentSegmentStreak = 0;
            }
        }
    }
    bestStreak = Math.max(bestStreak, currentSegmentStreak);

    return { currentStreak, bestStreak };
  }, [getLocalDateString]);

  // --- Habit Methods ---
  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      completions: {},
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);

  const editHabit = useCallback((habitData: Habit) => {
    setHabits(prev => prev.map(h => h.id === habitData.id ? habitData : h));
  }, [setHabits]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const newCompletions = { ...habit.completions };
          if (newCompletions[date]) {
            delete newCompletions[date];
          } else {
            newCompletions[date] = true;
          }
          return { ...habit, completions: newCompletions };
        }
        return habit;
      })
    );
  }, [setHabits]);

  const deleteHabit = useCallback((habitId: string) => {
      setHabits(prev => prev.filter(h => h.id !== habitId));
  }, [setHabits]);

  const reorderHabits = useCallback((draggedId: string, targetId: string) => {
    setHabits(prev => {
        const draggedIndex = prev.findIndex(h => h.id === draggedId);
        const targetIndex = prev.findIndex(h => h.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;

        const newHabits = [...prev];
        const [draggedItem] = newHabits.splice(draggedIndex, 1);
        newHabits.splice(targetIndex, 0, draggedItem);
        return newHabits;
    });
  }, [setHabits]);
  
  const getHabitById = useCallback((habitId: string) => {
    return habits.find(h => h.id === habitId);
  }, [habits]);

  // --- To-do Methods ---
  const addTodo = useCallback((todoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: `todo-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [...prev, newTodo]);
  }, [setTodos]);

  const editTodo = useCallback((todoData: Todo) => {
    setTodos(prev => prev.map(t => t.id === todoData.id ? todoData : t));
  }, [setTodos]);

  const toggleTodoCompletion = useCallback((todoId: string) => {
    setTodos(prev => prev.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t));
  }, [setTodos]);

  const deleteTodo = useCallback((todoId: string) => {
    setTodos(prev => prev.filter(t => t.id !== todoId));
  }, [setTodos]);
  
  const reorderTodos = useCallback((draggedId: string, targetId: string) => {
    setTodos(prev => {
        const draggedIndex = prev.findIndex(t => t.id === draggedId);
        const targetIndex = prev.findIndex(t => t.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return prev;

        const newTodos = [...prev];
        const [draggedItem] = newTodos.splice(draggedIndex, 1);
        newTodos.splice(targetIndex, 0, draggedItem);
        return newTodos;
    });
  }, [setTodos]);

  // --- Task Folder Methods ---
  const addTaskFolder = useCallback((folderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-task-${Date.now()}`,
    };
    setTaskFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, [setTaskFolders]);

  const editTaskFolder = useCallback((folderData: Folder) => {
    setTaskFolders(prev => prev.map(f => f.id === folderData.id ? folderData : f));
    return folderData;
  }, [setTaskFolders]);

  const deleteTaskFolder = useCallback((folderId: string) => {
    setTaskFolders(prev => prev.filter(f => f.id !== folderId));
    setTodos(prev => prev.map(t => t.folderId === folderId ? { ...t, folderId: null } : t));
  }, [setTaskFolders, setTodos]);

  const getTaskFolderById = useCallback((folderId: string) => taskFolders.find(f => f.id === folderId), [taskFolders]);

  // --- Habit Folder Methods ---
  const addHabitFolder = useCallback((folderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-habit-${Date.now()}`,
    };
    setHabitFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, [setHabitFolders]);

  const editHabitFolder = useCallback((folderData: Folder) => {
    setHabitFolders(prev => prev.map(f => f.id === folderData.id ? folderData : f));
    return folderData;
  }, [setHabitFolders]);

  const deleteHabitFolder = useCallback((folderId: string) => {
    setHabitFolders(prev => prev.filter(f => f.id !== folderId));
    setHabits(prev => prev.map(h => h.folderId === folderId ? { ...h, folderId: null } : h));
  }, [setHabitFolders, setHabits]);

  const getHabitFolderById = useCallback((folderId: string) => habitFolders.find(f => f.id === folderId), [habitFolders]);


  const importHabits = useCallback((importedData: any[]) => {
      if (Array.isArray(importedData) && importedData.every(h => h.id && h.name)) {
        const migratedHabits: Habit[] = importedData.map(h => {
          const newHabit = { ...h };
          if (h.reminder && !h.reminders) {
            newHabit.reminders = [h.reminder];
            delete newHabit.reminder;
          } else if (!h.reminders) {
            newHabit.reminders = [];
          }
          delete newHabit.goal;
          delete newHabit.weeklyGoal;
          if (!newHabit.frequencyType) {
            newHabit.frequencyType = 'everyday';
            newHabit.frequencyDays = [];
          }
          return newHabit as Habit;
        });
        setHabits(migratedHabits);
        alert('Data imported successfully!');
      } else {
        alert('Invalid data format. Could not import.');
      }
  }, [setHabits]);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notifications.');
        return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
        new Notification('Habitta', {
            body: 'Notifications have been enabled!',
            icon: '/vite.svg',
        });
    }
  }, []);

  const resetData = useCallback(() => {
    setHabits([]);
    setTodos([]);
    setTaskFolders([]);
    setHabitFolders([]);
    setUser(null);
  }, [setHabits, setTodos, setTaskFolders, setHabitFolders, setUser]);
  
  const getAllDataAsString = useCallback(() => {
    return JSON.stringify({
        habits,
        todos,
        taskFolders,
        habitFolders,
        user,
    });
  }, [habits, todos, taskFolders, habitFolders, user]);

  const loadDataFromString = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.habits) setHabits(data.habits);
      if (data.todos) setTodos(data.todos);
      if (data.taskFolders) setTaskFolders(data.taskFolders);
      if (data.habitFolders) setHabitFolders(data.habitFolders);
      if (data.user) setUser(data.user);
      return true;
    } catch (e) {
      console.error("Failed to load data from string", e);
      return false;
    }
  }, [setHabits, setTodos, setTaskFolders, setHabitFolders, setUser]);


  const habitContextValue: HabitContextType = useMemo(() => ({ 
      habits, addHabit, editHabit, toggleHabitCompletion, deleteHabit, reorderHabits, getHabitById,
      todos, addTodo, editTodo, toggleTodoCompletion, deleteTodo, reorderTodos,
      taskFolders, addTaskFolder, editTaskFolder, deleteTaskFolder, getTaskFolderById,
      habitFolders, addHabitFolder, editHabitFolder, deleteHabitFolder, getHabitFolderById,
      user, setUser,
      theme, setTheme, importHabits, notificationPermission, requestNotificationPermission, triggerConfetti,
      openAddFolderModal: (type) => setAddFolderModalOpen(type),
      setIsModalOpen,
      resetData,
      getAllDataAsString,
      loadDataFromString,
      getLocalDateString,
      calculateStreaks,
    }), [
      habits, addHabit, editHabit, toggleHabitCompletion, deleteHabit, reorderHabits, getHabitById, 
      todos, addTodo, editTodo, toggleTodoCompletion, deleteTodo, reorderTodos, 
      taskFolders, addTaskFolder, editTaskFolder, deleteTaskFolder, getTaskFolderById, 
      habitFolders, addHabitFolder, editHabitFolder, deleteHabitFolder, getHabitFolderById, 
      user, setUser,
      theme, setTheme, importHabits, notificationPermission, requestNotificationPermission, triggerConfetti,
      setIsModalOpen, resetData, getAllDataAsString, loadDataFromString, getLocalDateString, calculateStreaks
    ]);

  const renderView = () => {
    switch (activeView) {
      case 'organize':
        return <OrganizeView />;
      case 'stats':
        return <StatsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'settings':
        return <SettingsView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };
  
  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    // The useEffect listening for `user` will now trigger the greeting timer.
  };

  return (
    <HabitContext.Provider value={habitContextValue}>
      {!isInitialized ? (
        <WelcomeView onOnboardingComplete={handleOnboardingComplete} />
      ) : (
        <div className="min-h-screen max-w-md mx-auto flex flex-col font-sans bg-transparent text-gray-800 dark:bg-transparent dark:text-gray-200 relative">
          <main className="flex-grow p-4 pb-28">
            {renderView()}
          </main>
          
          {(activeView === 'home' || activeView === 'organize') && !areModalsOpen && (
            <div className="fixed bottom-24 right-5 z-20 flex flex-col items-end">
              {isFabOpen && (
                <div className="flex flex-col items-end gap-4 mb-4" role="menu" aria-orientation="vertical">
                  <div className="flex items-center gap-3" role="menuitem">
                    <span className="bg-white/90 dark:bg-gray-700/90 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">Add Task</span>
                    <button
                      onClick={() => { setAddTodoModalOpen(true); setFabOpen(false); }}
                      className="bg-[#7C3AED] text-white p-3 rounded-full shadow-lg hover:bg-[#6D28D9] transition-transform transform hover:scale-110 active:scale-95"
                      aria-label="Add new task"
                    >
                      <ClipboardDocumentCheckIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3" role="menuitem">
                    <span className="bg-white/90 dark:bg-gray-700/90 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">Add Habit</span>
                    <button
                      onClick={() => { setAddHabitModalOpen(true); setFabOpen(false); }}
                      className="bg-[#7C3AED] text-white p-3 rounded-full shadow-lg hover:bg-[#6D28D9] transition-transform transform hover:scale-110 active:scale-95"
                      aria-label="Add new habit"
                    >
                      <CheckBadgeIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setFabOpen(prev => !prev)}
                className="bg-[#7C3AED] text-white p-4 rounded-full shadow-lg shadow-[#DDD6FE] dark:shadow-[#4C1D95]/50 hover:bg-[#6D28D9] transition-transform transform hover:scale-110 active:scale-95"
                aria-haspopup="true"
                aria-expanded={isFabOpen}
                aria-label="Open add menu"
              >
                <div className={`transition-transform duration-300 ${isFabOpen ? 'rotate-45' : ''}`}>
                  <PlusIcon className="w-8 h-8" />
                </div>
              </button>
            </div>
          )}

          {!areModalsOpen && <BottomNav activeView={activeView} setActiveView={setActiveView} />}

          {isAddHabitModalOpen && <AddHabitModal onClose={() => setAddHabitModalOpen(false)} />}
          {isAddTodoModalOpen && <AddTodoModal onClose={() => setAddTodoModalOpen(false)} />}
          {isAddFolderModalOpen && <AddFolderModal type={isAddFolderModalOpen} onClose={() => setAddFolderModalOpen(false)} />}
        </div>
      )}
    </HabitContext.Provider>
  );
};

export default App;