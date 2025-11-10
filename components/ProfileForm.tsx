import React, { useState } from 'react';
import { User } from '../types';

interface ProfileFormProps {
  onSubmit: (user: User) => void;
  initialData?: User | null;
  buttonText: string;
}

const FormField: React.FC<{ id: string, label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, required?: boolean }> = 
({ id, label, type, value, onChange, placeholder, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent mt-1 transition-colors"
        />
    </div>
);


const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData, buttonText }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [username, setUsername] = useState(initialData?.username || '');

    const isFormValid = name.trim() && username.trim();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        onSubmit({ 
            name: name.trim(), 
            username: username.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField id="name" label="Your Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" required />
            <FormField id="username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., janedoe" required />
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-full hover:bg-[#6D28D9] transition-colors disabled:bg-[#A78BFA] dark:disabled:bg-[#5B21B6] disabled:cursor-not-allowed"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;