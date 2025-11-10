import React, { useContext } from 'react';
import { Todo, COLOR_MAP } from '../types';
import { HabitContext } from '../App';
import { HabitContextType } from '../types';
import { FolderIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
  isReadOnly?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, isReadOnly = false }) => {
  const { toggleTodoCompletion, getTaskFolderById } = useContext(HabitContext) as HabitContextType;
  const folder = todo.folderId ? getTaskFolderById(todo.folderId) : null;
  const folderColors = folder ? (COLOR_MAP[folder.color] ?? COLOR_MAP['gray']) : null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#7C3AED]/10 dark:hover:bg-gray-700/50 transition-colors group animate-fade-in-up">
      <button
        onClick={() => !isReadOnly && toggleTodoCompletion(todo.id)}
        aria-label={`Mark as ${todo.completed ? 'incomplete' : 'complete'}`}
        className={`flex-shrink-0 ${isReadOnly ? 'cursor-default' : ''}`}
        disabled={isReadOnly}
      >
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${todo.completed ? 'bg-[#7C3AED] border-[#7C3AED]' : 'border-gray-300 dark:border-gray-500'}`}>
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>
      <div className="flex-grow">
        <p className={`text-gray-800 dark:text-gray-200 transition-colors ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
            {todo.text}
        </p>
        {folder && folderColors && (
            <div className="flex items-center gap-1.5 mt-1">
                <FolderIcon className={`w-3 h-3 ${folderColors.text}`} />
                <span className={`text-xs ${folderColors.text} font-medium`}>{folder.name}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;