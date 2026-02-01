/**
 * @description Login page for existing users
 * Authenticates users and redirects to chat
 */

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { loginUser } from '@/lib/auth';
import { isValidEmail, ValidationMessages } from '@/lib/validators';
import { Button, Input, Card } from '@/components/ui';
import styles from '../auth.module.css';

/**
 * @description Form errors interface
 */
interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

/**
 * @description Login page component
 */
export default function LoginPage() {
    const router = useRouter();
    const { user, setUser, isInitialized, initialize } = useUserStore();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Initialize user state
    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);

    // Redirect if already logged in
    useEffect(() => {
        if (isInitialized && user) {
            router.push('/chat');
        }
    }, [isInitialized, user, router]);

    /**
     * @description Validates form fields
     * @returns Whether form is valid
     */
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!isValidEmail(email)) {
            newErrors.email = ValidationMessages.emailInvalid;
        }

        if (!password) {
            newErrors.password = ValidationMessages.passwordRequired;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * @description Handles form submission
     */
    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const result = await loginUser({ email, password });

            if (result.success && result.user) {
                setUser(result.user);
                router.push('/chat');
            } else {
                setErrors({ general: result.error || 'Login failed' });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Logo and branding */}
                <div className={styles.branding}>
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="SPAN AI Agent" />
                    </div>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>
                        Sign in to continue to SPAN AI Agent
                    </p>
                </div>

                {/* Login form */}
                <Card padding="lg" className={styles.formCard}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {errors.general && (
                            <div className={styles.errorAlert}>{errors.general}</div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            autoComplete="email"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            autoComplete="current-password"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>

                        <p className={styles.switchText}>
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/register" className={styles.link}>
                                Create one
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>

            {/* Background decoration */}
            <div className={styles.decoration}>
                <div className={styles.circle1} />
                <div className={styles.circle2} />
                <div className={styles.circle3} />
            </div>
        </div>
    );
}
