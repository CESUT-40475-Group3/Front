// src/app/(dashboard)/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { mockApiClient } from '@/lib/mockApi';
import { AdminUser, AdminStats } from '@/types/api';

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/feed');
      return;
    }
    fetchAdminData();
  }, [user, router]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        mockApiClient.getAdminUsers(),
        mockApiClient.getAdminStats(),
      ]);

      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await mockApiClient.updateUserStatus(userId, newStatus);

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, status: newStatus as 'active' | 'inactive' } : u
        )
      );
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  if (user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and platform settings</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.activeUsers ?? 0}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalPosts ?? 0}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Join Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4 text-gray-600">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.status)}
                    className={`text-sm font-medium ${
                      user.status === 'active'
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
