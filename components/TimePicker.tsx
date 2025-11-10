import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface TimePickerProps {
  onClose: () => void;
  onSetTime: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onClose, onSetTime }) => {
  const now = new Date();
  const initialHour = now.getHours();
  
  const [hour, setHour] = useState(initialHour % 12 === 0 ? 12 : initialHour % 12);
  const [minute, setMinute] = useState(now.getMinutes());
  const [period, setPeriod] = useState(initialHour >= 12 ? 'PM' : 'AM');
  
  const incrementHour = () => setHour(h => h === 12 ? 1 : h + 1);
  const decrementHour = () => setHour(h => h === 1 ? 12 : h - 1);
  const incrementMinute = () => setMinute(m => m === 59 ? 0 : m + 1);
  const decrementMinute = () => setMinute(m => m === 0 ? 59 : m - 1);

  const handleSet = () => {
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }
    const formattedTime = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onSetTime(formattedTime);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full max-w-xs rounded-2xl shadow-lg p-6 m-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Select Time</h2>
        
        <div className="flex items-center justify-center gap-2 text-4xl font-mono">
            {/* Hour Picker */}
            <div className="flex flex-col items-center">
                <button onClick={incrementHour} className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronUpIcon className="w-7 h-7"/></button>
                <span className="w-20 text-center py-2 text-gray-800 dark:text-gray-200">{hour.toString().padStart(2, '0')}</span>
                <button onClick={decrementHour} className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronDownIcon className="w-7 h-7"/></button>
            </div>
            <span className="text-gray-400">:</span>
            {/* Minute Picker */}
            <div className="flex flex-col items-center">
                <button onClick={incrementMinute} className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronUpIcon className="w-7 h-7"/></button>
                <span className="w-20 text-center py-2 text-gray-800 dark:text-gray-200">{minute.toString().padStart(2, '0')}</span>
                <button onClick={decrementMinute} className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><ChevronDownIcon className="w-7 h-7"/></button>
            </div>
            
            {/* Period Toggler */}
            <div className="flex flex-col gap-2">
                <button onClick={() => setPeriod('AM')} className={`px-3 py-1 rounded-md text-base font-semibold transition-colors ${period === 'AM' ? 'bg-[#7C3AED] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>AM</button>
                <button onClick={() => setPeriod('PM')} className={`px-3 py-1 rounded-md text-base font-semibold transition-colors ${period === 'PM' ? 'bg-[#7C3AED] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>PM</button>
            </div>
        </div>

        <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleSet} className="w-full bg-[#7C3AED] text-white font-bold py-3 px-6 rounded-full hover:bg-[#6D28D9] transition-colors">
                Set Time
            </button>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;