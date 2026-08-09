import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChat } from "../hooks/useChat";
import { FaRobot } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";

const Chatbot = () => {
    const {
        messages,
        sendMessage,
        isLoading,
    } = useChat();

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 transition-colors duration-500 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="flex h-[80vh] min-h-[600px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-gray-900/80 dark:ring-white/10">

                {/* Header */}
                <header className="flex items-center gap-4 border-b border-gray-100 bg-white/50 px-6 py-4 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-900/50">
                    <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/30">
                        <FaRobot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Hackathon Assistant
                        </h1>
                        <p className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                            <BsStars className="h-3.5 w-3.5 text-amber-500" />
                            AI-powered support
                        </p>
                    </div>
                </header>

                {/* Messages */}
                <main className="scroll-smooth flex-1 space-y-6 overflow-y-auto p-6">
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 ring-8 ring-indigo-50/50 dark:bg-indigo-500/10 dark:ring-indigo-500/5">
                                <FiMessageSquare className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                                    How can I help you today?
                                </h2>
                                <p className="mx-auto max-w-sm text-gray-500 dark:text-gray-400">
                                    Ask me about hackathons, team formations, projects, and more.
                                </p>
                            </div>

                            <div className="mt-4 grid w-full max-w-md grid-cols-1 gap-3">
                                {["Show available hackathons", "Show my hackathons", "How to form a team?"].map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => sendMessage(suggestion)}
                                        className="group relative flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/50 p-4 text-left text-sm font-medium text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-500/20 dark:text-indigo-400">
                                            <BsStars className="h-4 w-4" />
                                        </div>
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-5 py-4 text-sm text-gray-500 shadow-sm dark:border-gray-700/50 dark:bg-gray-800 dark:text-gray-400">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></span>
                                </div>
                                <span className="ml-2 font-medium">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                {/* Input */}
                <div className="border-t border-gray-100 bg-white/50 p-4 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-900/50">
                    <ChatInput
                        onSend={sendMessage}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;