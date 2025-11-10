import React, { useState, useContext } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, ALL_COLORS, Folder, COLOR_MAP } from '../types';

interface AddFolderModalProps {
  onClose: () => void;
  type: 'task' | 'habit';
  folderToEdit?: Folder;
  onFolderCreated?: (folder: Folder) => void;
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({ onClose, type, folderToEdit, onFolderCreated }) => {
  const { addTaskFolder, editTaskFolder, addHabitFolder, editHabitFolder } = useContext(HabitContext) as HabitContextType;

  const [name, setName] = useState(folderToEdit?.name || '');
  const [description, setDescription] = useState(folderToEdit?.description || '');
  const [selectedColor, setSelectedColor] = useState(folderToEdit?.color || 'deep-violet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const folderData = {
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
    };

    let savedFolder: Folder;

    if (folderToEdit) {
        savedFolder = type === 'task' 
            ? editTaskFolder({ ...folderToEdit, ...folderData })
            : editHabitFolder({ ...folderToEdit, ...folderData });
    } else {
        savedFolder = type === 'task'
            ? addTaskFolder(folderData)
            : addHabitFolder(folderData);
    }
    
    if (onFolderCreated) onFolderCreated(savedFolder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-[#F2ECFD] dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-lg m-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className="p-4 border-b border-[#DDD6FE] dark:border-gray-800">
            <h2 className="text-lg font-bold text-center">{folderToEdit ? 'Edit' : 'Add New'} {type === 'task' ? 'Task' : 'Habit'} Folder</h2>
          </header>
          
          <div className="p-6 space-y-6">
            <div>
                <label htmlFor="folderName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Folder Name</label>
                <input
                  id="folderName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  className="w-full bg-transparent border-0 border-b-2 border-[#DDD6FE] dark:border-gray-700 focus:ring-0 focus:border-[#7C3AED] dark:focus:border-[#A78BFA] text-lg font-semibold"
                  required
                  autoFocus
                />
            </div>
            <div>
                <label htmlFor="folderDesc" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Description (Optional)</label>
                <input
                  id="folderDesc"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Max 20 characters"
                  maxLength={20}
                  className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md focus:ring-[#7C3AED] focus:border-[#7C3AED] mt-1"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {ALL_COLORS.map(color => (
                    <button type="button" key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full ${COLOR_MAP[color].mediumBg} transition-all mx-auto ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#7C3AED] dark:ring-offset-gray-900' : ''}`} aria-label={`Select ${color} color`} />
                  ))}
                </div>
            </div>
          </div>
          
          <footer className="p-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-full hover:bg-[#6D28D9] transition-colors disabled:bg-[#A78BFA] dark:disabled:bg-[#5B21B6] disabled:cursor-not-allowed"
            >
              {folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddFolderModal;