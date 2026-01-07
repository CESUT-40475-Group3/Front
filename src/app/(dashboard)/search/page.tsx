'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { mockApiClient } from '@/lib/mockApi';
import type { SearchResult } from '@/types/api';
import { UserPlus, MessageCircle, Check, Clock } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery.trim() && user) performSearch();
      else setResults([]);
    }, 400);

    return () => clearTimeout(t);
  }, [searchQuery, user]);

  const performSearch = async () => {
    if (!user) return;
    try {
      setError('');
      setLoading(true);
      const data = await mockApiClient.searchUsers(user.id, searchQuery);
      setResults(data);
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    if (!user) return;
    try {
      await mockApiClient.sendConnectionRequest(user.id, userId);
      setResults((prev) => prev.map((r) => (r.id === userId ? { ...r, connectionStatus: 'pending' } : r)));
    } catch (err: any) {
      alert(err.message || 'Failed to send connection request');
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Professionals</h1>
        <p className="text-gray-600">Find and connect with professionals in your field</p>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, or skills..."
            className="input-field pl-12"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {loading && <div className="text-center py-8 text-gray-500">Searching...</div>}

      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {r.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{r.name}</h3>
                  <p className="text-gray-600">{r.headline}</p>
                  <p className="text-sm text-gray-500 mt-1">{r.location}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {r.connectionStatus === 'connected' ? (
                  <>
                    <button onClick={() => router.push(`/messages?userId=${r.id}`)} className="btn-primary flex items-center gap-2">
                      <MessageCircle size={16} />
                      Message
                    </button>
                    <button className="btn-secondary flex items-center gap-2" disabled>
                      <Check size={16} />
                      Connected
                    </button>
                  </>
                ) : r.connectionStatus === 'pending' ? (
                  <button className="btn-secondary flex items-center gap-2" disabled>
                    <Clock size={16} />
                    Pending
                  </button>
                ) : (
                  <button onClick={() => handleConnect(r.id)} className="btn-primary flex items-center gap-2">
                    <UserPlus size={16} />
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && searchQuery && <div className="text-center py-12 text-gray-500">No results found.</div>}
      </div>
    </div>
  );
}
