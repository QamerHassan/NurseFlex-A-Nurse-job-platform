'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MessageSquare, ChevronDown, MoreVertical,
    Send, Paperclip, Smile, Loader2,
    Search, ShieldCheck, Zap, History, X, User, ArrowRight,
    Circle, Info
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";

export default function MessagesPage() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const convRes = await api.get('/messages/conversations');
                setConversations(convRes.data);
                if (convRes.data.length > 0) {
                    setSelectedConversation(convRes.data[0]);
                    fetchMessages(convRes.data[0].id);
                }
            } catch (err: any) {
                console.error("❌ Failed to fetch conversations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const fetchMessages = async (convId: string) => {
        try {
            const res = await api.get(`/messages/${convId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || sending) return;
        setSending(true);
        try {
            await api.post(`/messages/${selectedConversation.id}`, { content: newMessage });
            setNewMessage('');
            await fetchMessages(selectedConversation.id);
        } catch (err) {
            console.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const currentUserId = (session?.user as any)?.id;

    return (
        <div className="h-[calc(100vh-72px)] bg-white flex overflow-hidden">
            {/* INBOX LIST */}
            <aside className="w-[320px] md:w-[400px] bg-white border-r border-slate-200 flex flex-col relative z-20">
                <header className="p-6 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-900 mb-6">Messages</h1>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input placeholder="Search messages" className="h-10 pl-10 bg-slate-50 border-slate-200 rounded-md font-medium text-slate-900 focus-visible:ring-1 focus-visible:ring-[#ec4899] transition-all" />
                    </div>
                </header>

                <ScrollArea className="flex-1">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex gap-3">
                                    <div className="h-12 w-12 rounded-md bg-slate-50 animate-pulse" />
                                    <div className="flex-1 space-y-2 pt-1">
                                        <div className="h-4 w-3/4 bg-slate-50 animate-pulse" />
                                        <div className="h-3 w-1/2 bg-slate-50 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : conversations.length > 0 ? (
                        <div className="">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv);
                                        fetchMessages(conv.id);
                                    }}
                                    className={`w-full p-4 text-left flex gap-4 transition-all ${selectedConversation?.id === conv.id ? 'bg-pink-50/50 border-l-4 border-pink-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                                >
                                    <Avatar className="h-12 w-12 rounded-md shadow-sm">
                                        <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">{conv.employerName?.[0] || 'E'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <span className="font-bold text-slate-900 truncate text-sm">{conv.employerName || "Employer"}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                                        </div>
                                        <p className={`text-xs truncate ${selectedConversation?.id === conv.id ? 'text-slate-900 font-semibold' : 'text-slate-500 font-normal'}`}>
                                            {conv.messages?.[0]?.content || "Start a conversation..."}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center opacity-40">
                            <MessageSquare size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-sm font-bold text-slate-400">No messages yet</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t border-slate-200 text-center">
                    <Button variant="link" className="text-xs font-bold text-[#ec4899] hover:underline">Manage preferences</Button>
                </div>
            </aside>

            {/* CHAT AREA */}
            <main className="flex-1 bg-white flex flex-col relative">
                {selectedConversation ? (
                    <div className="flex flex-col h-full">
                        {/* HEADER */}
                        <header className="px-6 h-[72px] border-b border-slate-200 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 rounded-md">
                                    <AvatarFallback className="bg-pink-600 text-white font-bold">{selectedConversation.employerName?.[0] || 'E'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 leading-none">{selectedConversation.employerName || "Employer"}</h3>
                                    <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                                        <Circle className="fill-emerald-600" size={8} /> Active now
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900">
                                    <Info size={20} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900">
                                    <MoreVertical size={20} />
                                </Button>
                            </div>
                        </header>

                        {/* MESSAGES */}
                        <ScrollArea className="flex-1 bg-slate-50/20">
                            <div className="p-6 space-y-6">
                                {messages.length > 0 ? messages.map((msg) => {
                                    const isOwn = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                                            <div className={`p-4 rounded-xl text-sm max-w-[70%] shadow-sm ${isOwn 
                                                ? 'bg-pink-600 text-white rounded-br-none' 
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                            }`}>
                                                {msg.content}
                                                <div className={`text-[9px] mt-2 font-medium ${isOwn ? 'text-pink-100' : 'text-slate-400'}`}>12:45 PM</div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
                                        <MessageSquare size={48} className="text-slate-300 mb-4" />
                                        <p className="text-sm font-bold text-slate-400">No messages in this chat yet</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* INPUT */}
                        <footer className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-end gap-2 max-w-4xl mx-auto">
                                <div className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl flex flex-col focus-within:border-[#2557a7] transition-all overflow-hidden">
                                     <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Type a message"
                                        className="w-full p-4 bg-transparent border-none outline-none font-medium text-slate-900 placeholder:text-slate-400 resize-none min-h-[56px] max-h-32 text-sm"
                                    />
                                    <div className="flex items-center justify-between p-2 border-t border-slate-100 bg-slate-50/50">
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-white">
                                                <Paperclip size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-white">
                                                <Smile size={18} />
                                            </Button>
                                        </div>
                                        <Button 
                                            onClick={handleSendMessage}
                                            disabled={sending || !newMessage.trim()}
                                            className="h-8 px-4 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-none"
                                        >
                                            {sending ? <Loader2 className="animate-spin h-3 w-3" /> : 'Send'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-12">
                         <div className="text-center max-w-sm">
                            <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6">
                                <MessageSquare size={32} className="text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Select a conversation</h2>
                            <p className="text-sm text-slate-500 mb-8">Choose an employer from the list on the left to view your history and start chatting.</p>
                            <Button asChild variant="outline" className="border-[#2557a7] text-[#2557a7] font-bold hover:bg-pink-50">
                                <Link href="/dashboard">Back to job search</Link>
                            </Button>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-100 rounded ${className}`} />;
}
