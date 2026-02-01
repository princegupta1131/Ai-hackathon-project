/**
 * @description Authentication utilities using localStorage
 * This is a mock implementation - replace with real backend API in production
 */

import { User, RegisterFormData, LoginFormData } from '@/types';

const USERS_STORAGE_KEY = 'ai_chat_users';
const CURRENT_USER_KEY = 'ai_chat_current_user';

/**
 * @description Generates a unique user ID
 * @returns Unique string ID
 */
const generateUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * @description Gets all registered users from localStorage
 * @returns Array of stored users with passwords
 */
const getStoredUsers = (): (User & { password: string })[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
};

/**
 * @description Saves users to localStorage
 * @param users - Array of users to save
 */
const saveUsers = (users: (User & { password: string })[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * @description Registers a new user
 * @param data - Registration form data
 * @returns Object with success status, user data or error message
 */
export const registerUser = async (
    data: RegisterFormData
): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();

    // Check if email already exists
    if (users.some((u) => u.email === data.email)) {
        return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User & { password: string } = {
        id: generateUserId(),
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password, // In production, hash this!
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
};

/**
 * @description Authenticates a user with email and password
 * @param data - Login form data
 * @returns Object with success status, user data or error message
 */
export const loginUser = async (
    data: LoginFormData
): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const user = users.find((u) => u.email === data.email && u.password === data.password);

    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }

    // Save current user session
    const { password: _, ...userWithoutPassword } = user;
    if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    }

    return { success: true, user: userWithoutPassword };
};

/**
 * @description Gets the currently logged in user
 * @returns User object or null if not logged in
 */
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * @description Logs out the current user
 */
export const logoutUser = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * @description Checks if a user is currently logged in
 * @returns Boolean indicating login status
 */
export const isLoggedIn = (): boolean => {
    return getCurrentUser() !== null;
};
