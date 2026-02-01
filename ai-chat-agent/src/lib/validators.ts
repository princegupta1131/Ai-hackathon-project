/**
 * @description Validation utilities for form inputs
 * Contains all validation logic for user inputs
 */

/**
 * @description Validates email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * @description Validates mobile number format (10+ digits)
 * @param mobile - Mobile number string to validate
 * @returns Boolean indicating if mobile is valid
 */
export const isValidMobile = (mobile: string): boolean => {
    const mobileRegex = /^\+?[\d\s-]{10,}$/;
    return mobileRegex.test(mobile);
};

/**
 * @description Validates password strength
 * Must be at least 6 characters
 * @param password - Password string to validate
 * @returns Boolean indicating if password meets requirements
 */
export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * @description Validates that passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Boolean indicating if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
};

/**
 * @description Validates name is not empty and has valid characters
 * @param name - Name string to validate
 * @returns Boolean indicating if name is valid
 */
export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};

/**
 * @description Validation error messages
 */
export const ValidationMessages = {
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDoNotMatch: 'Passwords do not match',
    nameRequired: 'Name is required',
    nameTooShort: 'Name must be at least 2 characters',
    mobileRequired: 'Mobile number is required',
    mobileInvalid: 'Please enter a valid mobile number',
};

/**
 * @description File type validation for uploads
 */
export const AllowedFileTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'text/plain', 'application/msword'],
    audio: ['audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg'],
};

/**
 * @description Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * @description Validates file type and size
 * @param file - File to validate
 * @returns Object with valid status and error message if any
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allAllowedTypes = [
        ...AllowedFileTypes.images,
        ...AllowedFileTypes.documents,
        ...AllowedFileTypes.audio,
    ];

    if (!allAllowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not supported' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    return { valid: true };
};
