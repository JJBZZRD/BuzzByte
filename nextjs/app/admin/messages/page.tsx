"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/admin/messages");
        
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError("Failed to load messages. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message");
      }

      // Update message in state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      // Remove message from state
      setMessages(messages.filter(msg => msg.id !== id));
      
      // Close details view if the deleted message was selected
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-foreground/60">Loading messages...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {messages.length === 0 ? (
          <div className="bg-foreground/5 p-8 rounded-xl text-center">
            <p className="text-foreground/60">No messages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-background rounded-xl border border-foreground/10 overflow-hidden">
              <div className="p-4 border-b border-foreground/10">
                <h2 className="font-medium">Inbox ({messages.filter(m => !m.isRead).length} unread)</h2>
              </div>
              <div className="divide-y divide-foreground/10 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-4 cursor-pointer hover:bg-foreground/5 ${selectedMessage?.id === message.id ? 'bg-foreground/5' : ''} ${!message.isRead ? 'font-medium' : ''}`}
                    onClick={() => viewMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="truncate">{message.name}</div>
                      <div className="text-xs text-foreground/60">
                        {format(new Date(message.createdAt), 'MMM d')}
                      </div>
                    </div>
                    <div className="text-sm text-foreground/70 truncate mb-1">{message.subject}</div>
                    <div className="text-xs text-foreground/60 truncate">{message.message}</div>
                    
                    {!message.isRead && (
                      <div className="mt-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-background rounded-xl border border-foreground/10 overflow-hidden h-full">
                  <div className="p-4 border-b border-foreground/10 flex justify-between items-center">
                    <h2 className="font-medium">{selectedMessage.subject}</h2>
                    <button 
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-medium">
                          {selectedMessage.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{selectedMessage.name}</div>
                          <div className="text-sm text-foreground/60">{selectedMessage.email}</div>
                        </div>
                        <div className="ml-auto text-sm text-foreground/60">
                          {format(new Date(selectedMessage.createdAt), 'PPpp')}
                        </div>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
                    
                    <div className="mt-8 pt-4 border-t border-foreground/10">
                      <a 
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-foreground/5 rounded-xl h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-foreground/60 mb-2">
                      Select a message to view its contents
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 