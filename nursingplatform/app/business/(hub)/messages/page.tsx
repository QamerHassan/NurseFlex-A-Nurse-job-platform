"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
    Loader2, Send, Search, User, Check, CheckCheck, 
    Phone, Video, Info, MessageSquare, Zap, 
    ShieldCheck, ArrowRight, Paperclip, Smile,
    MoreVertical, History, X
} from 'lucide-react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";

export default function BusinessMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const resp = await api.get('/messages/conversations');
      setConversations(resp.data);
    } catch (err) {
      console.error("Fetch Conversations Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    setMsgLoading(true);
    try {
      const resp = await api.get(`/messages/${convId}`);
      setMessages(resp.data);
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const userStr = localStorage.getItem('business_user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    }
  }, [selectedConv]);

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
      setConversations(prev => prev.map(c => 
        c.id === selectedConv.id ? { ...c, messages: [resp.data] } : c
      ));
    } catch (err) {
      console.error("Send Message Error:", err);
    }
  };

  const getOtherParticipant = (conv: any) => {
    return conv.participants?.find((p: any) => p.id !== currentUser?.id) || conv.participants?.[0];
  };

  if (loading) return (
    <div className="h-[calc(100vh-200px)] flex gap-6 p-10">
        <div className="w-96 rounded-[2.5rem] bg-slate-50 animate-pulse" />
        <div className="flex-1 rounded-[2.5rem] bg-slate-50 animate-pulse" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white/50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl shadow-pink-50/50 animate-in fade-in duration-700">
      
      {/* INBOX LIST */}
      <aside className="w-96 bg-white border-r border-slate-50 flex flex-col relative z-20">
        <header className="p-8 pb-6 border-b border-slate-50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Messages</h1>
                    <p className="text-slate-500 font-medium text-[10px] uppercase tracking-tight mt-4">Chat with candidates</p>
                </div>
                <Badge variant="outline" className="h-6 px-3 rounded-full border-pink-100 text-[#ec4899] bg-pink-50/50 font-bold text-[9px]">Live Chat</Badge>
            </div>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-600 transition-colors" size={16} />
                <Input placeholder="Search conversations..." className="h-12 pl-12 bg-slate-50/50 border-slate-100 rounded-2xl font-bold text-slate-900 focus-visible:ring-0 focus-visible:bg-white transition-all" />
            </div>
        </header>

        <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-50">
                {conversations.length > 0 ? conversations.map((conv) => {
                    const other = getOtherParticipant(conv);
                    const lastMsg = conv.messages?.[0];
                    const isSelected = selectedConv?.id === conv.id;

                    return (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConv(conv)}
                            className={`w-full p-6 text-left flex gap-4 group transition-all duration-300 ${isSelected ? 'bg-white shadow-2xl shadow-pink-50 relative z-10 scale-[1.02]' : 'hover:bg-slate-50/50'}`}
                        >
                            <div className="relative">
                                <Avatar className={`h-14 w-14 rounded-2xl shadow-lg transition-transform group-hover:scale-105 duration-500 ring-2 ${isSelected ? 'ring-pink-500/20' : 'ring-transparent'}`}>
                                    <AvatarFallback className={`font-bold text-xl ${isSelected ? 'bg-slate-900 text-white' : 'bg-pink-50 text-pink-600 shadow-inner'}`}>
                                        {(other?.profile?.name || other?.email || '?')[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold truncate text-[13px] tracking-tight ${isSelected ? 'text-pink-600' : 'text-slate-900'}`}>{other?.profile?.name || other?.email.split('@')[0]}</span>
                                    <span className="text-[9px] text-slate-300 font-bold uppercase">
                                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                    </span>
                                </div>
                                <p className={`text-xs truncate tracking-tight transition-colors ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`}>
                                    {lastMsg ? lastMsg.content : "Start a conversation..."}
                                </p>
                            </div>
                            {isSelected && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-pink-600 rounded-r-full shadow-2xl shadow-pink-500/50"></div>
                            )}
                        </button>
                    );
                }) : (
                    <div className="p-12 text-center py-24 opacity-40">
                        <Zap size={40} className="mx-auto text-slate-200 mb-6" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                    </div>
                )}
            </div>
        </ScrollArea>
        <footer className="p-6 border-t border-slate-50 bg-slate-50/30">
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-bold text-slate-500 shadow-sm gap-2 uppercase text-[10px] tracking-widest">
                <History size={14} /> View Archive
            </Button>
        </footer>
      </aside>

      {/* CHAT MAIN */}
      <main className="flex-1 bg-white flex flex-col relative overflow-hidden">
        {selectedConv ? (
          <>
            {/* HEADER */}
            <header className="h-[88px] px-10 border-b border-slate-50 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <Avatar className="h-12 w-12 rounded-2xl shadow-2xl shadow-pink-100 ring-2 ring-white">
                        <AvatarFallback className="bg-slate-900 text-white font-bold">
                            {getOtherParticipant(selectedConv)?.profile?.name?.[0].toUpperCase() || 'N'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-2xl text-slate-900 tracking-tight leading-none">{getOtherParticipant(selectedConv)?.profile?.name || "Candidate"}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight leading-none">Healthy Connection</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-pink-600 hover:bg-pink-50">
                        <Phone size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-pink-600 hover:bg-pink-50">
                        <Video size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 ml-2">
                        <MoreVertical size={22} />
                    </Button>
                </div>
            </header>

            {/* MESSAGES */}
            <div className="flex-1 p-10 bg-slate-50/30 overflow-hidden">
              <ScrollArea className="h-full pr-6" type="scroll">
                <div className="space-y-12 pb-10">
                    <div className="flex justify-center mb-16 relative">
                        <Separator className="absolute top-1/2 left-0 w-full bg-slate-100" />
                        <Badge variant="outline" className="relative z-10 bg-white border-slate-100 text-[9px] font-black uppercase tracking-[0.4em] px-6 py-1.5 rounded-full text-slate-400">Messages • Today</Badge>
                    </div>

                    {msgLoading ? (
                        <div className="flex flex-col items-center justify-center h-48">
                            <Loader2 className="animate-spin text-pink-600" />
                        </div>
                    ) : messages.length > 0 ? messages.map((m) => {
                        const isMe = m.senderId === currentUser?.id;
                        return (
                          <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                                <div className={`p-6 rounded-[2.5rem] font-bold tracking-tight shadow-sm text-sm ${isMe 
                                    ? 'bg-slate-900 text-white rounded-br-none shadow-2xl shadow-slate-200' 
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
                                }`}>
                                    {m.content}
                                </div>
                                <div className={`mt-3 flex items-center gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isMe && <CheckCheck size={10} className="text-pink-500" />}
                                </div>
                            </div>
                          </div>
                        );
                    }) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-pink-50/50 mb-8 border border-slate-50">
                                <Zap size={40} className="text-pink-500 fill-pink-500 opacity-20" />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 tracking-tight">No Messages</h4>
                            <p className="text-slate-500 font-medium text-sm mt-4 max-w-xs leading-relaxed">Start the conversation by sending a message below.</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* INPUT */}
            <footer className="p-8 bg-white border-t border-slate-50">
              <form onSubmit={handleSendMessage} className="bg-slate-50 rounded-[2.5rem] p-2 flex items-center gap-3 border border-slate-100 focus-within:ring-8 focus-within:ring-pink-50/50 focus-within:bg-white focus-within:border-pink-600 transition-all duration-500">
                  <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-pink-600 hover:bg-white shrink-0">
                      <Paperclip size={20} />
                  </Button>
                  <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="border-none bg-transparent h-12 font-bold text-slate-900 placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                  />
                  <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full text-slate-400 hover:text-amber-500 hover:bg-white shrink-0">
                      <Smile size={20} />
                  </Button>
                  <Button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="h-12 w-12 rounded-full bg-slate-900 hover:bg-pink-600 text-white shadow-2xl transition-all duration-300 shrink-0"
                  >
                      <Send size={20} className="ml-0.5" />
                  </Button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]">
            <Card className="max-w-md w-full border-none shadow-2xl shadow-pink-50/50 rounded-[3rem] p-12 text-center bg-white/80 backdrop-blur-xl">
                <div className="w-24 h-24 bg-slate-900 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-pink-100 mx-auto mb-10 transition-transform hover:scale-105 duration-500">
                    <MessageSquare size={48} fill="white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Messages</h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-12">Select a conversation from the list to start messaging.</p>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <ShieldCheck className="mx-auto text-pink-600 mb-2" size={24} />
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Secure</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <Zap className="mx-auto text-amber-500 mb-2" size={24} />
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Real-time</p>
                    </div>
                </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
