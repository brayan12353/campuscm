import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  Listing,
  FavoriteItem,
  AppNotification,
  Conversation,
} from '@/types';
import {
  mockUsers,
  mockListings,
  mockConversations,
  mockNotifications,
} from '@/data/mock';
import { generateId } from '@/utils/format';

interface AppContextValue {
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string, fullName: string) => void;
  favorites: FavoriteItem[];
  toggleFavorite: (targetType: FavoriteItem['targetType'], targetId: string) => void;
  isFavorite: (targetType: FavoriteItem['targetType'], targetId: string) => boolean;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  conversations: Conversation[];
  userListings: Listing[];
  addUserListing: (listing: Listing) => void;
  updateUserListing: (id: string, updates: Partial<Listing>) => void;
  removeUserListing: (id: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (done: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Douala');
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCity = localStorage.getItem('campuscm_city');
      if (savedCity) setSelectedCity(savedCity);
      const savedOnboarding = localStorage.getItem('campuscm_onboarding');
      if (savedOnboarding === 'done') setOnboardingCompletedState(true);
      const savedUser = localStorage.getItem('campuscm_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedFavs = localStorage.getItem('campuscm_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {}
  }, []);

  const persistUser = (user: User | null) => {
    try {
      if (user) localStorage.setItem('campuscm_user', JSON.stringify(user));
      else localStorage.removeItem('campuscm_user');
    } catch {}
  };

  const login = useCallback((email: string) => {
    const user = mockUsers.find((u) => u.email === email) || {
      ...mockUsers[0],
      email,
    };
    setCurrentUser(user);
    persistUser(user);
  }, []);

  const register = useCallback((email: string, fullName: string) => {
    const user: User = {
      id: generateId(),
      email,
      fullName,
      city: 'Douala',
      roles: ['student'],
      verification: 'unverified',
      studentStatus: true,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      subscriptionPlan: 'free',
    };
    setCurrentUser(user);
    persistUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    persistUser(null);
  }, []);

  const toggleFavorite = useCallback(
    (targetType: FavoriteItem['targetType'], targetId: string) => {
      setFavorites((prev) => {
        const existing = prev.find((f) => f.targetType === targetType && f.targetId === targetId);
        let next: FavoriteItem[];
        if (existing) {
          next = prev.filter((f) => f.id !== existing.id);
        } else {
          next = [...prev, { id: generateId(), userId: 'me', targetType, targetId, createdAt: new Date().toISOString() }];
        }
        try { localStorage.setItem('campuscm_favorites', JSON.stringify(next)); } catch {}
        return next;
      });
    },
    [],
  );

  const isFavorite = useCallback(
    (targetType: FavoriteItem['targetType'], targetId: string) =>
      favorites.some((f) => f.targetType === targetType && f.targetId === targetId),
    [favorites],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addUserListing = useCallback((listing: Listing) => {
    setUserListings((prev) => [listing, ...prev]);
  }, []);

  const updateUserListing = useCallback((id: string, updates: Partial<Listing>) => {
    setUserListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const removeUserListing = useCallback((id: string) => {
    setUserListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setOnboardingCompleted = useCallback((done: boolean) => {
    setOnboardingCompletedState(done);
    try { localStorage.setItem('campuscm_onboarding', 'done'); } catch {}
  }, []);

  const setSelectedCityPersist = useCallback((city: string) => {
    setSelectedCity(city);
    try { localStorage.setItem('campuscm_city', city); } catch {}
  }, []);

  const value: AppContextValue = {
    currentUser,
    login,
    logout,
    register,
    favorites,
    toggleFavorite,
    isFavorite,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    conversations,
    userListings,
    addUserListing,
    updateUserListing,
    removeUserListing,
    selectedCity,
    setSelectedCity: setSelectedCityPersist,
    onboardingCompleted,
    setOnboardingCompleted,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
