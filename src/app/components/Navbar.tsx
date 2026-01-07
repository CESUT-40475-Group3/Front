'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Home, Users, MessageCircle, Search, Shield, LogOut } from 'lucide-react';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/feed" className="text-xl font-bold text-blue-600">
              ProNetwork
            </Link>

            <div className="flex space-x-6">
              <Link href="/feed" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <Home size={18} />
                Feed
              </Link>
              <Link href="/network" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <Users size={18} />
                My Network
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <MessageCircle size={18} />
                Messages
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                <Search size={18} />
                Search
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                  <Shield size={18} />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              {user?.name}
            </Link>
            <button onClick={logout} className="btn-secondary flex items-center gap-2">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
