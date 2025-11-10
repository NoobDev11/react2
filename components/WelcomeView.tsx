import React, { useContext } from 'react';
import { HabitContext } from '../App';
import { HabitContextType, User } from '../types';
import ProfileForm from './ProfileForm';

interface WelcomeViewProps {
  onOnboardingComplete?: (newUser: User) => void;
}

const GreetingScreen: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F2ECFD] dark:bg-gray-900 text-center animate-fade-in">
        <div className="animate-pop-in">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">Hi, {user.name}!</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Welcome back to Habitta.</p>
        </div>
    </div>
  );
};

const OnboardingScreen: React.FC<{ onComplete: (newUser: User) => void }> = ({ onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F2ECFD] dark:bg-gray-900 p-4 animate-fade-in">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Welcome to Habitta</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">Let's set up your profile to get started.</p>
            </div>
            <div className="w-full max-w-md mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <ProfileForm onSubmit={onComplete} buttonText="Get Started" />
            </div>
        </div>
    );
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onOnboardingComplete }) => {
  const { user } = useContext(HabitContext) as HabitContextType;

  if (user) {
    return <GreetingScreen user={user} />;
  }

  if (onOnboardingComplete) {
    return <OnboardingScreen onComplete={onOnboardingComplete} />;
  }
  
  return null; // Should not happen in normal flow
};

export default WelcomeView;