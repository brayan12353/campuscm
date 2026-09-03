import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { timeAgo } from '@/utils/format';
import type { Conversation, Message } from '@/types';
import { cn, generateId } from '@/utils/format';

export function Messages() {
  const { conversations, currentUser } = useApp();
  const [active, setActive] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!input.trim() || !active) return;
    const msg: Message = { id: generateId(), conversationId: active.id, senderId: currentUser?.id || 'me', text: input.trim(), timestamp: new Date().toISOString(), read: false };
    setLocalMessages((prev) => [...prev, msg]);
    setInput('');
  };

  const getMessages = (conv: Conversation) => {
    return [...conv.messages, ...localMessages.filter((m) => m.conversationId === conv.id)];
  };

  if (conversations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        <EmptyState icon={<MessageSquare size={48} />} title="Aucune conversation" description="Vos conversations apparaîtront ici lorsque vous contacterez un vendeur." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ minHeight: 480 }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={cn('w-full sm:w-80 border-r border-gray-100 flex-shrink-0', active && 'hidden sm:block')}>
            {conversations.map((conv) => (
              <button key={conv.id} onClick={() => setActive(conv)} className={cn('w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left', active?.id === conv.id && 'bg-primary-50')}>
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-primary-100 shrink-0">
                  {conv.participantAvatar ? <img src={conv.participantAvatar} alt={conv.participantName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary-600">{conv.participantName.charAt(0)}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900 truncate">{conv.participantName}</p>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(conv.lastMessageTime)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">{conv.unread}</span>}
              </button>
            ))}
          </div>

          {/* Message area */}
          <div className={cn('flex-1 flex flex-col', !active && 'hidden sm:flex')}>
            {active ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <button className="sm:hidden text-gray-500 mr-1" onClick={() => setActive(null)}>←</button>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary-100 shrink-0">
                    {active.participantAvatar ? <img src={active.participantAvatar} alt={active.participantName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-primary-600 text-sm">{active.participantName.charAt(0)}</div>}
                  </div>
                  <p className="font-semibold text-gray-900">{active.participantName}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {getMessages(active).map((msg) => {
                    const isMe = msg.senderId === (currentUser?.id || 'me') || msg.senderId === 'me';
                    return (
                      <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-xs rounded-2xl px-4 py-2.5 text-sm', isMe ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md')}>
                          {msg.text}
                          <p className={cn('text-[10px] mt-1', isMe ? 'text-primary-200' : 'text-gray-400')}>{timeAgo(msg.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 p-4 border-t border-gray-100">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Écrire un message..." className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50">
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState icon={<MessageSquare size={40} />} title="Sélectionnez une conversation" description="Choisissez une conversation pour commencer à discuter." />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
