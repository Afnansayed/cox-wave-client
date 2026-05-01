"use client";
import { useState, useEffect, useRef } from "react";
// Message icon er jonno simplified SVG use kora hoyeche
import { MessageSquare, X, Send } from "lucide-react"; 

type Message = {
    role: "user" | "bot";
    text: string;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState<boolean>(false); // Open/Close state
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            const botMsg: Message = { role: "bot", text: data.reply };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "⚠️ Connection error. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        // z-50 use kora hoyeche jate sob kichur upore thake
        <div className="fixed bottom-5 right-5 z-50 font-sans">
            
            {/* 1. Chat Floating Button (Icon) */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                </button>
            )}

            {/* 2. Chat Interface */}
            {isOpen && (
                <div className="w-80 md:w-96 bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="bg-primary text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-sm">Live Support</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-primary-dark p-1 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>

                    {/* Message Area */}
                    <div 
                        ref={scrollRef}
                        className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50"
                    >
                        {messages.length === 0 && (
                            <div className="text-center mt-10">
                                <p className="text-gray-500 font-medium text-sm">Hello! 👋</p>
                                <p className="text-gray-400 text-xs">How can I assist you today?</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                        msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-2xl rounded-tl-none text-xs flex gap-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce [animation-delay:0.2s]">.</span>
                                    <span className="animate-bounce [animation-delay:0.4s]">.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 p-2 bg-gray-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Write a message..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white p-2 rounded-xl transition-all flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}