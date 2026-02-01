/**
 * @description AI Agent Wrapper - Central hub for all AI interactions
 * This module provides a unified interface for sending messages to the AI agent
 * Currently uses mock responses - replace with real API integration in production
 */

import { AIAgentPayload, AIAgentResponse, Message } from '@/types';

/**
 * @description Configuration for the AI Agent
 * Update these values when connecting to a real backend
 */
const AI_AGENT_CONFIG = {
    // Base URL for the AI API (update when backend is ready)
    baseUrl: process.env.NEXT_PUBLIC_AI_API_URL || '/api/ai',
    // Request timeout in milliseconds
    timeout: 30000,
    // Simulated response delay for mock mode
    mockDelay: 800,
};

/**
 * @description Mock responses for different input types
 * These simulate AI responses during development
 */
const mockResponses: Record<string, string[]> = {
    greeting: [
        "Hello! I'm your AI assistant. How can I help you today?",
        "Hi there! I'm ready to assist you with any questions or tasks.",
        "Greetings! What would you like to explore today?",
    ],
    image: [
        "I can see you've shared an image. Let me analyze it for you...\n\nThis appears to be an interesting visual. I can help you with image descriptions, analysis, or any questions about what you've shared.",
        "Thanks for sharing this image! I've analyzed it and I'm ready to discuss what I see or answer any questions you might have about it.",
    ],
    file: [
        "I've received your file. Let me process it...\n\nI can help you analyze the contents, summarize key points, or answer questions about the document.",
        "File received! I'm ready to help you work with this document. What would you like to know about it?",
    ],
    code: [
        "```javascript\n// Here's a sample code response\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));\n```\n\nI can help you with code explanations, debugging, or writing new code!",
    ],
    default: [
        "That's a great question! Let me think about this...\n\nBased on my analysis, I can provide you with a comprehensive response. Is there anything specific you'd like me to focus on?",
        "I understand what you're asking. Here's my perspective on this topic.\n\nWould you like me to elaborate on any particular aspect?",
        "Thanks for your message! I'm processing your request and here's what I found relevant to share with you.",
    ],
};

/**
 * @description Selects a random response from an array
 * @param responses - Array of possible responses
 * @returns Random response string
 */
const getRandomResponse = (responses: string[]): string => {
    return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * @description Determines the type of response based on user input
 * @param payload - The AI agent payload
 * @returns Category key for mock responses
 */
const getResponseCategory = (payload: AIAgentPayload): string => {
    const message = payload.message.toLowerCase();

    // Check for greeting patterns
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))/i.test(message)) {
        return 'greeting';
    }

    // Check for code-related queries
    if (/code|function|programming|javascript|python|react|api/i.test(message)) {
        return 'code';
    }

    // Check for attachments
    if (payload.attachments && payload.attachments.length > 0) {
        const firstAttachment = payload.attachments[0];
        if (firstAttachment.type.startsWith('image/')) {
            return 'image';
        }
        return 'file';
    }

    return 'default';
};

/**
 * @description Main function to send messages to the AI Agent
 * This is the single entry point for all AI interactions
 * 
 * @param payload - The message payload including text and attachments
 * @returns Promise resolving to AI response
 * 
 * @example
 * const response = await sendToAIAgent({
 *   message: "Hello, how are you?",
 *   attachments: [],
 * });
 */
export const sendToAIAgent = async (payload: AIAgentPayload): Promise<AIAgentResponse> => {
    try {
        // TODO: Replace mock implementation with real API call
        // Example real implementation:
        // const response = await fetch(`${AI_AGENT_CONFIG.baseUrl}/chat`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // });
        // return await response.json();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, AI_AGENT_CONFIG.mockDelay));

        // Generate mock response based on input
        const category = getResponseCategory(payload);
        const responses = mockResponses[category] || mockResponses.default;
        const content = getRandomResponse(responses);

        return {
            type: 'text',
            content,
        };
    } catch (error) {
        console.error('AI Agent Error:', error);
        return {
            type: 'text',
            content: '',
            error: 'Failed to get response from AI agent. Please try again.',
        };
    }
};

/**
 * @description Formats conversation history for context
 * @param messages - Array of previous messages
 * @returns Formatted message history for API
 */
export const formatMessageHistory = (messages: Message[]): Message[] => {
    // Keep last 10 messages for context
    return messages.slice(-10).map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        contentType: msg.contentType,
        timestamp: msg.timestamp,
    }));
};

/**
 * @description Uploads a file and returns its URL
 * Currently returns a local object URL - replace with actual upload logic
 * 
 * @param file - File to upload
 * @returns Promise resolving to file URL
 */
export const uploadFile = async (file: File): Promise<string> => {
    // TODO: Implement actual file upload to server
    // For now, create a local object URL
    return URL.createObjectURL(file);
};

export default {
    sendToAIAgent,
    formatMessageHistory,
    uploadFile,
};
