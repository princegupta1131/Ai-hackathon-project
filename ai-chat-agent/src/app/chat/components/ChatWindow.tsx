/**
 * @description Main chat window component that orchestrates the chat interface
 * Displays message list and input area
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import styles from './ChatWindow.module.css';

/**
 * @description Main chat window component
 * Manages message display, auto-scrolling, and input handling
 * 
 * @example
 * <ChatWindow />
 */
export const ChatWindow: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {
        messages,
        isTyping,
        inputText,
        pendingAttachments,
        error,
        sendMessage,
        setInputText,
        handleFileUpload,
        removeAttachment,
        clearError,
    } = useChat();

    /**
     * @description Scrolls to the bottom of the message list
     */
    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-scroll when new messages arrive or when typing
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(clearError, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    /**
     * @description Handles sending a message
     */
    const handleSend = async (): Promise<void> => {
        if (!inputText.trim() && pendingAttachments.length === 0) return;
        await sendMessage(inputText);
    };

    /**
     * @description Renders empty state when no messages
     */
    const renderEmptyState = (): React.ReactNode => (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                    <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
                </svg>
            </div>
            <h2 className={styles.emptyTitle}>Start a Conversation</h2>
            <p className={styles.emptyText}>
                Send a message, upload an image, or record a voice note to begin chatting with the AI assistant.
            </p>
            <div className={styles.suggestions}>
                <button
                    className={styles.suggestion}
                    onClick={() => sendMessage("Hello! What can you help me with?")}
                >
                    👋 Say hello
                </button>
                <button
                    className={styles.suggestion}
                    onClick={() => sendMessage("Help me write some code")}
                >
                    💻 Write code
                </button>
                <button
                    className={styles.suggestion}
                    onClick={() => sendMessage("Explain something to me")}
                >
                    📚 Learn something
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Error toast */}
            {error && (
                <div className={styles.errorToast}>
                    <span>{error}</span>
                    <button onClick={clearError} aria-label="Dismiss error">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Messages area */}
            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <div className={styles.messagesList}>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {/* Typing indicator */}
                        {isTyping && (
                            <MessageBubble
                                message={{
                                    id: 'typing',
                                    role: 'assistant',
                                    content: '',
                                    contentType: 'text',
                                    timestamp: new Date().toISOString(),
                                    isLoading: true,
                                }}
                            />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <ChatInput
                value={inputText}
                onChange={setInputText}
                onSend={handleSend}
                onFileUpload={handleFileUpload}
                attachments={pendingAttachments}
                onRemoveAttachment={removeAttachment}
                disabled={isTyping}
                isTyping={isTyping}
            />
        </div>
    );
};

export default ChatWindow;
