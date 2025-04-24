import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const FinanceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input) return;
    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/explain`,
        { question: input }
      );
      const botMsg: Message = {
        sender: "bot",
        text: res.data.answer ?? "Sorry, I have no answer.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-center text-white">
            Finance Edu Chatbot
          </h1>
        </div>

        {/* Chat Window */}
        <div className="h-[650px] overflow-y-auto border-t border-b border-gray-300 p-4 bg-blue-200">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 p-3 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-100 self-end text-right ml-auto"
                  : "bg-gray-200 self-start text-left mr-auto"
              }`}
            >
              <span className="font-semibold block mb-1">
                {msg.sender === "user" ? "You" : "Bot"}
              </span>
              <span>{msg.text}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="flex border-t border-gray-300 bg-gray-100 p-3">
          <input
            type="text"
            className="flex-1 p-3 border rounded-l-md focus:outline-none"
            placeholder="Ask a finance question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-r-md disabled:opacity-50"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceChat;
