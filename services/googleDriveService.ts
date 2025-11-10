// This is a mock implementation. In a real app, this would use the Google Drive API.
// For this exercise, we will simulate the API calls using browser features.

export interface UserProfile {
  email: string;
  name: string;
}

export interface BackupFile {
  id: string;
  name: string;
  modifiedTime: string;
}

const FILE_NAME = 'habitta-backup.json';

// --- Simulated state ---
let isSignedIn = false;
let userProfile: UserProfile | null = null;
let mockFileContent: string | null = null;
let mockFileMetadata: BackupFile | null = null;


// --- Mock API Functions ---

export const signIn = async (): Promise<UserProfile> => {
  // Simulate Google Sign-In popup
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (window.confirm("This is a simulation. Do you want to grant Habitta access to your Google Account to manage app data backups?")) {
        isSignedIn = true;
        userProfile = {
          email: 'user@example.com',
          name: 'Demo User'
        };
        // Simulate finding a backup on sign in
        mockFileContent = localStorage.getItem('google_drive_backup_mock');
        if (mockFileContent) {
            mockFileMetadata = {
                id: 'mock-file-id',
                name: FILE_NAME,
                modifiedTime: new Date().toISOString(),
            }
        }
        resolve(userProfile);
      } else {
        reject(new Error('Sign-in cancelled by user.'));
      }
    }, 500);
  });
};

export const signOut = async (): Promise<void> => {
  isSignedIn = false;
  userProfile = null;
};

export const getSignedInUser = async (): Promise<UserProfile | null> => {
  // To simulate persistence, we can check a flag in local storage
  if (localStorage.getItem('google_drive_signed_in_mock')) {
      isSignedIn = true;
      userProfile = { email: 'user@example.com', name: 'Demo User' };
  } else {
      isSignedIn = false;
      userProfile = null;
  }
  return isSignedIn ? userProfile : null;
};

export const uploadBackup = async (data: string): Promise<BackupFile> => {
  if (!isSignedIn) throw new Error('Not signed in');
  // Simulate upload
  return new Promise(resolve => {
      setTimeout(() => {
          mockFileContent = data;
          localStorage.setItem('google_drive_backup_mock', data); // Use local storage for mock persistence
          const fileMeta = {
              id: 'mock-file-id',
              name: FILE_NAME,
              modifiedTime: new Date().toISOString()
          };
          mockFileMetadata = fileMeta;
          resolve(fileMeta);
      }, 1000)
  });
};

export const getLatestBackup = async (): Promise<{ metadata: BackupFile; content: string } | null> => {
  if (!isSignedIn) throw new Error('Not signed in');
  // Simulate file search and download
  return new Promise(resolve => {
      setTimeout(() => {
          const storedContent = localStorage.getItem('google_drive_backup_mock');
          if (storedContent) {
              mockFileContent = storedContent;
              mockFileMetadata = {
                  id: 'mock-file-id',
                  name: FILE_NAME,
                  modifiedTime: new Date(localStorage.getItem('google_drive_backup_timestamp_mock') || Date.now()).toISOString(),
              };
               resolve({
                  metadata: mockFileMetadata,
                  content: mockFileContent
              });
          } else {
              resolve(null);
          }
      }, 1000);
  });
};