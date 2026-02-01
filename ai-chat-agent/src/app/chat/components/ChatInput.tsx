/**
 * @description Chat input component with multi-modal support
 * Supports text, voice, image, and file inputs with drag and drop
 */

'use client';

import React, { useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Attachment } from '@/types';
import { useUploadHandler, useVoiceRecorder } from '../hooks';
import FilePreview from './FilePreview';
import VoiceRecorder from './VoiceRecorder';
import styles from './ChatInput.module.css';

/**
 * @description ChatInput props
 */
interface ChatInputProps {
    /** Current input value */
    value: string;
    /** Input change handler */
    onChange: (value: string) => void;
    /** Send message handler */
    onSend: () => void;
    /** File upload handler */
    onFileUpload: (file: File) => void;
    /** Pending attachments */
    attachments: Attachment[];
    /** Remove attachment handler */
    onRemoveAttachment: (id: string) => void;
    /** Whether sending is disabled */
    disabled?: boolean;
    /** Whether AI is currently typing */
    isTyping?: boolean;
}

/**
 * @description Chat input component with full multi-modal support
 * Provides text input, voice recording, image/file upload, and drag-drop
 * 
 * @example
 * <ChatInput
 *   value={inputText}
 *   onChange={setInputText}
 *   onSend={handleSend}
 *   onFileUpload={handleFileUpload}
 *   attachments={pendingAttachments}
 *   onRemoveAttachment={removeAttachment}
 * />
 */
export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    onFileUpload,
    attachments,
    onRemoveAttachment,
    disabled = false,
    isTyping = false,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const {
        isDragging,
        uploadError,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
    } = useUploadHandler();

    const {
        isRecording,
        recordingDuration,
        recordingError,
        startRecording,
        stopRecording,
        cancelRecording,
    } = useVoiceRecorder();

    /**
     * @description Handles key press events for sending messages
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && (value.trim() || attachments.length > 0)) {
                onSend();
            }
        }
    };

    /**
     * @description Handles text input changes
     */
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        onChange(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    /**
     * @description Handles voice recording completion
     */
    const handleStopRecording = async (): Promise<void> => {
        const audioBlob = await stopRecording();
        if (audioBlob) {
            const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
                type: 'audio/webm',
            });
            onFileUpload(file);
        }
    };

    /**
     * @description Opens file picker for general files
     */
    const openFilePicker = (): void => {
        fileInputRef.current?.click();
    };

    /**
     * @description Opens file picker for images
     */
    const openImagePicker = (): void => {
        imageInputRef.current?.click();
    };

    const canSend = !disabled && (value.trim() || attachments.length > 0);

    return (
        <div
            className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, onFileUpload)}
        >
            {/* Drag overlay */}
            {isDragging && (
                <div className={styles.dragOverlay}>
                    <div className={styles.dragContent}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>
                        <span>Drop files here</span>
                    </div>
                </div>
            )}

            {/* Error messages */}
            {(uploadError || recordingError) && (
                <div className={styles.errorMessage}>
                    {uploadError || recordingError}
                </div>
            )}

            {/* Pending attachments */}
            {attachments.length > 0 && (
                <div className={styles.attachmentsList}>
                    {attachments.map((attachment) => (
                        <FilePreview
                            key={attachment.id}
                            attachment={attachment}
                            onRemove={onRemoveAttachment}
                        />
                    ))}
                </div>
            )}

            {/* Input area */}
            <div className={styles.inputArea}>
                {/* File input buttons */}
                <div className={styles.actionButtons}>
                    {/* Image upload */}
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={openImagePicker}
                        disabled={disabled || isRecording}
                        aria-label="Upload image"
                        title="Upload image"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                    </button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        className={styles.hiddenInput}
                        onChange={(e) => handleFileSelect(e.target.files, onFileUpload)}
                    />

                    {/* File upload */}
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={openFilePicker}
                        disabled={disabled || isRecording}
                        aria-label="Upload file"
                        title="Upload file"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                        </svg>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.hiddenInput}
                        onChange={(e) => handleFileSelect(e.target.files, onFileUpload)}
                    />
                </div>

                {/* Voice recorder or text input */}
                {isRecording ? (
                    <div className={styles.voiceContainer}>
                        <VoiceRecorder
                            isRecording={isRecording}
                            duration={recordingDuration}
                            onStartRecording={startRecording}
                            onStopRecording={handleStopRecording}
                            onCancelRecording={cancelRecording}
                        />
                    </div>
                ) : (
                    <>
                        <textarea
                            ref={textareaRef}
                            className={styles.textarea}
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={isTyping ? 'AI is typing...' : 'Type a message...'}
                            disabled={disabled}
                            rows={1}
                        />

                        {/* Voice recording button */}
                        <VoiceRecorder
                            isRecording={isRecording}
                            duration={recordingDuration}
                            onStartRecording={startRecording}
                            onStopRecording={handleStopRecording}
                            onCancelRecording={cancelRecording}
                        />
                    </>
                )}

                {/* Send button */}
                <button
                    type="button"
                    className={`${styles.sendButton} ${canSend ? styles.active : ''}`}
                    onClick={onSend}
                    disabled={!canSend}
                    aria-label="Send message"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
