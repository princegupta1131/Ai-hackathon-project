/**
 * @description File preview component for displaying pending attachments
 */

'use client';

import React from 'react';
import { Attachment } from '@/types';
import styles from './FilePreview.module.css';

/**
 * @description FilePreview props
 */
interface FilePreviewProps {
    /** Attachment data */
    attachment: Attachment;
    /** Remove handler */
    onRemove: (id: string) => void;
}

/**
 * @description Formats file size for display
 */
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * @description File preview component for pending attachments
 * Shows image previews or file information
 * 
 * @example
 * <FilePreview attachment={attachment} onRemove={handleRemove} />
 */
export const FilePreview: React.FC<FilePreviewProps> = ({ attachment, onRemove }) => {
    const isImage = attachment.type.startsWith('image/');

    return (
        <div className={styles.preview}>
            {isImage && attachment.preview ? (
                <div className={styles.imageContainer}>
                    <img src={attachment.preview} alt={attachment.name} className={styles.image} />
                </div>
            ) : (
                <div className={styles.fileContainer}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.fileIcon}>
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                </div>
            )}
            <div className={styles.info}>
                <span className={styles.name} title={attachment.name}>
                    {attachment.name}
                </span>
                <span className={styles.size}>{formatFileSize(attachment.size)}</span>
            </div>
            <button
                type="button"
                className={styles.removeButton}
                onClick={() => onRemove(attachment.id)}
                aria-label="Remove attachment"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    );
};

export default FilePreview;
