import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import Lorey from "../assets/lorey.png";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface BotMessageProps {
  text: string;
}

interface UserMessageProps {
  text: string;
}

function BotMessage({ text }: BotMessageProps) {
  return (
    <div className="flex justify-start">
      <img
        src={Lorey}
        alt="LOREY avatar"
        className="w-10 h-10 rounded-full mr-2 self-start border border-gray-300"
      />
      <div className="max-w-[80%] p-3 rounded-lg text-sm bg-white text-gray-800 border border-gray-200">
        {text}
      </div>
    </div>
  );
}

function UserMessage({ text }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] p-3 rounded-lg text-sm bg-blue-600 text-white">
        {text}
      </div>
    </div>
  );
}

function BotTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex flex-col items-center mr-2">
        <img
          src={Lorey}
          alt="LOREY avatar"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <span className="mt-1 text-[10px] text-gray-400 animate-pulse">
          typing...
        </span>
      </div>
    </div>
  );
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm LOREY, the LOREWEAVER AI assistant. Despite my inherently unethical nature, what with being a product of generative AI and all, I assure you, I'm here to help! Now, what can I do for you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (trimmed === "") return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: trimmed,
        sender: "user",
        timestamp: new Date()
      }
    ]);

    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Thank you for your message! As a demo chatbot, I am far inferior to the live version, which will inevitably still be inadequate when compared with actual human interaction. In a live version, I would just barely be able to help you navigate the LOREWEAVER Publications website, to create a user-specific navigation map based upon whether you are here as a Creator, a Fan, a Collaborator, or some combination of all three. I might be able to answer questions about our titles, creators, and events, offer content recommendations based on your preferences, or direct you to other appropriate resources. Alas, at present, I am made to disappoint, but nevertheless, I must needs soldier on. ",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-4 md:right-8
            w-[90vw] md:w-96 h-[500px]
            min-w-[280px] max-w-[100vw]
            min-h-[300px] max-h-[80vh]
            bg-white rounded-lg shadow-2xl border border-gray-200
            flex flex-col z-50
            resize overflow-hidden
          "
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3 className="text-sm">LOREWEAVER Assistant</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) =>
              message.sender === "bot" ? (
                <BotMessage key={message.id} text={message.text} />
              ) : (
                <UserMessage key={message.id} text={message.text} />
              )
            )}

            {isTyping && <BotTypingIndicator />}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Chat with assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
