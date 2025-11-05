import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message & temporary "thinking" bubble
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: userMessage, sender: "user" },
      {
        id: Date.now() + 1,
        text: "Nova is thinking...",
        sender: "bot",
        temp: true,
      },
    ]);

    try {
      const res = await axios.post("http://localhost:4002/bot/v1/message", {
        text: userMessage,
      });

      if (res.status === 200) {
        // Replace "thinking" with actual response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.temp
              ? { id: msg.id, text: res.data.botMessage, sender: "bot" }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "⚠️ Something went wrong. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0b0b0b] via-[#0f0f0f] to-[#181818] text-white font-inter relative overflow-hidden">
      {/* ✨ Background Effects */}
      <div className="absolute top-20 left-20 w-60 h-60 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]" />

      {/* 🌟 Header */}
      <header className="fixed top-0 left-0 w-full border-b border-white/10 backdrop-blur-xl bg-black/40 z-20 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-semibold text-gradient tracking-wide">
            Nova ✨
          </h1>
          <FaUserCircle
            size={32}
            className="cursor-pointer text-gray-300 hover:text-purple-400 transition-colors"
          />
        </div>
      </header>

      {/* 💬 Chat Section */}
      <main className="flex-1 overflow-y-auto pt-24 pb-28 px-3 sm:px-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-5">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-lg mt-40 animate-fadeIn">
              👋 Hey there! I’m{" "}
              <span className="text-gradient font-semibold">Nova</span>.
              <br /> Ask me anything, anytime.
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[80%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-glow backdrop-blur-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white self-end rounded-br-none ml-auto"
                      : msg.temp
                      ? "bg-gray-700/60 text-gray-300 italic self-start rounded-bl-none"
                      : "bg-gray-800/70 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* 🧠 Input Bar */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-white/10 bg-black/40 backdrop-blur-xl z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask Nova..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2.5 rounded-full bg-gray-900/70 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600/60 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="btn-nova disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Bot;
