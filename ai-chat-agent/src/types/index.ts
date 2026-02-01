/**
 * @description Core type definitions for the AI Chat Application
 * These types are used throughout the application for type safety
 */

/**
 * @description User information type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
}

/**
 * @description Registration form data type
 */
export interface RegisterFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

/**
 * @description Login form data type
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * @description Supported message content types
 */
export type MessageContentType = 'text' | 'image' | 'file' | 'voice' | 'code';

/**
 * @description Attachment information for messages
 */
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

/**
 * @description Chat message structure
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentType: MessageContentType;
  attachments?: Attachment[];
  timestamp: string;
  isLoading?: boolean;
}

/**
 * @description AI Agent request payload
 */
export interface AIAgentPayload {
  message: string;
  attachments?: Attachment[];
  conversationId?: string;
  messageHistory?: Message[];
}

/**
 * @description AI Agent response structure
 */
export interface AIAgentResponse {
  type: MessageContentType;
  content: string;
  attachments?: Attachment[];
  error?: string;
}

/**
 * @description Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * @description Theme options
 */
export type Theme = 'light' | 'dark';
