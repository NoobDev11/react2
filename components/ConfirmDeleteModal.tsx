import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel, title, message }) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-lg p-6 m-4 text-center animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100" id="modal-title">
          {title}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-full hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;