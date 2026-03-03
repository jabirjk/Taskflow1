import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Image, Smile, Phone, Video, MoreVertical, Search, CheckCheck, ArrowLeft, MessageSquare, Mic, Paperclip, Lock, Sparkles, Languages, FileText, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { Booking } from '../types';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'voice';
  file_url?: string;
  is_read?: boolean;
  translated_content?: string;
  is_encrypted?: boolean;
  created_at: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherPartyTyping, setOtherPartyTyping] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          if (data.length > 0) setActiveBooking(data[0]);
        });
    }

    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    if (activeBooking && socket) {
      socket.emit('join_room', activeBooking.id);
      
      // Fetch history
      fetch(`/api/messages/${activeBooking.id}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data);
          // Mark unread messages as read
          data.forEach((msg: Message) => {
            if (msg.sender_id !== user?.id && !msg.is_read) {
              socket.emit('read_receipt', { roomId: activeBooking.id, messageId: msg.id, readerId: user?.id });
            }
          });
        });

      const messageHandler = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
        if (msg.sender_id !== user?.id) {
          socket.emit('read_receipt', { roomId: activeBooking.id, messageId: msg.id, readerId: user?.id });
        }
      };

      const typingHandler = (data: { senderId: string, isTyping: boolean }) => {
        if (data.senderId !== user?.id) {
          setOtherPartyTyping(data.isTyping);
        }
      };

      const readReceiptHandler = (data: { messageId: string, readerId: string }) => {
        setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, is_read: true } : m));
      };

      socket.on('message', messageHandler);
      socket.on('typing', typingHandler);
      socket.on('read_receipt', readReceiptHandler);

      return () => {
        socket.off('message', messageHandler);
        socket.off('typing', typingHandler);
        socket.off('read_receipt', readReceiptHandler);
      };
    }
  }, [activeBooking, socket, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, otherPartyTyping]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!isTyping && socket && activeBooking && user) {
      setIsTyping(true);
      socket.emit('typing', { roomId: activeBooking.id, senderId: user.id, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket && activeBooking && user) {
        socket.emit('typing', { roomId: activeBooking.id, senderId: user.id, isTyping: false });
      }
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeBooking || !socket) return;

    socket.emit('message', {
      roomId: activeBooking.id,
      senderId: user.id,
      content: inputText,
      type: 'text'
    });

    setInputText('');
    setIsTyping(false);
    socket.emit('typing', { roomId: activeBooking.id, senderId: user.id, isTyping: false });
  };

  const simulateAttachment = (type: 'image' | 'file' | 'voice') => {
    if (!user || !activeBooking || !socket) return;
    
    let content = '';
    let fileUrl = '';
    
    if (type === 'image') {
      content = 'Sent an image';
      fileUrl = 'https://picsum.photos/seed/chat/400/300';
    } else if (type === 'file') {
      content = 'Sent a file: document.pdf';
      fileUrl = '#';
    } else if (type === 'voice') {
      content = 'Sent a voice note (0:15)';
      fileUrl = '#';
    }

    socket.emit('message', {
      roomId: activeBooking.id,
      senderId: user.id,
      content,
      type,
      fileUrl
    });
  };

  const handleSummarize = async () => {
    if (!activeBooking) return;
    setIsSummarizing(true);
    try {
      const res = await fetch(`/api/messages/${activeBooking.id}/summarize`, { method: 'POST' });
      const data = await res.json();
      setSummary(data.summary);
    } catch (e) {
      console.error(e);
    }
    setIsSummarizing(false);
  };

  const handleTranslate = async (msgId: string) => {
    try {
      const res = await fetch(`/api/messages/${msgId}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLanguage: 'Spanish' }) // Hardcoded for demo
      });
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translated_content: data.translated_content } : m));
    } catch (e) {
      console.error(e);
    }
  };


  if (!user) return null;

  return (
    <div className="container mx-auto px-6 py-8 h-[calc(100vh-120px)]">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 h-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-100 space-y-4">
            <h2 className="text-2xl font-bold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {bookings.map(booking => (
              <div 
                key={booking.id} 
                onClick={() => setActiveBooking(booking)}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${activeBooking?.id === booking.id ? 'bg-emerald-50/50 border-r-4 border-emerald-500' : ''}`}
              >
                <div className="relative">
                  <img src={booking.other_party_avatar} className="w-12 h-12 rounded-2xl object-cover" alt={booking.other_party_name} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold truncate">{booking.other_party_name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {format(new Date(booking.scheduled_at), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{booking.task_title}</p>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="p-12 text-center text-slate-400 font-bold text-sm">
                No active chats.
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {activeBooking ? (
            <>
              {/* Header */}
              <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={activeBooking.other_party_avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover" alt={activeBooking.other_party_name} />
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{activeBooking.other_party_name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-slate-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSummarize} className="p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-all flex items-center gap-2" title="AI Summarize">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold hidden md:inline">Summarize</span>
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><Phone className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><Video className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-all"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 dark:bg-slate-950">
                <div className="flex justify-center">
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Lock className="w-3 h-3" /> End-to-End Encrypted
                  </div>
                </div>

                {summary && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl relative">
                    <button onClick={() => setSummary(null)} className="absolute top-2 right-2 text-emerald-600/50 hover:text-emerald-600"><X className="w-4 h-4" /></button>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                      <Sparkles className="w-4 h-4" /> AI Summary
                    </div>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">{summary}</p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl shadow-sm relative ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'}`}>
                          
                          {msg.type === 'image' && msg.file_url && (
                            <img src={msg.file_url} alt="Attachment" className="w-full max-w-sm rounded-xl mb-2" />
                          )}
                          {msg.type === 'file' && (
                            <div className="flex items-center gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-xl mb-2">
                              <FileText className="w-6 h-6" />
                              <span className="text-sm font-medium truncate">document.pdf</span>
                            </div>
                          )}
                          {msg.type === 'voice' && (
                            <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-full mb-2 pr-4">
                              <button className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                                <Play className="w-4 h-4 ml-0.5" />
                              </button>
                              <div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
                              </div>
                              <span className="text-xs font-bold">0:15</span>
                            </div>
                          )}

                          <p>{msg.content}</p>
                          
                          {msg.translated_content && (
                            <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-sm opacity-90">
                              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest mb-1">
                                <Languages className="w-3 h-3" /> Translated
                              </div>
                              {msg.translated_content}
                            </div>
                          )}

                          {!isMe && !msg.translated_content && msg.type === 'text' && (
                            <button 
                              onClick={() => handleTranslate(msg.id)}
                              className="absolute top-1/2 -translate-y-1/2 -right-10 p-1.5 text-slate-300 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Translate"
                            >
                              <Languages className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400`}>
                          {format(new Date(msg.created_at), 'h:mm a')}
                          {isMe && (
                            <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-emerald-500' : 'text-slate-300'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {otherPartyTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 px-2">
                    <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Smile className="w-5 h-5" /></button>
                    <button type="button" onClick={() => simulateAttachment('image')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Image className="w-5 h-5" /></button>
                    <button type="button" onClick={() => simulateAttachment('file')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                    <button type="button" onClick={() => simulateAttachment('voice')} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Mic className="w-5 h-5" /></button>
                  </div>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent py-2 outline-none text-slate-700 dark:text-slate-200"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold">Select a conversation</h3>
              <p className="text-slate-500 max-w-xs">Connect with your clients or taskers to coordinate your tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
