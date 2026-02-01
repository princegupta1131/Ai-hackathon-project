/**
 * @description Custom hook for chat functionality
 * Handles sending messages, managing conversation state, and attachments
 */

import { useChatStore } from '@/store/chatStore';
import { Message, Attachment } from '@/types';

/**
 * @description Hook return type
 */
interface UseChatReturn {
    /** All messages in current conversation */
    messages: Message[];
    /** Whether AI is typing */
    isTyping: boolean;
    /** Current input text */
    inputText: string;
    /** Pending attachments */
    pendingAttachments: Attachment[];
    /** Error message */
    error: string | null;
    /** Send a message */
    sendMessage: (content: string) => Promise<void>;
    /** Update input text */
    setInputText: (text: string) => void;
    /** Handle file upload */
    handleFileUpload: (file: File) => Promise<void>;
    /** Remove an attachment */
    removeAttachment: (id: string) => void;
    /** Clear all messages */
    clearMessages: () => void;
    /** Start new conversation */
    newConversation: () => void;
    /** Clear error */
    clearError: () => void;
}

/**
 * @description Custom hook for chat functionality
 * Provides all necessary methods and state for the chat interface
 * 
 * @example
 * const { messages, sendMessage, isTyping } = useChat();
 */
export const useChat = (): UseChatReturn => {
    const {
        messages,
        isTyping,
        inputText,
        pendingAttachments,
        error,
        sendMessage: storeSendMessage,
        setInputText,
        handleFileUpload: storeFileUpload,
        removeAttachment,
        clearMessages,
        newConversation,
        setError,
    } = useChatStore();

    /**
     * @description Sends a message with pending attachments
     * @param content - Message text content
     */
    const sendMessage = async (content: string): Promise<void> => {
        if (!content.trim() && pendingAttachments.length === 0) return;
        await storeSendMessage(content, pendingAttachments);
    };

    /**
     * @description Handles file upload
     * @param file - File to upload
     */
    const handleFileUpload = async (file: File): Promise<void> => {
        await storeFileUpload(file);
    };

    /**
     * @description Clears the current error
     */
    const clearError = (): void => {
        setError(null);
    };

    return {
        messages,
        isTyping,
        inputText,
        pendingAttachments,
        error,
        sendMessage,
        setInputText,
        handleFileUpload,
        removeAttachment,
        clearMessages,
        newConversation,
        clearError,
    };
};

export default useChat;
