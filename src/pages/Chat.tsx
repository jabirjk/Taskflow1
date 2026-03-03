import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Image, Smile, Phone, Video, MoreVertical, Search, CheckCheck, ArrowLeft, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { Booking } from '../types';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        .then(setMessages);

      const messageHandler = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
      };

      socket.on('message', messageHandler);

      return () => {
        socket.off('message', messageHandler);
      };
    }
  }, [activeBooking, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeBooking || !socket) return;

    socket.emit('message', {
      roomId: activeBooking.id,
      senderId: user.id,
      content: inputText
    });

    setInputText('');
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
              <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={activeBooking.other_party_avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover" alt={activeBooking.other_party_name} />
                  <div>
                    <h3 className="font-bold text-lg">{activeBooking.other_party_name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-slate-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><Phone className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><Video className="w-5 h-5" /></button>
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400`}>
                          {format(new Date(msg.created_at), 'h:mm a')}
                          {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1 px-2">
                    <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Smile className="w-5 h-5" /></button>
                    <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Image className="w-5 h-5" /></button>
                  </div>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent py-2 outline-none text-slate-700"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
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
