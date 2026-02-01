/**
 * @description Glassmorphism Card component for content containers
 */

import React from 'react';
import styles from './Card.module.css';

/**
 * @description Card component props
 */
interface CardProps {
    /** Card content */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Card padding size */
    padding?: 'sm' | 'md' | 'lg';
    /** Click handler */
    onClick?: () => void;
    /** Whether card is hoverable */
    hoverable?: boolean;
}

/**
 * @description Glassmorphism card container component
 * 
 * @example
 * <Card padding="lg" hoverable>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    onClick,
    hoverable = false,
}) => {
    const cardClasses = [
        styles.card,
        styles[`padding-${padding}`],
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
