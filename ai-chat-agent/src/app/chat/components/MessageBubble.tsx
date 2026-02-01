/**
 * @description Message bubble component for displaying chat messages
 * Supports text, images, files, and markdown content
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types';
import styles from './MessageBubble.module.css';

/**
 * @description MessageBubble props
 */
interface MessageBubbleProps {
    /** Message data */
    message: Message;
}

/**
 * @description Formats timestamp for display
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * @description Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * @description Message bubble component for chat messages
 * Displays user and AI messages with different styling
 * Supports markdown, images, and file attachments
 * 
 * @example
 * <MessageBubble message={message} />
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`${styles.messageRow} ${isUser ? styles.user : styles.assistant}`}>
            {/* Avatar */}
            <div className={styles.avatar}>
                {isUser ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                )}
            </div>

            {/* Message content */}
            <div className={styles.bubble}>
                {/* Loading indicator for AI */}
                {message.isLoading ? (
                    <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ) : (
                    <>
                        {/* Text content with markdown support */}
                        {message.content && (
                            <div className={styles.content}>
                                <ReactMarkdown
                                    components={{
                                        // Custom code block styling
                                        code: ({ className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const isInline = !match;
                                            return isInline ? (
                                                <code className={styles.inlineCode} {...props}>
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className={styles.codeBlock}>
                                                    <div className={styles.codeHeader}>
                                                        <span>{match[1]}</span>
                                                    </div>
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            );
                                        },
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        )}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                            <div className={styles.attachments}>
                                {message.attachments.map((attachment) => (
                                    <div key={attachment.id} className={styles.attachment}>
                                        {attachment.type.startsWith('image/') && attachment.preview ? (
                                            <img
                                                src={attachment.preview}
                                                alt={attachment.name}
                                                className={styles.imagePreview}
                                            />
                                        ) : (
                                            <div className={styles.filePreview}>
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                                </svg>
                                                <div className={styles.fileInfo}>
                                                    <span className={styles.fileName}>{attachment.name}</span>
                                                    <span className={styles.fileSize}>{formatFileSize(attachment.size)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Timestamp */}
                <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
            </div>
        </div>
    );
};

export default MessageBubble;
