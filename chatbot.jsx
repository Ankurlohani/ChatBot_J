import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizontal, Mic, Moon, Sun, User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am Jarvis. How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Processing...", sender: "bot" }]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleVoiceSubmit = () => {
    setInput(transcript);
    resetTranscript();
  };

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-4`}>
      <Button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 p-2">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="h-96 overflow-y-auto space-y-3 p-2 flex flex-col">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && <Bot size={24} className="text-blue-500" />}
                <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>{msg.text}</div>
                {msg.sender === "user" && <User size={24} className="text-gray-500" />}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center mt-4">
            <Button onClick={handleVoiceInput} className="p-3 bg-gray-500 text-white rounded-l-lg">
              <Mic size={20} />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 focus:outline-none"
            />
            <Button onClick={handleVoiceSubmit} className="p-3 bg-green-500 text-white">
              🎤
            </Button>
            <Button onClick={handleSend} className="p-3 bg-blue-500 text-white rounded-r-lg">
              <SendHorizontal size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
