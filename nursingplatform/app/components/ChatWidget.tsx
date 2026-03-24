'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Send, X, MessageSquare, User, Search, History, CheckCheck } from 'lucide-react';
import api from '@/lib/api';

interface ChatWidgetProps {
  initialParticipantId?: string;
  onClose?: () => void;
}

export default function ChatWidget({ initialParticipantId, onClose }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations and current user
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));

    const fetchConversations = async () => {
      try {
        const resp = await api.get('/messages/conversations');
        setConversations(resp.data);
      } catch (err) {
        console.error("Fetch Conversations Error:", err);
      }
    };

    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  // Handle initial participant if provided
  useEffect(() => {
    if (initialParticipantId) {
        setIsOpen(true);
    }
  }, [initialParticipantId]);

  useEffect(() => {
    if (initialParticipantId && isOpen) {
        console.log("💬 ChatWidget: Starting conversation with:", initialParticipantId);
        const startConv = async () => {
            setLoading(true);
            try {
                const resp = await api.post('/messages/start', { participantId: initialParticipantId });
                console.log("✅ ChatWidget: Conversation started/found:", resp.data.id);
                const conv = resp.data;
                // Add to list if not there
                setConversations(prev => {
                    const exists = prev.find(c => c.id === conv.id);
                    return exists ? prev : [conv, ...prev];
                });
                setSelectedConv(conv);
            } catch (err: any) {
                console.error("❌ ChatWidget: Start Conv Error DETAILS:", {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                });
                alert(`Failed to start conversation: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        startConv();
    }
  }, [initialParticipantId, isOpen]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConv) {
        const fetchMessages = async () => {
            setMsgLoading(true);
            try {
                const resp = await api.get(`/messages/${selectedConv.id}`);
                setMessages(resp.data);
            } catch (err) {
                console.error("Fetch Messages Error:", err);
            } finally {
                setMsgLoading(false);
            }
        };
        fetchMessages();
    }
  }, [selectedConv]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const resp = await api.post(`/messages/${selectedConv.id}`, { content });
      setMessages(prev => [...prev, resp.data]);
    } catch (err) {
      console.error("Send Message Error:", err);
    }
  };

  const getOtherParticipant = (conv: any) => {
    return conv.participants?.find((p: any) => p.id !== currentUser?.id) || conv.participants?.[0];
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 z-[500]"
      >
        <MessageSquare size={28} />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[500] animate-in slide-in-from-bottom-10 duration-500">
      
      {/* Header */}
      <div className="p-6 bg-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedConv ? (
             <button onClick={() => setSelectedConv(null)} className="mr-2 hover:bg-white/10 p-1 rounded-lg">
                <X size={18} className="rotate-45" /> {/* Back button logic */}
             </button>
          ) : (
            <MessageSquare size={20} />
          )}
          <h3 className="font-black italic tracking-tight">
            {selectedConv ? getOtherParticipant(selectedConv)?.profile?.name || 'Chat' : 'Recent Chats'}
          </h3>
        </div>
        <button onClick={() => { setIsOpen(false); if(onClose) onClose(); }} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" />
        </div>
      ) : selectedConv ? (
        /* Chat View */
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {msgLoading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-200" /></div>
            ) : messages.length > 0 ? messages.map((m) => {
              const isMe = m.senderId === currentUser?.id;
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none'} p-3 shadow-sm`}>
                    <p className="text-sm font-bold">{m.content}</p>
                    <div className={`text-[8px] mt-1 font-black uppercase text-right opacity-60`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            }) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <History size={32} className="mb-2 opacity-30" />
                    <p className="text-[10px] uppercase font-black tracking-widest italic">No messages yet</p>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button type="submit" className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50" disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </>
      ) : (
        /* Conversations List */
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length > 0 ? conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const lastMsg = conv.messages?.[0];
                return (
                    <button 
                        key={conv.id}
                        onClick={() => setSelectedConv(conv)}
                        className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all text-left group"
                    >
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black italic shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {(other?.profile?.name || other?.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate tracking-tight">{other?.profile?.name || other?.email.split('@')[0]}</h4>
                            <p className="text-[10px] text-slate-400 truncate font-medium">{lastMsg?.content || 'Started a chat'}</p>
                        </div>
                    </button>
                );
            }) : (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-30">
                    <Search size={48} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em]">No active chats</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
