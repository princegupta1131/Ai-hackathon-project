/**
 * @description Loading spinner component with multiple sizes
 */

import React from 'react';
import styles from './Loader.module.css';

/**
 * @description Loader size options
 */
type LoaderSize = 'sm' | 'md' | 'lg';

/**
 * @description Loader component props
 */
interface LoaderProps {
    /** Size of the loader */
    size?: LoaderSize;
    /** Custom color */
    color?: string;
    /** Additional className */
    className?: string;
}

/**
 * @description Animated loading spinner component
 * 
 * @example
 * <Loader size="md" />
 */
export const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    color,
    className = '',
}) => {
    return (
        <div
            className={`${styles.loader} ${styles[size]} ${className}`}
            style={color ? { borderTopColor: color } : undefined}
        >
            <span className={styles.srOnly}>Loading...</span>
        </div>
    );
};

/**
 * @description Full page loader overlay
 */
export const FullPageLoader: React.FC = () => {
    return (
        <div className={styles.fullPage}>
            <Loader size="lg" />
        </div>
    );
};

export default Loader;
