import React, { useContext, useCallback, useState, useEffect } from 'react';
import { BellIcon, MoonIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon, ChevronRightIcon, InformationCircleIcon, ExclamationTriangleIcon, UserCircleIcon, GoogleIcon, LinkIcon, CloudArrowUpIcon, CloudArrowDownIcon, ArrowPathIcon } from './icons';
import { HabitContext } from '../App';
import { HabitContextType } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ProfileModal from './ProfileModal';
import * as GoogleDriveService from '../services/googleDriveService';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsView: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    habits,
    importHabits,
    notificationPermission, 
    requestNotificationPermission,
    resetData,
    user,
    getAllDataAsString,
    loadDataFromString,
  } = useContext(HabitContext) as HabitContextType;

  const [isConfirmResetOpen, setConfirmResetOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  
  const [googleUser, setGoogleUser] = useState<GoogleDriveService.UserProfile | null>(null);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastBackupInfo, setLastBackupInfo] = useState<GoogleDriveService.BackupFile | null>(null);

  const [backupSchedule, setBackupSchedule] = useLocalStorage<'disabled' | 'daily' | 'weekly'>('backupSchedule', 'disabled');
  const [lastAutoBackup, setLastAutoBackup] = useLocalStorage<string | null>('lastAutoBackup', null);


  const checkSignedInUser = useCallback(async () => {
    try {
      const user = await GoogleDriveService.getSignedInUser();
      setGoogleUser(user);
      if (user) {
        const backup = await GoogleDriveService.getLatestBackup();
        setLastBackupInfo(backup?.metadata ?? null);
      }
    } catch (error) {
      console.error("Error checking signed in user:", error);
    }
  }, []);

  useEffect(() => {
    checkSignedInUser();
  }, [checkSignedInUser]);

  useEffect(() => {
    if (googleUser && backupSchedule !== 'disabled') {
        const now = Date.now();
        const lastBackupTime = lastAutoBackup ? new Date(lastAutoBackup).getTime() : 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        
        let shouldBackup = false;
        if (backupSchedule === 'daily' && now - lastBackupTime > oneDay) {
            shouldBackup = true;
        } else if (backupSchedule === 'weekly' && now - lastBackupTime > oneWeek) {
            shouldBackup = true;
        }

        if (shouldBackup) {
            handleBackupData(true); // silent backup
        }
    }
  }, [googleUser, backupSchedule, lastAutoBackup]);


  const handleGoogleSignIn = async () => {
    try {
      const user = await GoogleDriveService.signIn();
      setGoogleUser(user);
      const backup = await GoogleDriveService.getLatestBackup();
      setLastBackupInfo(backup?.metadata ?? null);
    } catch (error) {
      alert(`Could not sign in: ${error}`);
    }
  };

  const handleGoogleSignOut = async () => {
    await GoogleDriveService.signOut();
    setGoogleUser(null);
    setLastBackupInfo(null);
  };
  
  const handleBackupData = async (isAuto = false) => {
    setBackupStatus('loading');
    try {
        const data = getAllDataAsString();
        const file = await GoogleDriveService.uploadBackup(data);
        setLastBackupInfo(file);
        if (isAuto) {
          setLastAutoBackup(new Date().toISOString());
        }
        setBackupStatus('success');
        setTimeout(() => setBackupStatus('idle'), 2000);
    } catch (error) {
        setBackupStatus('error');
        if (!isAuto) alert(`Backup failed: ${error}`);
        setTimeout(() => setBackupStatus('idle'), 2000);
    }
  };

  const handleRestoreData = async () => {
    if (!window.confirm("Restoring from a backup will overwrite all current data. Are you sure you want to continue?")) {
        return;
    }
    setRestoreStatus('loading');
    try {
        const backup = await GoogleDriveService.getLatestBackup();
        if (backup) {
            const success = loadDataFromString(backup.content);
            if (success) {
                setRestoreStatus('success');
                alert("Data restored successfully! The app will now reload.");
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error("Invalid backup file format.");
            }
        } else {
            throw new Error("No backup found in your Google Drive.");
        }
    } catch (error) {
        setRestoreStatus('error');
        alert(`Restore failed: ${error}`);
        setTimeout(() => setRestoreStatus('idle'), 2000);
    }
  };


  const handleToggleDarkMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleExportData = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(habits, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "habitta-data.json";
    link.click();
  }, [habits]);

  const handleImportData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    if (typeof content === 'string') {
                        const importedData = JSON.parse(content);
                        if(window.confirm('Are you sure you want to import this data? This will overwrite your current habits.')) {
                            importHabits(importedData);
                        }
                    }
                } catch (error) {
                    alert('Error reading or parsing the file.');
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
  }, [importHabits]);

  const handleConfirmReset = () => {
    resetData();
    setConfirmResetOpen(false);
    // Give state a moment to clear before reload
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <>
    {isConfirmResetOpen && (
        <ConfirmDeleteModal 
            onCancel={() => setConfirmResetOpen(false)}
            onConfirm={handleConfirmReset}
            title="Reset All App Data?"
            message="This will permanently delete all of your habits, tasks, folders, and profile data. This action cannot be undone."
        />
    )}
    {isProfileModalOpen && <ProfileModal onClose={() => setProfileModalOpen(false)} />}
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="h-16 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </header>
      
      {user && (
        <div>
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Account</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="w-10 h-10 text-[#7C3AED]" />
                  <div>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <button onClick={() => setProfileModalOpen(true)} className="font-semibold text-sm text-[#7C3AED] dark:text-[#A78BFA] py-1 px-3 rounded-md hover:bg-[#7C3AED]/10 dark:hover:bg-[#7C3AED]/20">
                  Edit
                </button>
              </div>
            </div>
        </div>
      )}

      <div>
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">App Preference</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <BellIcon className="w-6 h-6 text-[#7C3AED]" />
              <span className="font-semibold">Notifications</span>
            </div>
            <button onClick={requestNotificationPermission} className={`w-12 h-7 rounded-full transition-colors ${notificationPermission === 'granted' ? 'bg-[#7C3AED]' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notificationPermission === 'granted' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <MoonIcon className="w-6 h-6 text-[#7C3AED]" />
              <span className="font-semibold">Dark Mode</span>
            </div>
             <button onClick={handleToggleDarkMode} className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-[#7C3AED]' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Data Management</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
            {/* --- Backup Section --- */}
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Backup & Sync</h3>
                {!googleUser ? (
                    <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <GoogleIcon className="w-5 h-5" />
                        Connect Google Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                           <div className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">Connected as</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{googleUser.email}</p>
                                </div>
                           </div>
                           <button onClick={handleGoogleSignOut} className="text-xs font-semibold text-gray-500 hover:text-red-500 dark:hover:text-red-400">Disconnect</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleBackupData(false)} disabled={backupStatus === 'loading'} className="flex items-center justify-center gap-2 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 text-[#6D28D9] dark:text-[#A78BFA] font-semibold py-2 px-4 rounded-lg hover:bg-[#7C3AED]/20 dark:hover:bg-[#7C3AED]/30 transition-colors disabled:opacity-50">
                                {backupStatus === 'loading' ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <CloudArrowUpIcon className="w-5 h-5" />}
                                <span>{backupStatus === 'success' ? 'Backed Up!' : 'Backup Now'}</span>
                            </button>
                             <button onClick={handleRestoreData} disabled={restoreStatus === 'loading' || !lastBackupInfo} className="flex items-center justify-center gap-2 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 text-[#6D28D9] dark:text-[#A78BFA] font-semibold py-2 px-4 rounded-lg hover:bg-[#7C3AED]/20 dark:hover:bg-[#7C3AED]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {restoreStatus === 'loading' ? <ArrowPathIcon className="w-5 h-5 animate-spin"/> : <CloudArrowDownIcon className="w-5 h-5" />}
                                <span>{restoreStatus === 'success' ? 'Restored!' : 'Restore'}</span>
                            </button>
                        </div>
                        {lastBackupInfo && <p className="text-xs text-center text-gray-500 dark:text-gray-400">Last backup: {new Date(lastBackupInfo.modifiedTime).toLocaleString()}</p>}

                         <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                             <label htmlFor="backup-schedule" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Auto-backup schedule</label>
                             <select id="backup-schedule" value={backupSchedule} onChange={(e) => setBackupSchedule(e.target.value as any)} className="bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-md text-sm focus:ring-[#7C3AED] focus:border-[#7C3AED]">
                                 <option value="disabled">Disabled</option>
                                 <option value="daily">Daily</option>
                                 <option value="weekly">Weekly</option>
                             </select>
                         </div>
                    </div>
                )}
            </div>

            {/* --- Local Data Section --- */}
            <button onClick={handleImportData} className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                <ArrowDownOnSquareIcon className="w-6 h-6 text-[#7C3AED]" />
                <div>
                    <span className="font-semibold">Import from File</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Overwrite data from a local JSON file.</p>
                </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={handleExportData} className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                <ArrowUpOnSquareIcon className="w-6 h-6 text-[#7C3AED]" />
                <div>
                    <span className="font-semibold">Export to File</span>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Save a local JSON file of your data.</p>
                </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => setConfirmResetOpen(true)} className="flex items-center justify-between p-4 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                 <div>
                    <span className="font-semibold text-red-500">Reset App Data</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete all local data.</p>
                </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-red-500" />
            </button>
        </div>
      </div>

       <div>
        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">App Info</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 text-sm">
                <InformationCircleIcon className="w-6 h-6 text-[#7C3AED] flex-shrink-0"/>
                <div>
                    <p><span className="font-semibold">App name:</span> Habitta</p>
                    <p><span className="font-semibold">Developed by:</span> AV Interactive</p>
                    <p><span className="font-semibold">App version:</span> v1.0.0</p>
                    <p><span className="font-semibold">Last updated on:</span> 2024-11-09</p>
                </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SettingsView;