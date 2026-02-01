/**
 * @description Chat page - Protected route requiring authentication
 * Main chat interface for the AI assistant
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useChatStore } from '@/store/chatStore';
import { ChatWindow } from './components';
import { FullPageLoader } from '@/components/ui';
import styles from './page.module.css';

/**
 * @description Chat page component
 * Displays the main chat interface with sidebar
 */
export default function ChatPage() {
    const router = useRouter();
    const { user, isInitialized, initialize, logout } = useUserStore();
    const { newConversation, clearMessages } = useChatStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Initialize user state on mount
    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (isInitialized && !user) {
            router.push('/auth/login');
        }
    }, [isInitialized, user, router]);

    /**
     * @description Handles user logout
     */
    const handleLogout = (): void => {
        logout();
        router.push('/auth/login');
    };

    /**
     * @description Toggles sidebar visibility
     */
    const toggleSidebar = (): void => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Show loading while checking auth
    if (!isInitialized || !user) {
        return <FullPageLoader />;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.logo}>
                        <img src="/logo.png" alt="SPAN AI" className={styles.logoImage} />
                        SPAN AI AGENT
                    </h1>
                    <button
                        className={styles.closeSidebar}
                        onClick={toggleSidebar}
                        aria-label="Close sidebar"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <button className={styles.newChatButton} onClick={newConversation}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    New Chat
                </button>

                <nav className={styles.nav}>
                    <span className={styles.navLabel}>Quick Actions</span>
                    <button className={styles.navItem} onClick={clearMessages}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        Clear Messages
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userEmail}>{user.email}</span>
                        </div>
                    </div>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Sidebar overlay for mobile */}
            {isSidebarOpen && (
                <div className={styles.sidebarOverlay} onClick={toggleSidebar} />
            )}

            {/* Main content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <button
                        className={styles.menuButton}
                        onClick={toggleSidebar}
                        aria-label="Open menu"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                        </svg>
                    </button>
                    <h2 className={styles.headerTitle}>Chat with AI Assistant</h2>
                </header>
                <ChatWindow />
            </main>
        </div>
    );
}
