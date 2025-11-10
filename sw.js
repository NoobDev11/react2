const CACHE_NAME = 'habitta-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useLocalStorage.ts',
  '/components/icons.tsx',
  '/components/BottomNav.tsx',
  '/components/Dashboard.tsx',
  '/components/HabitCard.tsx',
  '/components/TodoItem.tsx',
  '/components/Modal.tsx',
  '/components/AddItemModal.tsx',
  '/components/AddHabitModal.tsx',
  '/components/HomeView.tsx',
  '/components/StatsView.tsx',
  '/components/AchievementsView.tsx',
  '/components/SettingsView.tsx',
  '/components/HabitHistoryModal.tsx',
  '/components/TimePicker.tsx',
  '/components/ConfirmDeleteModal.tsx',
  '/components/WelcomeView.tsx',
  '/components/ProfileModal.tsx',
  '/components/ProfileForm.tsx',
  '/services/googleDriveService.ts',
  '/vite.svg',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/@google/genai@^1.28.0',
  'https://aistudiocdn.com/@iconify/react@^5.0.1'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
