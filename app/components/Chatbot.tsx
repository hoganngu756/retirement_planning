"use client";
import * as React from 'react';


type Message = {
  sender: 'ai' | 'user';
  text: string;
};

const initialMessages: Message[] = [
  { sender: 'ai', text: 'Hello! I am your assistant. How can I help you with your retirement planning today?' }
];

export default function Chatbot() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState<string>('');

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    // Placeholder AI response
    setTimeout(() => {
      setMessages((msgs: Message[]) => [...msgs, { sender: 'ai', text: "I'm here to help! (AI response placeholder)" }]);
    }, 600);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full rounded-lg border border-gray-300 bg-white shadow-lg">
      <div className="p-4 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <img src="/robot.svg" alt="Robot assistant" className="h-6 w-6" />
          <span className="font-bold text-blue-700">AI Chatbot Assistant</span>
        </div>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((msg: Message, idx: number) => (
          <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${msg.sender === 'ai' ? 'bg-blue-100 text-gray-900' : 'bg-blue-500 text-white'}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex border-t bg-gray-50 rounded-b-lg">
        <input
          className="flex-1 px-3 py-2 rounded-bl-lg focus:outline-none text-gray-900 placeholder-gray-500"
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-br-lg hover:bg-blue-600">Send</button>
      </form>
    </div>
  );
}
