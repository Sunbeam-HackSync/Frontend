// ./src/features/agent/components/ChatInput.jsx

import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const ChatInput = ({
    onSend,
    disabled = false,
}) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    }, [disabled]);

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        setMessage("");
        await onSend(trimmedMessage);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center"
        >
            <div className="relative flex w-full items-center">
                <textarea
                    ref={inputRef}
                    rows="1"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything... (Press Enter to send)"
                    disabled={disabled}
                    className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-5 py-4 pr-16 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                />
                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
                >
                    {disabled && !message.trim() ? (
                        <FiSend className="ml-0.5 h-4 w-4" />
                    ) : disabled ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                        <FiSend className="ml-0.5 h-4 w-4" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default ChatInput;