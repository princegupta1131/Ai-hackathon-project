/**
 * @description Custom hook for handling file uploads
 * Manages drag and drop, file validation, and upload state
 */

import { useState, useCallback, DragEvent } from 'react';
import { validateFile } from '@/lib/validators';

/**
 * @description Upload handler hook return type
 */
interface UseUploadHandlerReturn {
    /** Whether file is being dragged over drop zone */
    isDragging: boolean;
    /** Upload error message */
    uploadError: string | null;
    /** Handle drag enter event */
    handleDragEnter: (e: DragEvent) => void;
    /** Handle drag leave event */
    handleDragLeave: (e: DragEvent) => void;
    /** Handle drag over event */
    handleDragOver: (e: DragEvent) => void;
    /** Handle drop event */
    handleDrop: (e: DragEvent, onFileSelect: (file: File) => void) => void;
    /** Handle file input change */
    handleFileSelect: (files: FileList | null, onFileSelect: (file: File) => void) => void;
    /** Clear upload error */
    clearUploadError: () => void;
}

/**
 * @description Custom hook for file upload handling
 * Provides drag and drop and file selection functionality
 * 
 * @example
 * const { isDragging, handleDrop, handleFileSelect } = useUploadHandler();
 */
export const useUploadHandler = (): UseUploadHandlerReturn => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragCounter, setDragCounter] = useState(0);

    /**
     * @description Handles drag enter event
     */
    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev + 1);
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    /**
     * @description Handles drag leave event
     */
    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => prev - 1);
        if (dragCounter - 1 === 0) {
            setIsDragging(false);
        }
    }, [dragCounter]);

    /**
     * @description Handles drag over event
     */
    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    /**
     * @description Handles file drop event
     * @param e - Drag event
     * @param onFileSelect - Callback for file selection
     */
    const handleDrop = useCallback(
        (e: DragEvent, onFileSelect: (file: File) => void) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            setDragCounter(0);

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                const file = files[0];
                const validation = validateFile(file);
                if (validation.valid) {
                    setUploadError(null);
                    onFileSelect(file);
                } else {
                    setUploadError(validation.error || 'Invalid file');
                }
            }
        },
        []
    );

    /**
     * @description Handles file input change
     * @param files - Selected files
     * @param onFileSelect - Callback for file selection
     */
    const handleFileSelect = useCallback(
        (files: FileList | null, onFileSelect: (file: File) => void) => {
            if (files && files.length > 0) {
                const file = files[0];
                const validation = validateFile(file);
                if (validation.valid) {
                    setUploadError(null);
                    onFileSelect(file);
                } else {
                    setUploadError(validation.error || 'Invalid file');
                }
            }
        },
        []
    );

    /**
     * @description Clears upload error
     */
    const clearUploadError = useCallback(() => {
        setUploadError(null);
    }, []);

    return {
        isDragging,
        uploadError,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
        clearUploadError,
    };
};

export default useUploadHandler;
