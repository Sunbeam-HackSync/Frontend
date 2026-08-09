import { useCallback, useState } from "react";
import { sendChatMessage } from "../api/chatApi";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (message) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isLoading) {
        return;
      }

      setError(null);

      // Add user's message immediately.
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: trimmedMessage,
        },
      ]);

      setIsLoading(true);

      try {
        const historyPayload = messages.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          content: msg.content,
        }));

        const data = await sendChatMessage(trimmedMessage, historyPayload);

        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.content,
          },
        ]);
      } catch (err) {
        console.error("Chat request failed:", err);

        const errorMessage =
          err.response?.data?.message ||
          "Something went wrong while contacting the chatbot.";

        setError(errorMessage);

        setMessages((previousMessages) => [
          ...previousMessages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, I couldn't process your request right now.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
};
