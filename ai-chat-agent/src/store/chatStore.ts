/**
 * @description Chat state management using Zustand
 * Handles all chat-related state including messages, conversations, and UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, Attachment } from '@/types';
import { sendToAIAgent, uploadFile } from '@/lib/aiAgentWrapper';

/**
 * @description Chat store state interface
 */
interface ChatState {
    /** Array of all messages in current conversation */
    messages: Message[];
    /** Current conversation ID */
    conversationId: string | null;
    /** Whether AI is currently generating a response */
    isTyping: boolean;
    /** Current input text */
    inputText: string;
    /** Pending attachments to send */
    pendingAttachments: Attachment[];
    /** Error message if any */
    error: string | null;
}

/**
 * @description Chat store actions interface
 */
interface ChatActions {
    /** Sends a message to the AI agent */
    sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
    /** Adds a message to the conversation */
    addMessage: (message: Message) => void;
    /** Updates input text */
    setInputText: (text: string) => void;
    /** Adds an attachment */
    addAttachment: (attachment: Attachment) => void;
    /** Removes an attachment by ID */
    removeAttachment: (id: string) => void;
    /** Clears all pending attachments */
    clearAttachments: () => void;
    /** Clears all messages */
    clearMessages: () => void;
    /** Sets error state */
    setError: (error: string | null) => void;
    /** Starts a new conversation */
    newConversation: () => void;
    /** Handles file upload */
    handleFileUpload: (file: File) => Promise<Attachment | null>;
}

/**
 * @description Combined chat store type
 */
type ChatStore = ChatState & ChatActions;

/**
 * @description Generates a unique message ID
 */
const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * @description Generates a unique conversation ID
 */
const generateConversationId = (): string => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * @description Generates a unique attachment ID
 */
const generateAttachmentId = (): string => {
    return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * @description Zustand store for chat state management
 * Persists conversation history to localStorage
 */
export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            // Initial state
            messages: [],
            conversationId: null,
            isTyping: false,
            inputText: '',
            pendingAttachments: [],
            error: null,

            /**
             * @description Sends a message to the AI and handles response
             * @param content - Message text content
             * @param attachments - Optional attachments
             */
            sendMessage: async (content, attachments = []) => {
                const { messages, conversationId } = get();

                // Create user message
                const userMessage: Message = {
                    id: generateMessageId(),
                    role: 'user',
                    content,
                    contentType: 'text',
                    attachments: attachments.length > 0 ? attachments : undefined,
                    timestamp: new Date().toISOString(),
                };

                // Add user message and clear input
                set((state) => ({
                    messages: [...state.messages, userMessage],
                    inputText: '',
                    pendingAttachments: [],
                    isTyping: true,
                    error: null,
                }));

                try {
                    // Send to AI agent
                    const response = await sendToAIAgent({
                        message: content,
                        attachments,
                        conversationId: conversationId || undefined,
                        messageHistory: messages,
                    });

                    // Create AI response message
                    const aiMessage: Message = {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: response.content,
                        contentType: response.type,
                        attachments: response.attachments,
                        timestamp: new Date().toISOString(),
                    };

                    // Add AI response
                    set((state) => ({
                        messages: [...state.messages, aiMessage],
                        isTyping: false,
                        conversationId: conversationId || generateConversationId(),
                    }));

                    // Handle errors from AI
                    if (response.error) {
                        set({ error: response.error });
                    }
                } catch (error) {
                    console.error('Failed to send message:', error);
                    set({
                        isTyping: false,
                        error: 'Failed to send message. Please try again.',
                    });
                }
            },

            /**
             * @description Adds a message directly to the conversation
             * @param message - Message to add
             */
            addMessage: (message) => {
                set((state) => ({
                    messages: [...state.messages, message],
                }));
            },

            /**
             * @description Updates the input text
             * @param text - New input text
             */
            setInputText: (text) => set({ inputText: text }),

            /**
             * @description Adds an attachment to pending list
             * @param attachment - Attachment to add
             */
            addAttachment: (attachment) => {
                set((state) => ({
                    pendingAttachments: [...state.pendingAttachments, attachment],
                }));
            },

            /**
             * @description Removes an attachment by ID
             * @param id - Attachment ID to remove
             */
            removeAttachment: (id) => {
                set((state) => ({
                    pendingAttachments: state.pendingAttachments.filter((a) => a.id !== id),
                }));
            },

            /**
             * @description Clears all pending attachments
             */
            clearAttachments: () => set({ pendingAttachments: [] }),

            /**
             * @description Clears all messages in the conversation
             */
            clearMessages: () => set({ messages: [], conversationId: null }),

            /**
             * @description Sets or clears error message
             * @param error - Error message or null
             */
            setError: (error) => set({ error }),

            /**
             * @description Starts a new conversation
             */
            newConversation: () => {
                set({
                    messages: [],
                    conversationId: generateConversationId(),
                    inputText: '',
                    pendingAttachments: [],
                    error: null,
                });
            },

            /**
             * @description Handles file upload and creates attachment
             * @param file - File to upload
             * @returns Created attachment or null on failure
             */
            handleFileUpload: async (file) => {
                try {
                    const url = await uploadFile(file);
                    const attachment: Attachment = {
                        id: generateAttachmentId(),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        url,
                        preview: file.type.startsWith('image/') ? url : undefined,
                    };
                    get().addAttachment(attachment);
                    return attachment;
                } catch (error) {
                    console.error('Failed to upload file:', error);
                    set({ error: 'Failed to upload file. Please try again.' });
                    return null;
                }
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                messages: state.messages,
                conversationId: state.conversationId,
            }),
        }
    )
);
