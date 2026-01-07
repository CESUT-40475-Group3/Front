'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { mockApiClient } from '@/lib/mockApi';
import type { Connection } from '@/types/api';
import { UserPlus, Check, X, MessageCircle, UserMinus } from 'lucide-react';

export default function NetworkPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filter, setFilter] = useState<'all' | 'connected' | 'pending' | 'sent'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchConnections();
  }, [user]);

  const fetchConnections = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await mockApiClient.getConnections(user.id);
      setConnections(data);
    } catch (err) {
      setError('Failed to load connections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    if (!user) return;
    try {
      await mockApiClient.acceptConnection(user.id, id);
      setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'connected' } : c)));
    } catch (err: any) {
      alert(err.message || 'Failed to accept connection');
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return;
    try {
      await mockApiClient.rejectConnection(user.id, id);
      setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c)));
    } catch (err: any) {
      alert(err.message || 'Failed to reject connection');
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    if (!user) return;
    try {
      await mockApiClient.cancelConnection(user.id, id);
      setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'cancelled' } : c)));
    } catch (err: any) {
      alert(err.message || 'Failed to cancel connection');
      console.error(err);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to disconnect?')) return;
    try {
      await mockApiClient.disconnectUser(user.id, id);
      setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'cancelled' } : c)));
    } catch (err: any) {
      alert(err.message || 'Failed to disconnect');
      console.error(err);
    }
  };

  const filteredConnections = connections.filter((c) => {
    if (filter === 'all') return c.status === 'connected' || c.status === 'pending';
    if (filter === 'connected') return c.status === 'connected';
    if (filter === 'pending') return c.status === 'pending' && c.receiverId === user?.id;
    if (filter === 'sent') return c.status === 'pending' && c.requesterId === user?.id;
    return false;
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Network</h1>
        <p className="text-gray-600">Manage your professional connections</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="card mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 px-1 font-medium transition-colors ${
              filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({connections.filter((c) => c.status === 'connected' || c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('connected')}
            className={`pb-3 px-1 font-medium transition-colors ${
              filter === 'connected' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Connected ({connections.filter((c) => c.status === 'connected').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`pb-3 px-1 font-medium transition-colors ${
              filter === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received ({connections.filter((c) => c.status === 'pending' && c.receiverId === user?.id).length})
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`pb-3 px-1 font-medium transition-colors ${
              filter === 'sent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({connections.filter((c) => c.status === 'pending' && c.requesterId === user?.id).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConnections.map((c) => {
          const isReceiver = c.receiverId === user?.id;
          const isRequester = c.requesterId === user?.id;

          return (
            <div key={c.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {c.otherName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{c.otherName}</h3>
                    <p className="text-gray-600">{c.otherHeadline}</p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === 'connected'
                          ? 'bg-green-100 text-green-700'
                          : c.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {c.status === 'connected' ? 'Connected' : c.status === 'pending' ? (isReceiver ? 'Pending (Received)' : 'Pending (Sent)') : 'Cancelled'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {c.status === 'pending' && isReceiver && (
                    <>
                      <button onClick={() => handleAccept(c.id)} className="btn-primary flex items-center gap-2">
                        <Check size={16} />
                        Accept
                      </button>
                      <button onClick={() => handleReject(c.id)} className="btn-secondary flex items-center gap-2">
                        <X size={16} />
                        Decline
                      </button>
                    </>
                  )}

                  {c.status === 'pending' && isRequester && (
                    <button onClick={() => handleCancel(c.id)} className="btn-secondary flex items-center gap-2">
                      <X size={16} />
                      Cancel
                    </button>
                  )}

                  {c.status === 'connected' && (
                    <>
                      <button onClick={() => router.push(`/messages?userId=${c.otherUserId}`)} className="btn-primary flex items-center gap-2">
                        <MessageCircle size={16} />
                        Message
                      </button>
                      <button onClick={() => handleDisconnect(c.id)} className="btn-secondary flex items-center gap-2">
                        <UserMinus size={16} />
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredConnections.length === 0 && <div className="text-center py-12 text-gray-500">No connections found.</div>}
      </div>
    </div>
  );
}
