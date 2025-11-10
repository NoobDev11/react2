export type View = 'home' | 'organize' | 'stats' | 'achievements' | 'settings';

export type HabitMarker =
  'check-circle' | 'arrow-up-circle' | 'arrow-down-circle' | 'build-circle' | 'pause-circle' |
  'play-circle' | 'swap-horizontal-circle' | 'close-circle' | 'star-circle' | 'stars' |
  'diamond' | 'gift' | 'at' | 'book-multiple' | 'anchor' | 'assistant-navigation' |
  'auto-awesome' | 'cancel';

export const ALL_MARKERS: HabitMarker[] = [
    'check-circle', 'arrow-up-circle', 'arrow-down-circle', 'build-circle', 'pause-circle',
    'play-circle', 'swap-horizontal-circle', 'close-circle', 'star-circle', 'stars',
    'diamond', 'gift', 'at', 'book-multiple', 'anchor', 'assistant-navigation',
    'auto-awesome', 'cancel'
];

export const ALL_COLORS = [
    'bright-orange', 'vibrant-red', 'golden-yellow', 'sunset-orange', 'golden-amber', 'crimson-red',
    'emerald-green', 'lush-green', 'bright-lime', 'aqua-teal', 'cyan-blue', 'sky-blue',
    'deep-violet', 'electric-purple', 'royal-blue', 'bright-blue', 'magenta-fuchsia', 'deep-pink'
];

export const COLOR_MAP: { [key: string]: {
    bg: string;
    lightBg: string;
    text: string;
    border: string;
    mediumBg: string;
} } = {
    'bright-orange': { bg: 'bg-[#F97316]', lightBg: 'bg-[#F97316]/20 dark:bg-[#F97316]/30', text: 'text-[#F97316]', border: 'border-[#F97316]', mediumBg: 'bg-[#F97316]' },
    'vibrant-red': { bg: 'bg-[#EF4444]', lightBg: 'bg-[#EF4444]/20 dark:bg-[#EF4444]/30', text: 'text-[#EF4444]', border: 'border-[#EF4444]', mediumBg: 'bg-[#EF4444]' },
    'golden-yellow': { bg: 'bg-[#FACC15]', lightBg: 'bg-[#FACC15]/20 dark:bg-[#FACC15]/30', text: 'text-[#FACC15]', border: 'border-[#FACC15]', mediumBg: 'bg-[#FACC15]' },
    'sunset-orange': { bg: 'bg-[#FB923C]', lightBg: 'bg-[#FB923C]/20 dark:bg-[#FB923C]/30', text: 'text-[#FB923C]', border: 'border-[#FB923C]', mediumBg: 'bg-[#FB923C]' },
    'golden-amber': { bg: 'bg-[#EAB308]', lightBg: 'bg-[#EAB308]/20 dark:bg-[#EAB308]/30', text: 'text-[#EAB308]', border: 'border-[#EAB308]', mediumBg: 'bg-[#EAB308]' },
    'crimson-red': { bg: 'bg-[#DC2626]', lightBg: 'bg-[#DC2626]/20 dark:bg-[#DC2626]/30', text: 'text-[#DC2626]', border: 'border-[#DC2626]', mediumBg: 'bg-[#DC2626]' },
    'emerald-green': { bg: 'bg-[#10B981]', lightBg: 'bg-[#10B981]/20 dark:bg-[#10B981]/30', text: 'text-[#10B981]', border: 'border-[#10B981]', mediumBg: 'bg-[#10B981]' },
    'lush-green': { bg: 'bg-[#22C55E]', lightBg: 'bg-[#22C55E]/20 dark:bg-[#22C55E]/30', text: 'text-[#22C55E]', border: 'border-[#22C55E]', mediumBg: 'bg-[#22C55E]' },
    'bright-lime': { bg: 'bg-[#84CC16]', lightBg: 'bg-[#84CC16]/20 dark:bg-[#84CC16]/30', text: 'text-[#84CC16]', border: 'border-[#84CC16]', mediumBg: 'bg-[#84CC16]' },
    'aqua-teal': { bg: 'bg-[#14B8A6]', lightBg: 'bg-[#14B8A6]/20 dark:bg-[#14B8A6]/30', text: 'text-[#14B8A6]', border: 'border-[#14B8A6]', mediumBg: 'bg-[#14B8A6]' },
    'cyan-blue': { bg: 'bg-[#06B6D4]', lightBg: 'bg-[#06B6D4]/20 dark:bg-[#06B6D4]/30', text: 'text-[#06B6D4]', border: 'border-[#06B6D4]', mediumBg: 'bg-[#06B6D4]' },
    'sky-blue': { bg: 'bg-[#0EA5E9]', lightBg: 'bg-[#0EA5E9]/20 dark:bg-[#0EA5E9]/30', text: 'text-[#0EA5E9]', border: 'border-[#0EA5E9]', mediumBg: 'bg-[#0EA5E9]' },
    'deep-violet': { bg: 'bg-[#7C3AED]', lightBg: 'bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]', mediumBg: 'bg-[#7C3AED]' },
    'electric-purple': { bg: 'bg-[#9333EA]', lightBg: 'bg-[#9333EA]/20 dark:bg-[#9333EA]/30', text: 'text-[#9333EA]', border: 'border-[#9333EA]', mediumBg: 'bg-[#9333EA]' },
    'royal-blue': { bg: 'bg-[#2563EB]', lightBg: 'bg-[#2563EB]/20 dark:bg-[#2563EB]/30', text: 'text-[#2563EB]', border: 'border-[#2563EB]', mediumBg: 'bg-[#2563EB]' },
    'bright-blue': { bg: 'bg-[#3B82F6]', lightBg: 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/30', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]', mediumBg: 'bg-[#3B82F6]' },
    'magenta-fuchsia': { bg: 'bg-[#C026D3]', lightBg: 'bg-[#C026D3]/20 dark:bg-[#C026D3]/30', text: 'text-[#C026D3]', border: 'border-[#C026D3]', mediumBg: 'bg-[#C026D3]' },
    'deep-pink': { bg: 'bg-[#DB2777]', lightBg: 'bg-[#DB2777]/20 dark:bg-[#DB2777]/30', text: 'text-[#DB2777]', border: 'border-[#DB2777]', mediumBg: 'bg-[#DB2777]' },
    'gray': { bg: 'bg-gray-500', lightBg: 'bg-gray-100 dark:bg-gray-700/50', text: 'text-gray-500', border: 'border-gray-500', mediumBg: 'bg-gray-400' },
};

export const ALL_ICONS = [
    'run', 'spa', 'bolt', 'menu_book', 'fitness', 'music', 'drink', 'bed',
    'trophy', 'smile', 'water_drop', 'flame', 'book', 'lightbulb', 'grass',
    'rupee', 'walk', 'bookmark'
] as const;
export type HabitIcon = typeof ALL_ICONS[number];


export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: HabitIcon;
  color: string;
  reminders: string[];
  targetStreak: number | null;
  frequencyType: 'everyday' | 'specific_days';
  frequencyDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  marker: HabitMarker;
  completions: Record<string, boolean>; // date string 'YYYY-MM-DD' -> completed
  createdAt: string;
  folderId?: string | null;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  folderId: string | null;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface User {
  name: string;
  username: string;
}

export type Theme = 'light' | 'dark';

export interface HabitContextType {
  habits: Habit[];
  addHabit: (habitData: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => void;
  editHabit: (habitData: Habit) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  reorderHabits: (draggedId: string, targetId: string) => void;
  getHabitById: (habitId: string) => Habit | undefined;
  
  todos: Todo[];
  addTodo: (todoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
  editTodo: (todoData: Todo) => void;
  toggleTodoCompletion: (todoId: string) => void;
  deleteTodo: (todoId: string) => void;
  reorderTodos: (draggedId: string, targetId: string) => void;
  
  taskFolders: Folder[];
  addTaskFolder: (folderData: Omit<Folder, 'id'>) => Folder;
  editTaskFolder: (folderData: Folder) => Folder;
  deleteTaskFolder: (folderId: string) => void;
  getTaskFolderById: (folderId: string) => Folder | undefined;
  
  habitFolders: Folder[];
  addHabitFolder: (folderData: Omit<Folder, 'id'>) => Folder;
  editHabitFolder: (folderData: Folder) => Folder;
  deleteHabitFolder: (folderId: string) => void;
  getHabitFolderById: (folderId: string) => Folder | undefined;

  user: User | null;
  setUser: (user: User | null) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  importHabits: (newHabits: any[]) => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<void>;
  triggerConfetti: () => void;
  openAddFolderModal: (type: 'task' | 'habit') => void;
  setIsModalOpen: (isOpen: boolean) => void;
  resetData: () => void;
  
  getAllDataAsString: () => string;
  // Fix: Changed return type from void to boolean to match implementation.
  loadDataFromString: (data: string) => boolean;

  // Utility functions
  getLocalDateString: (date: Date) => string;
  calculateStreaks: (habit: Habit) => { currentStreak: number; bestStreak: number };
}