/**
 * @description Voice recorder component for recording audio messages
 */

'use client';

import React from 'react';
import styles from './VoiceRecorder.module.css';

/**
 * @description VoiceRecorder props
 */
interface VoiceRecorderProps {
    /** Whether currently recording */
    isRecording: boolean;
    /** Recording duration in seconds */
    duration: number;
    /** Start recording handler */
    onStartRecording: () => void;
    /** Stop recording handler */
    onStopRecording: () => void;
    /** Cancel recording handler */
    onCancelRecording: () => void;
}

/**
 * @description Formats duration for display
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (MM:SS)
 */
const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * @description Voice recorder component for audio messages
 * 
 * @example
 * <VoiceRecorder
 *   isRecording={isRecording}
 *   duration={duration}
 *   onStartRecording={startRecording}
 *   onStopRecording={stopRecording}
 *   onCancelRecording={cancelRecording}
 * />
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    isRecording,
    duration,
    onStartRecording,
    onStopRecording,
    onCancelRecording,
}) => {
    if (!isRecording) {
        return (
            <button
                type="button"
                className={styles.recordButton}
                onClick={onStartRecording}
                aria-label="Start voice recording"
                title="Record voice message"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                </svg>
            </button>
        );
    }

    return (
        <div className={styles.recordingContainer}>
            <div className={styles.recordingIndicator}>
                <span className={styles.recordingDot}></span>
                <span className={styles.duration}>{formatDuration(duration)}</span>
            </div>
            <div className={styles.recordingActions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancelRecording}
                    aria-label="Cancel recording"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
                <button
                    type="button"
                    className={styles.stopButton}
                    onClick={onStopRecording}
                    aria-label="Stop recording"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VoiceRecorder;
