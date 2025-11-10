import React, { useState, useContext } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, Todo, Folder } from '../types';
import AddFolderModal from './Modal';
import { PlusIcon } from './icons';

interface AddTodoModalProps {
  onClose: () => void;
  todoToEdit?: Todo;
  preselectedFolderId?: string | null;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ onClose, todoToEdit, preselectedFolderId }) => {
  const { addTodo, editTodo, taskFolders } = useContext(HabitContext) as HabitContextType;
  const isEditing = !!todoToEdit;

  const [text, setText] = useState(todoToEdit?.text || '');
  const [folderId, setFolderId] = useState<string | null>(todoToEdit?.folderId || preselectedFolderId || null);
  const [isAddingFolder, setAddingFolder] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      if (isEditing) {
        editTodo({
            ...todoToEdit,
            text: text.trim(),
            folderId: folderId,
        });
      } else {
        addTodo({
          text: text.trim(),
          folderId: folderId,
        });
      }
      onClose();
    }
  };
  
  const handleFolderCreated = (newFolder: Folder) => {
    setFolderId(newFolder.id);
    setAddingFolder(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-[#F2ECFD] dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-lg m-4" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <header className="p-4 border-b border-[#DDD6FE] dark:border-gray-800">
              <h2 className="text-lg font-bold text-center">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
            </header>
            
            <div className="p-6 space-y-6">
              <div>
                  <label htmlFor="taskName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Task</label>
                  <input
                    id="taskName"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Buy groceries"
                    className="w-full bg-transparent border-0 border-b-2 border-[#DDD6FE] dark:border-gray-700 focus:ring-0 focus:border-[#7C3AED] dark:focus:border-[#A78BFA] text-lg font-semibold"
                    required
                    autoFocus
                  />
              </div>
              <div>
                  <label htmlFor="taskFolder" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Folder</label>
                  <div className="flex items-center gap-2 mt-1">
                      <select 
                          id="taskFolder"
                          value={folderId ?? ''} 
                          onChange={(e) => setFolderId(e.target.value || null)}
                          className="w-full bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                      >
                          <option value="">Uncategorized</option>
                          {taskFolders.map(folder => (
                              <option key={folder.id} value={folder.id}>{folder.name}</option>
                          ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={() => setAddingFolder(true)} 
                        className="flex-shrink-0 bg-[#7C3AED]/20 dark:bg-[#7C3AED]/30 text-[#5B21B6] dark:text-[#A78BFA] font-semibold p-2.5 rounded-md hover:bg-[#7C3AED]/30 dark:hover:bg-[#7C3AED]/40"
                        aria-label="Create new folder"
                      >
                        <PlusIcon className="w-5 h-5"/>
                      </button>
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
                disabled={!text.trim()}
                className="w-full bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-full hover:bg-[#6D28D9] transition-colors disabled:bg-[#A78BFA] dark:disabled:bg-[#5B21B6] disabled:cursor-not-allowed"
              >
                {isEditing ? 'Save Changes' : 'Add Task'}
              </button>
            </footer>
          </form>
        </div>
      </div>
      {isAddingFolder && <AddFolderModal type="task" onClose={() => setAddingFolder(false)} onFolderCreated={handleFolderCreated} />}
    </>
  );
};

export default AddTodoModal;