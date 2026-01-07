'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { mockApiClient } from '@/lib/mockApi';
import type { Conversation, Message } from '@/types/api';

function MessagesInner() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConvId) ?? null,
    [conversations, selectedConvId]
  );

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoading(true);
        const convs = await mockApiClient.getConversations(user.id);
        setConversations(convs);

        const userIdFromQuery = searchParams.get('userId');
        if (userIdFromQuery) {
          const ensured = await mockApiClient.ensureConversation(user.id, userIdFromQuery);
          // Put ensured conversation on top (dedupe)
          setConversations((prev) => {
            const without = prev.filter((c) => c.id !== ensured.id);
            return [ensured, ...without];
          });
          setSelectedConvId(ensured.id);
        } else if (convs.length > 0) {
          setSelectedConvId(convs[0].id);
        }
      } catch (e) {
        console.error('Failed to load conversations', e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user || !selectedConvId) return;

    (async () => {
      try {
        setLoadingMsgs(true);
        const items = await mockApiClient.getMessages(selectedConvId, user.id);
        setMessages(items);

        // Clear unread for that convo
        setConversations((prev) => prev.map((c) => (c.id === selectedConvId ? { ...c, unreadCount: 0 } : c)));
      } catch (e) {
        console.error('Failed to load messages', e);
      } finally {
        setLoadingMsgs(false);
      }
    })();
  }, [selectedConvId, user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  const handleSend = async () => {
    if (!user || !selectedConvId) return;
    const content = draft.trim();
    if (!content) return;

    try {
      setSending(true);
      const m = await mockApiClient.sendMessage({ conversationId: selectedConvId, senderId: user.id, content });

      setMessages((prev) => [...prev, m]);
      setDraft('');

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConvId ? { ...c, lastMessage: m.content, lastMessageAt: m.createdAt } : c
        )
      );
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Left: conversations */}
        <div className="col-span-12 md:col-span-4 card overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-white pb-2">Conversations</h2>

          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No conversations yet.</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedConvId === conv.id ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {conv.participantName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.participantName}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full min-w-5 h-5 px-2 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.participantHeadline}</p>
                      {conv.lastMessage && <p className="text-sm text-gray-600 truncate mt-1">{conv.lastMessage}</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: messages */}
        <div className="col-span-12 md:col-span-8 card flex flex-col">
          {selectedConversation ? (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.participantName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">{selectedConversation.participantName}</h2>
                    <p className="text-sm text-gray-500">{selectedConversation.participantHeadline}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {loadingMsgs ? (
                  <div className="text-sm text-gray-500">Loading messages...</div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="input-field"
                  disabled={sending}
                />
                <button onClick={handleSend} disabled={!draft.trim() || sending} className="btn-primary">
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>}>
      <MessagesInner />
    </Suspense>
  );
}
