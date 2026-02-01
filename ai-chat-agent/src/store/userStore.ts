/**
 * @description User state management using Zustand
 * Handles user authentication state across the application
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { getCurrentUser, logoutUser as authLogout } from '@/lib/auth';

/**
 * @description User store state interface
 */
interface UserState {
    /** Currently logged in user */
    user: User | null;
    /** Loading state for auth operations */
    isLoading: boolean;
    /** Whether user has been checked on app load */
    isInitialized: boolean;
}

/**
 * @description User store actions interface
 */
interface UserActions {
    /** Sets the current user */
    setUser: (user: User | null) => void;
    /** Logs out the current user */
    logout: () => void;
    /** Initializes user state from storage */
    initialize: () => void;
    /** Sets loading state */
    setLoading: (loading: boolean) => void;
}

/**
 * @description Combined user store type
 */
type UserStore = UserState & UserActions;

/**
 * @description Zustand store for user state management
 * Persists user data to localStorage for session persistence
 */
export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            isLoading: false,
            isInitialized: false,

            /**
             * @description Sets the current user
             * @param user - User object or null
             */
            setUser: (user) => set({ user }),

            /**
             * @description Logs out the user and clears state
             */
            logout: () => {
                authLogout();
                set({ user: null });
            },

            /**
             * @description Initializes user state from localStorage
             */
            initialize: () => {
                const user = getCurrentUser();
                set({ user, isInitialized: true });
            },

            /**
             * @description Sets the loading state
             * @param isLoading - Boolean loading state
             */
            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);
