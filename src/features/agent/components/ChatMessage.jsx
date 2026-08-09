import { FaRobot } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({ message }) => {
    const isUser = message.role === "user";

    // Custom renderers for markdown elements to make them look beautiful and fit the theme
    const markdownComponents = {
        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
        a: ({ node, ...props }) => (
            <a 
                className="font-medium underline underline-offset-4 hover:opacity-80 transition-opacity" 
                target="_blank" 
                rel="noopener noreferrer" 
                {...props} 
            />
        ),
        ul: ({ node, ...props }) => <ul className="mb-4 list-outside list-disc pl-5 last:mb-0 space-y-1.5" {...props} />,
        ol: ({ node, ...props }) => <ol className="mb-4 list-outside list-decimal pl-5 last:mb-0 space-y-1.5" {...props} />,
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
        table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-gray-200/50 shadow-sm dark:border-gray-700/50">
                <table className="w-full border-collapse text-left text-sm" {...props} />
            </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-black/5 dark:bg-white/5" {...props} />,
        th: ({ node, ...props }) => <th className="border-b border-gray-200/50 px-4 py-3 font-semibold dark:border-gray-700/50" {...props} />,
        td: ({ node, ...props }) => <td className="border-b border-gray-100/50 px-4 py-3 last:border-0 dark:border-gray-700/30" {...props} />,
        h1: ({ node, ...props }) => <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight first:mt-0" {...props} />,
        h2: ({ node, ...props }) => <h2 className="mb-3 mt-5 text-xl font-bold tracking-tight first:mt-0" {...props} />,
        h3: ({ node, ...props }) => <h3 className="mb-3 mt-4 text-lg font-bold tracking-tight first:mt-0" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote className="my-4 border-l-4 border-indigo-500/50 pl-4 text-inherit opacity-80 italic" {...props} />
        ),
        code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");
            
            return isInline ? (
                <code 
                    className="rounded-md bg-black/10 px-1.5 py-0.5 font-mono text-[13px] text-inherit dark:bg-white/10" 
                    {...rest}
                >
                    {children}
                </code>
            ) : (
                <div className="my-4 overflow-hidden rounded-xl bg-gray-950 shadow-md">
                    <div className="flex items-center border-b border-white/10 bg-gray-900/50 px-4 py-2 font-mono text-xs text-gray-400">
                        {match ? match[1] : "text"}
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-gray-50">
                        <code className={className} {...rest}>
                            {children}
                        </code>
                    </pre>
                </div>
            );
        },
    };

    return (
        <div
            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            <div className={`flex max-w-[85%] items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${
                    isUser 
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" 
                        : "bg-linear-to-tr from-indigo-600 to-cyan-500 text-white"
                }`}>
                    {isUser ? <FiUser className="h-4 w-4" /> : <FaRobot className="h-4 w-4" />}
                </div>
                
                {/* Message Bubble */}
                <div
                    className={`relative rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                        isUser
                            ? "rounded-br-sm bg-indigo-600 text-white"
                            : "rounded-bl-sm border border-gray-100 bg-white text-gray-800 dark:border-gray-700/50 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                >
                    <div className="break-words">
                        {isUser ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]} 
                                components={markdownComponents}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;