/**
 * @description Custom hook for voice recording functionality
 * Uses the Web Audio API for recording voice input
 */

import { useState, useCallback, useRef } from 'react';

/**
 * @description Voice recorder hook return type
 */
interface UseVoiceRecorderReturn {
    /** Whether currently recording */
    isRecording: boolean;
    /** Recording duration in seconds */
    recordingDuration: number;
    /** Recording error message */
    recordingError: string | null;
    /** Start recording */
    startRecording: () => Promise<void>;
    /** Stop recording and get audio blob */
    stopRecording: () => Promise<Blob | null>;
    /** Cancel recording */
    cancelRecording: () => void;
}

/**
 * @description Custom hook for voice recording
 * Provides voice recording functionality using MediaRecorder API
 * 
 * @example
 * const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
 */
export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingError, setRecordingError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    /**
     * @description Starts voice recording
     */
    const startRecording = useCallback(async () => {
        try {
            setRecordingError(null);
            chunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.start(100);
            setIsRecording(true);
            setRecordingDuration(0);

            // Start duration timer
            timerRef.current = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
            setRecordingError('Microphone access denied. Please allow microphone access to record voice messages.');
        }
    }, []);

    /**
     * @description Stops recording and returns audio blob
     * @returns Audio blob or null if recording failed
     */
    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current || !streamRef.current) {
                resolve(null);
                return;
            }

            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

                // Stop all tracks
                streamRef.current?.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                mediaRecorderRef.current = null;

                setIsRecording(false);
                setRecordingDuration(0);
                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    }, []);

    /**
     * @description Cancels recording without returning audio
     */
    const cancelRecording = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        mediaRecorderRef.current = null;
        chunksRef.current = [];
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    return {
        isRecording,
        recordingDuration,
        recordingError,
        startRecording,
        stopRecording,
        cancelRecording,
    };
};

export default useVoiceRecorder;
