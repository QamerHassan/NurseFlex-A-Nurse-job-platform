'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    MessageSquare, MoreVertical, Send, Paperclip,
    Smile, Loader2, Search, Info, X, RefreshCw
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
    return (name || 'E').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatTime(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = 16 }: { w?: string; h?: number }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: 8,
            background: 'linear-gradient(90deg, rgba(20,184,166,0.08), rgba(16,185,129,0.06), rgba(20,184,166,0.08))',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite'
        }} />
    );
}

// ─── Avatar gradient by index ─────────────────────────────────────────────────
const gradients = [
    'linear-gradient(135deg, #14b8a6, #10b981)',
    'linear-gradient(135deg, #2563eb, #14b8a6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #0ea5e9, #2563eb)',
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConv, setSelectedConv]   = useState<any>(null);
    const [messages, setMessages]           = useState<any[]>([]);
    const [loading, setLoading]             = useState(true);
    const [msgLoading, setMsgLoading]       = useState(false);
    const [newMessage, setNewMessage]       = useState('');
    const [sending, setSending]             = useState(false);
    const [search, setSearch]               = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const currentUserId = (session?.user as any)?.id;

    useEffect(() => {
        const init = async () => {
            try {
                const res = await api.get('/messages/conversations');
                const convs = Array.isArray(res.data) ? res.data : [];
                setConversations(convs);
                if (convs.length > 0) {
                    setSelectedConv(convs[0]);
                    await fetchMessages(convs[0].id);
                }
            } catch (err) {
                console.error('Fetch conversations failed:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async (convId: string) => {
        setMsgLoading(true);
        try {
            const res = await api.get(`/messages/${convId}`);
            setMessages(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Fetch messages failed:', err);
        } finally {
            setMsgLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv || sending) return;
        setSending(true);
        try {
            await api.post(`/messages/${selectedConv.id}`, { content: newMessage });
            setNewMessage('');
            await fetchMessages(selectedConv.id);
        } catch (err) {
            console.error('Send failed:', err);
        } finally {
            setSending(false);
        }
    };

    const filteredConvs = conversations.filter(c =>
        (c.employerName || '').toLowerCase().includes(search.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{
            height: 'calc(100vh - 72px)', display: 'flex', overflow: 'hidden',
            background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif",
            position: 'relative'
        }}>

            {/* ── Ambient blobs ── */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-5%', right: '20%', width: '30%', height: '40%', background: 'radial-gradient(ellipse, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: '25%', height: '30%', background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            {/* ════════════ SIDEBAR ════════════ */}
            <aside style={{
                width: 340, minWidth: 280, flexShrink: 0,
                background: 'white', borderRight: '1px solid rgba(20,184,166,0.1)',
                display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2
            }}>
                {/* Header */}
                <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(20,184,166,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(20,184,166,0.35)'
                        }}>
                            <MessageSquare size={16} style={{ color: 'white' }} />
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Messages</h1>
                        <span style={{
                            marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                            background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(16,185,129,0.12))',
                            color: '#0d9488', padding: '3px 10px', borderRadius: 20,
                            border: '1px solid rgba(20,184,166,0.2)'
                        }}>{conversations.length}</span>
                    </div>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(20,184,166,0.6)', pointerEvents: 'none' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search conversations…"
                            style={{
                                width: '100%', height: 40, borderRadius: 12, paddingLeft: 36, paddingRight: 12,
                                background: 'rgba(20,184,166,0.04)', border: '1px solid rgba(20,184,166,0.12)',
                                fontSize: 13, fontWeight: 500, color: '#0f172a', outline: 'none',
                                fontFamily: 'inherit', boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(20,184,166,0.08)', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <Skeleton w="60%" h={12} />
                                        <Skeleton w="80%" h={10} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredConvs.length === 0 ? (
                        <div style={{ padding: '48px 20px', textAlign: 'center', opacity: 0.5 }}>
                            <MessageSquare size={36} style={{ color: '#14b8a6', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>No conversations yet</p>
                        </div>
                    ) : filteredConvs.map((conv, idx) => {
                        const active = selectedConv?.id === conv.id;
                        return (
                            <button
                                key={conv.id}
                                onClick={() => { setSelectedConv(conv); fetchMessages(conv.id); }}
                                style={{
                                    width: '100%', padding: '14px 20px', textAlign: 'left', border: 'none', cursor: 'pointer',
                                    display: 'flex', gap: 12, alignItems: 'center',
                                    background: active ? 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(16,185,129,0.05))' : 'transparent',
                                    borderLeft: `3px solid ${active ? '#14b8a6' : 'transparent'}`,
                                    transition: 'all 0.15s',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                                    background: gradients[idx % gradients.length],
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 800, fontSize: 14,
                                    boxShadow: active ? '0 4px 12px rgba(20,184,166,0.3)' : 'none'
                                }}>{initials(conv.employerName)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {conv.employerName || 'Employer'}
                                        </span>
                                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
                                            {conv.messages?.[0]?.createdAt ? formatTime(conv.messages[0].createdAt) : 'Just now'}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: 12, color: active ? '#0d9488' : '#94a3b8',
                                        fontWeight: active ? 600 : 400,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {conv.messages?.[0]?.content || 'Start a conversation…'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(20,184,166,0.08)', textAlign: 'center' }}>
                    <button style={{ fontSize: 11, fontWeight: 700, color: '#14b8a6', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Manage preferences
                    </button>
                </div>
            </aside>

            {/* ════════════ CHAT AREA ════════════ */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            height: 72, padding: '0 24px', borderBottom: '1px solid rgba(20,184,166,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'white', flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                                    background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 800, fontSize: 15,
                                    boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
                                }}>{initials(selectedConv.employerName)}</div>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>
                                        {selectedConv.employerName || 'Employer'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active now</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {[Info, MoreVertical].map((Icon, i) => (
                                    <button key={i} style={{
                                        width: 36, height: 36, borderRadius: 10, border: 'none', background: 'transparent',
                                        color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'background 0.15s'
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(20,184,166,0.08)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {msgLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                                            <div style={{ maxWidth: '60%' }}>
                                                <Skeleton w={`${140 + i * 40}px`} h={48} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, padding: '48px 0' }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 20, marginBottom: 16,
                                        background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.1))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MessageSquare size={28} style={{ color: '#14b8a6' }} />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>No messages yet</p>
                                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Send a message to start the conversation</p>
                                </div>
                            ) : messages.map((msg) => {
                                const isOwn = msg.senderId === currentUserId;
                                return (
                                    <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                                        {!isOwn && (
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 10, marginRight: 8, flexShrink: 0,
                                                background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 800, fontSize: 11, alignSelf: 'flex-end'
                                            }}>{initials(selectedConv.employerName)}</div>
                                        )}
                                        <div style={{
                                            maxWidth: '68%', padding: '12px 16px', borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: isOwn
                                                ? 'linear-gradient(135deg, #14b8a6, #10b981)'
                                                : 'white',
                                            color: isOwn ? 'white' : '#0f172a',
                                            fontSize: 13, fontWeight: 500, lineHeight: 1.5,
                                            boxShadow: isOwn
                                                ? '0 4px 16px rgba(20,184,166,0.3)'
                                                : '0 2px 8px rgba(0,0,0,0.06)',
                                            border: isOwn ? 'none' : '1px solid rgba(20,184,166,0.1)'
                                        }}>
                                            {msg.content}
                                            <div style={{
                                                fontSize: 9, marginTop: 6, fontWeight: 600,
                                                color: isOwn ? 'rgba(255,255,255,0.65)' : '#94a3b8',
                                                textAlign: 'right'
                                            }}>
                                                {msg.createdAt ? formatTime(msg.createdAt) : 'Just now'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '16px 24px', borderTop: '1px solid rgba(20,184,166,0.1)',
                            background: 'white', flexShrink: 0
                        }}>
                            <div style={{
                                display: 'flex', gap: 10, alignItems: 'flex-end',
                                background: 'rgba(20,184,166,0.04)',
                                border: '1px solid rgba(20,184,166,0.15)',
                                borderRadius: 20, padding: '4px 4px 4px 16px',
                                transition: 'border-color 0.2s'
                            }}
                                onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.5)')}
                                onBlurCapture={e => (e.currentTarget.style.borderColor = 'rgba(20,184,166,0.15)')}
                            >
                                {/* Attachment + Emoji */}
                                <div style={{ display: 'flex', gap: 2, alignSelf: 'flex-end', paddingBottom: 8 }}>
                                    {[Paperclip, Smile].map((Icon, i) => (
                                        <button key={i} style={{
                                            width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent',
                                            color: '#14b8a6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Icon size={16} />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                                    }}
                                    placeholder="Type a message…"
                                    rows={1}
                                    style={{
                                        flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                        fontSize: 13, fontWeight: 500, color: '#0f172a',
                                        resize: 'none', minHeight: 40, maxHeight: 120, lineHeight: '1.6',
                                        padding: '10px 0', fontFamily: 'inherit',
                                        alignSelf: 'flex-end'
                                    }}
                                />

                                <button
                                    onClick={handleSend}
                                    disabled={sending || !newMessage.trim()}
                                    style={{
                                        width: 40, height: 40, borderRadius: 14, border: 'none', cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
                                        background: sending || !newMessage.trim()
                                            ? 'rgba(20,184,166,0.2)'
                                            : 'linear-gradient(135deg, #14b8a6, #10b981)',
                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        boxShadow: sending || !newMessage.trim() ? 'none' : '0 4px 12px rgba(20,184,166,0.35)',
                                        transition: 'all 0.2s', alignSelf: 'flex-end', marginBottom: 4
                                    }}
                                >
                                    {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                                </button>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>
                                Press <kbd style={{ background: 'rgba(20,184,166,0.08)', color: '#0d9488', padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Enter</kbd> to send · <kbd style={{ background: 'rgba(20,184,166,0.08)', color: '#0d9488', padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>Shift+Enter</kbd> for new line
            </p>
                        </div>
                    </>
                ) : (
                    /* Empty state */
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 24, marginBottom: 24,
                            background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(16,185,129,0.08))',
                            border: '1px solid rgba(20,184,166,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MessageSquare size={36} style={{ color: '#14b8a6' }} />
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.01em' }}>
                            Select a conversation
                        </h2>
                        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', maxWidth: 300, marginBottom: 28, lineHeight: 1.6 }}>
                            Choose an employer from the list to view your conversation history and start chatting.
                        </p>
                        <Link href="/dashboard" style={{
                            padding: '11px 24px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                            background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                            color: 'white', textDecoration: 'none',
                            boxShadow: '0 4px 16px rgba(20,184,166,0.35)'
                        }}>
                            Back to Job Search
                        </Link>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin     { to { transform: rotate(360deg); } }
                @keyframes shimmer  { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
                @keyframes pulse    { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.2); border-radius: 2px; }
                textarea { scrollbar-width: thin; }
            `}</style>
        </div>
    );
}