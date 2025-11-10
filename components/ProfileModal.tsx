import React, { useContext } from 'react';
import { HabitContext } from '../App';
import { HabitContextType } from '../types';
import ProfileForm from './ProfileForm';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, setUser } = useContext(HabitContext) as HabitContextType;

  const handleSaveChanges = (updatedUser: any) => {
    setUser(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-[#F2ECFD] dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-lg m-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <header className="p-4 border-b border-[#DDD6FE] dark:border-gray-800">
            <h2 className="text-lg font-bold text-center">Edit Profile</h2>
          </header>
          
          <div className="p-6">
            <ProfileForm
              onSubmit={handleSaveChanges}
              initialData={user}
              buttonText="Save Changes"
            />
          </div>
          
          <footer className="p-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </footer>
      </div>
    </div>
  );
};

export default ProfileModal;
