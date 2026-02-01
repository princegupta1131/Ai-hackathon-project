/**
 * @description Reusable Button component with multiple variants
 * Supports primary, secondary, ghost, and danger styles
 */

import React from 'react';
import styles from './Button.module.css';

/**
 * @description Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * @description Button size types
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * @description Button component props
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button style variant */
    variant?: ButtonVariant;
    /** Button size */
    size?: ButtonSize;
    /** Loading state */
    isLoading?: boolean;
    /** Full width button */
    fullWidth?: boolean;
    /** Icon to display before text */
    leftIcon?: React.ReactNode;
    /** Icon to display after text */
    rightIcon?: React.ReactNode;
    /** Button content */
    children: React.ReactNode;
}

/**
 * @description Reusable Button component with multiple variants and states
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * @example
 * <Button variant="secondary" isLoading>
 *   Submitting...
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        isLoading ? styles.loading : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className={styles.spinner}>
                    <svg
                        className={styles.spinnerIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className={styles.spinnerCircle}
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className={styles.spinnerPath}
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                </span>
            )}
            {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
            <span className={styles.content}>{children}</span>
            {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </button>
    );
};

export default Button;
