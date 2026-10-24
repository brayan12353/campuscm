import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  User,
  Listing,
  FavoriteItem,
  AppNotification,
  Conversation,
} from '@/types';
import {
  mockConversations,
  mockNotifications,
} from '@/data/mock';
import { generateId } from '@/utils/format';
import { getSupabaseClient, getSupabaseConfigurationError } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AppContextValue {
  currentUser: User | null;
  authLoading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
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

function mapAuthUser(user: SupabaseUser): User {
  const metadata = user.user_metadata ?? {};
  const fullName =
    (typeof metadata.full_name === 'string' && metadata.full_name) ||
    (typeof metadata.name === 'string' && metadata.name) ||
    user.email ||
    'CampusCM user';
  const avatarUrl =
    (typeof metadata.avatar_url === 'string' && metadata.avatar_url) ||
    (typeof metadata.picture === 'string' && metadata.picture) ||
    undefined;

  return {
    id: user.id,
    email: user.email ?? '',
    fullName,
    avatarUrl,
    city: '',
    roles: [],
    verification: 'unverified',
    studentStatus: false,
    rating: 0,
    reviewCount: 0,
    createdAt: user.created_at ?? '',
    subscriptionPlan: 'free',
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(!getSupabaseConfigurationError());
  const [authError, setAuthError] = useState<string | null>(
    getSupabaseConfigurationError(),
  );
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Douala');
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.removeItem('campuscm_user');
    } catch (error) {
      console.warn('Could not remove the legacy CampusCM demo user.', error);
    }

    try {
      const savedCity = localStorage.getItem('campuscm_city');
      if (savedCity) setSelectedCity(savedCity);
      const savedOnboarding = localStorage.getItem('campuscm_onboarding');
      if (savedOnboarding === 'done') setOnboardingCompletedState(true);
      const savedFavs = localStorage.getItem('campuscm_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch (error) {
      console.error('Could not restore saved CampusCM preferences.', error);
    }

    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;
    let authEventReceived = false;
    const supabase = getSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true;
      if (!mounted) return;
      setCurrentUser(session?.user ? mapAuthUser(session.user) : null);
      setAuthError(null);
      setAuthLoading(false);
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted || authEventReceived) return;
        if (error) {
          setAuthError(error.message);
          setCurrentUser(null);
        } else {
          setCurrentUser(data.session?.user ? mapAuthUser(data.session.user) : null);
        }
        setAuthLoading(false);
      })
      .catch((error: unknown) => {
        if (!mounted || authEventReceived) return;
        const message =
          error instanceof Error
            ? error.message
            : 'Could not restore your Supabase session.';
        console.error('Could not restore the CampusCM authentication session.', error);
        setAuthError(message);
        setCurrentUser(null);
        setAuthLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: new URL('/login', window.location.origin).toString(),
      },
    });
    if (error) throw error;
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setCurrentUser(data.user ? mapAuthUser(data.user) : null);
      setAuthError(null);
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string, fullName: string) => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: new URL('/login', window.location.origin).toString(),
        },
      });
      if (error) throw error;
      if (data.session?.user) {
        setCurrentUser(mapAuthUser(data.session.user));
        setAuthError(null);
      }
      return !data.session;
    },
    [],
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: new URL('/forgot-password?recovery=1', window.location.origin).toString(),
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    if (data.user) setCurrentUser(mapAuthUser(data.user));
  }, []);

  const logout = useCallback(async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
    setAuthError(null);
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
        try {
          localStorage.setItem('campuscm_favorites', JSON.stringify(next));
        } catch (error) {
          console.error('Could not persist CampusCM favorites.', error);
        }
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
    try {
      localStorage.setItem('campuscm_onboarding', 'done');
    } catch (error) {
      console.error('Could not persist the CampusCM onboarding status.', error);
    }
  }, []);

  const setSelectedCityPersist = useCallback((city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('campuscm_city', city);
    } catch (error) {
      console.error('Could not persist the selected CampusCM city.', error);
    }
  }, []);

  const value: AppContextValue = {
    currentUser,
    authLoading,
    authError,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    requestPasswordReset,
    updatePassword,
    logout,
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
