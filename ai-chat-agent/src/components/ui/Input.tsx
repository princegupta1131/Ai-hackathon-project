/**
 * @description Reusable Input component with validation support
 * Supports text, email, password, and other input types
 */

import React, { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * @description Input component props
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Label text */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Left icon */
    leftIcon?: React.ReactNode;
    /** Right icon */
    rightIcon?: React.ReactNode;
    /** Full width input */
    fullWidth?: boolean;
}

/**
 * @description Reusable Input component with label, error, and icon support
 * Uses forwardRef for form library compatibility
 * 
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;

        const containerClasses = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
            error ? styles.hasError : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={styles.inputWrapper}>
                    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={styles.input}
                        {...props}
                    />
                    {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
                </div>
                {error && <span className={styles.error}>{error}</span>}
                {!error && helperText && <span className={styles.helper}>{helperText}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
