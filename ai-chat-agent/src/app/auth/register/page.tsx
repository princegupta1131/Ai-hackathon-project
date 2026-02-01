/**
 * @description Registration page for new users
 * Collects user information and creates an account
 */

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { registerUser } from '@/lib/auth';
import {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidMobile,
    doPasswordsMatch,
    ValidationMessages,
} from '@/lib/validators';
import { Button, Input, Card } from '@/components/ui';
import styles from '../auth.module.css';

/**
 * @description Form errors interface
 */
interface FormErrors {
    name?: string;
    email?: string;
    mobile?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

/**
 * @description Registration page component
 */
export default function RegisterPage() {
    const router = useRouter();
    const { user, setUser, isInitialized, initialize } = useUserStore();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
     * @description Validates all form fields
     * @returns Whether form is valid
     */
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!isValidName(name)) {
            newErrors.name = ValidationMessages.nameTooShort;
        }

        if (!isValidEmail(email)) {
            newErrors.email = ValidationMessages.emailInvalid;
        }

        if (!isValidMobile(mobile)) {
            newErrors.mobile = ValidationMessages.mobileInvalid;
        }

        if (!isValidPassword(password)) {
            newErrors.password = ValidationMessages.passwordTooShort;
        }

        if (!doPasswordsMatch(password, confirmPassword)) {
            newErrors.confirmPassword = ValidationMessages.passwordsDoNotMatch;
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
            const result = await registerUser({
                name,
                email,
                mobile,
                password,
                confirmPassword,
            });

            if (result.success && result.user) {
                setUser(result.user);
                router.push('/chat');
            } else {
                setErrors({ general: result.error || 'Registration failed' });
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
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>
                        Join our AI-powered chat platform
                    </p>
                </div>

                {/* Registration form */}
                <Card padding="lg" className={styles.formCard}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {errors.general && (
                            <div className={styles.errorAlert}>{errors.general}</div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                            autoComplete="name"
                            required
                        />

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
                            label="Mobile Number"
                            type="tel"
                            placeholder="Enter your mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            error={errors.mobile}
                            autoComplete="tel"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            autoComplete="new-password"
                            helperText="Must be at least 6 characters"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>

                        <p className={styles.switchText}>
                            Already have an account?{' '}
                            <Link href="/auth/login" className={styles.link}>
                                Sign in
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
