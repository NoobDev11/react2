import React, { useState, useContext, useEffect } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, Habit, HabitMarker, ALL_COLORS, ALL_MARKERS, COLOR_MAP, HabitIcon, ALL_ICONS } from '../types';
import { ClockIcon, XMarkIcon, PlusIcon } from './icons';
import { iconMap, markerIconMap, markerColorMap } from './icons';
import TimePicker from './TimePicker';

interface AddHabitModalProps {
  onClose: () => void;
  habitToEdit?: Habit;
  preselectedFolderId?: string | null;
}

const dayLabels = [{label: 'S', day: 0}, {label: 'M', day: 1}, {label: 'T', day: 2}, {label: 'W', day: 3}, {label: 'T', day: 4}, {label: 'F', day: 5}, {label: 'S', day: 6}];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ onClose, habitToEdit, preselectedFolderId }) => {
  const { addHabit, editHabit, habitFolders, triggerConfetti } = useContext(HabitContext) as HabitContextType;
  const isEditing = !!habitToEdit;
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);
  const [targetStreak, setTargetStreak] = useState('');
  const [frequencyType, setFrequencyType] = useState<'everyday' | 'specific_days'>('everyday');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<HabitIcon>(ALL_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState('deep-violet');
  const [selectedMarker, setSelectedMarker] = useState<HabitMarker>('check-circle');
  const [folderId, setFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (habitToEdit) {
        setName(habitToEdit.name);
        setDescription(habitToEdit.description || '');
        setReminders(habitToEdit.reminders);
        setTargetStreak(habitToEdit.targetStreak?.toString() || '');
        setFrequencyType(habitToEdit.frequencyType);
        setSelectedDays(habitToEdit.frequencyDays);
        setSelectedIcon(habitToEdit.icon);
        setSelectedColor(habitToEdit.color);
        setSelectedMarker(habitToEdit.marker);
        setFolderId(habitToEdit.folderId || null);
    } else if (preselectedFolderId) {
        setFolderId(preselectedFolderId);
    }
  }, [habitToEdit, preselectedFolderId]);


  const handleSetTime = (time: string) => {
    if (!reminders.includes(time)) {
        setReminders([...reminders, time].sort());
    }
    setTimePickerOpen(false);
  };

  const handleRemoveReminder = (timeToRemove: string) => {
      setReminders(reminders.filter(time => time !== timeToRemove));
  };

  const toggleDay = (dayIndex: number) => {
      setSelectedDays(prev => 
          prev.includes(dayIndex) 
          ? prev.filter(d => d !== dayIndex) 
          : [...prev, dayIndex]
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
        const habitData = {
            name: name.trim(),
            description: description.trim(),
            icon: selectedIcon,
            color: selectedColor,
            reminders: reminders,
            targetStreak: targetStreak ? parseInt(targetStreak, 10) : null,
            frequencyType: frequencyType,
            frequencyDays: frequencyType === 'specific_days' ? selectedDays : [],
            marker: selectedMarker,
            folderId: folderId || null
        };
        
        if (isEditing) {
            editHabit({ ...habitToEdit, ...habitData });
        } else {
            addHabit(habitData);
            triggerConfetti();
        }
      onClose();
    }
  };

  const isFormValid = name.trim() !== '' && (frequencyType === 'everyday' || selectedDays.length > 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-[#F2ECFD] dark:bg-gray-900 w-full max-w-md h-full flex flex-col animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <header className="flex items-center justify-between p-4 border-b border-[#DDD6FE] dark:border-gray-800 flex-shrink-0">
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold text-base py-1 px-2 rounded-md">Cancel</button>
            <h2 className="text-lg font-bold">{isEditing ? 'Edit Habit' : 'Add New Habit'}</h2>
            <div className="w-20"></div> {/* Placeholder to keep title centered */}
          </header>
          
          <div className="flex-grow p-4 overflow-y-auto">
            <form id="add-habit-form" onSubmit={handleSubmit} className="space-y-6">
                {/* --- Essentials --- */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
                    <div>
                        <label htmlFor="habitName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Habit Name</label>
                        <input
                        id="habitName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Drink water"
                        className="w-full bg-transparent border-0 border-b-2 border-[#DDD6FE] dark:border-gray-700 focus:ring-0 focus:border-[#7C3AED] dark:focus:border-[#A78BFA] text-lg font-semibold"
                        required autoFocus
                        />
                    </div>
                     <div>
                        <label htmlFor="habitDesc" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Description (Optional)</label>
                        <input
                        id="habitDesc"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Max 20 characters"
                        maxLength={20}
                        className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md focus:ring-[#7C3AED] focus:border-[#7C3AED] mt-1"
                        />
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Frequency</label>
                    <div className="flex gap-2 mb-3">
                        <button type="button" onClick={() => setFrequencyType('everyday')} className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${frequencyType === 'everyday' ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Everyday</button>
                        <button type="button" onClick={() => setFrequencyType('specific_days')} className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${frequencyType === 'specific_days' ? 'bg-[#7C3AED] text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Specific Days</button>
                    </div>
                    {frequencyType === 'specific_days' && (
                        <div className="grid grid-cols-7 gap-2 animate-fade-in">
                            {dayLabels.map(({ label, day }) => (<button type="button" key={day} onClick={() => toggleDay(day)} className={`font-bold text-sm aspect-square flex items-center justify-center rounded-full transition-all ${selectedDays.includes(day) ? 'bg-[#7C3AED] text-white scale-110' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{label}</button>))}
                        </div>
                    )}
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Icon</label>
                     <div className="grid grid-cols-6 gap-2">
                        {ALL_ICONS.map(icon => {
                            const IconComponent = iconMap[icon];
                            const isSelected = selectedIcon === icon;
                            return (
                                <button
                                type="button"
                                key={icon}
                                onClick={() => setSelectedIcon(icon)}
                                className={`p-2 rounded-full aspect-square flex items-center justify-center transition-all transform ${isSelected ? `scale-110 ${COLOR_MAP[selectedColor].bg}` : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
                                >
                                <IconComponent className="w-7 h-7 text-white" />
                                </button>
                            )
                        })}
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Color</label>
                    <div className="grid grid-cols-6 gap-3">
                      {ALL_COLORS.map(color => (<button type="button" key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 mx-auto rounded-full ${COLOR_MAP[color].mediumBg} transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#7C3AED] dark:ring-offset-gray-900' : ''}`} />))}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Completion Marker</label>
                    <div className="grid grid-cols-6 gap-2">
                      {ALL_MARKERS.map(marker => {
                          const MarkerIcon = markerIconMap[marker];
                          const isSelected = selectedMarker === marker;
                          const markerColorKey = markerColorMap[marker] || 'deep-violet';
                          const markerColor = COLOR_MAP[markerColorKey]?.text || 'text-gray-700';
                          return (
                            <button 
                              type="button" 
                              key={marker} 
                              onClick={() => setSelectedMarker(marker)} 
                              className={`text-2xl p-2 rounded-full aspect-square flex items-center justify-center transition-all ${isSelected ? 'bg-[#7C3AED]/30 dark:bg-[#7C3AED]/40 scale-110' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                              {MarkerIcon && <MarkerIcon className={`w-7 h-7 ${markerColor}`} />}
                            </button>
                          );
                      })}
                    </div>
                </div>

                {/* --- Customization (Optional) --- */}
                <div className="pt-4 border-t border-[#DDD6FE] dark:border-gray-800">
                    <h3 className="text-base font-semibold text-center text-gray-600 dark:text-gray-400 mb-4">Customize (Optional)</h3>
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <label htmlFor="habitFolder" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Folder</label>
                            <select id="habitFolder" value={folderId ?? ''} onChange={(e) => setFolderId(e.target.value || null)} className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md focus:ring-[#7C3AED] focus:border-[#7C3AED] mt-1">
                                <option value="">Uncategorized</option>
                                {habitFolders.map(folder => (<option key={folder.id} value={folder.id}>{folder.name}</option>))}
                            </select>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <label htmlFor="target" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Target Streak</label>
                            <input id="target" type="number" value={targetStreak} onChange={(e) => setTargetStreak(e.target.value)} placeholder="e.g. 30 days" className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md focus:ring-[#7C3AED] focus:border-[#7C3AED]"/>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Reminders</label>
                          <div className="flex flex-wrap gap-2 items-center">
                              {reminders.map(time => (<div key={time} className="flex items-center gap-2 bg-[#7C3AED]/20 text-[#5B21B6] dark:text-[#A78BFA] text-sm font-medium px-3 py-1.5 rounded-full"><ClockIcon className="w-4 h-4" /><span>{time}</span><button type="button" onClick={() => handleRemoveReminder(time)} className="text-[#7C3AED] hover:text-[#5B21B6] dark:hover:text-white transition-colors"><XMarkIcon className="w-4 h-4"/></button></div>))}
                              <button type="button" onClick={() => setTimePickerOpen(true)} className="flex items-center justify-center gap-1 text-sm font-semibold text-[#6D28D9] dark:text-[#A78BFA] border-2 border-dashed border-[#A78BFA] dark:border-[#6D28D9] rounded-full px-3 py-1.5 hover:bg-[#7C3AED]/20 dark:hover:bg-[#7C3AED]/30 transition-colors"><PlusIcon className="w-4 h-4" />Add</button>
                          </div>
                      </div>
                    </div>
                </div>
            </form>
          </div>
          
          <footer className="p-4 border-t border-[#DDD6FE] dark:border-gray-800 flex-shrink-0">
            <button type="submit" form="add-habit-form" disabled={!isFormValid} className="w-full bg-[#7C3AED] text-white font-bold py-3 px-6 rounded-full hover:bg-[#6D28D9] transition-colors disabled:bg-[#A78BFA] dark:disabled:bg-[#5B21B6] disabled:cursor-not-allowed">
              {isEditing ? 'Save Changes' : 'Add Habit'}
            </button>
          </footer>
        </div>
      </div>
      {isTimePickerOpen && <TimePicker onClose={() => setTimePickerOpen(false)} onSetTime={handleSetTime} />}
    </>
  );
};

export default AddHabitModal;