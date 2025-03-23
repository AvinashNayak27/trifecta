import React, { useState, useEffect, useRef } from "react";
import { Rocket, MessageSquare, ArrowRight } from "lucide-react";
import {marked} from "marked";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hi! I'm your ProductClaner AI assistant. I can help you launch a token for your Product Hunt project. Would you like to start the process?",
    },
  ]);
  const [input, setInput] = useState("");

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3001");
    ws.current.onopen = () => console.log("WebSocket connection established");
    ws.current.onclose = () => console.log("WebSocket connection closed");

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { type: "user", content: input }];
    setMessages(newMessages);

    // Send message to WebSocket server
    ws.current.send(JSON.stringify({ type: "user", content: input }));

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">
                Launch Your Token
              </h1>
            </div>
            <p className="text-white/80 mt-2">
              Our AI assistant will help you create and launch your token
            </p>
          </div>

          {/* Chat Interface */}
          <div className="h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === "user"
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked(message.content).replace(
                          /<a /g,
                          '<a target="_blank" '
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Send
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
