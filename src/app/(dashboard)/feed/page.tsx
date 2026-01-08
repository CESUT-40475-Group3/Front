'use client'

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { mockApiClient } from '@/lib/mockApi';
import { Comment, Post } from '@/types/api';

export default function FeedPage() {
  const user = useAuthStore((s) => s.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [openCommentsFor, setOpenCommentsFor] = useState<Record<string, boolean>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await mockApiClient.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      setSubmitting(true);
      const created = await mockApiClient.createPost(user.id, newPost);
      setPosts((prev) => [created, ...prev]);
      setNewPost('');
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    try {
      const updated = await mockApiClient.toggleLikePost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: updated.likes, isLiked: updated.isLiked } : p)));
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const toggleComments = async (postId: string) => {
    const isOpen = !!openCommentsFor[postId];

    if (isOpen) {
      setOpenCommentsFor((m) => ({ ...m, [postId]: false }));
      return;
    }

    setOpenCommentsFor((m) => ({ ...m, [postId]: true }));

    if (commentsByPost[postId]) return;

    try {
      setLoadingComments((m) => ({ ...m, [postId]: true }));
      const items = await mockApiClient.getComments(postId);
      setCommentsByPost((m) => ({ ...m, [postId]: items }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments((m) => ({ ...m, [postId]: false }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) return;
    const content = (commentDraft[postId] ?? '').trim();
    if (!content) return;

    try {
      const created = await mockApiClient.addComment({ postId, authorId: user.id, content });

      setCommentsByPost((m) => ({
        ...m,
        [postId]: [...(m[postId] ?? []), created],
      }));

      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p)));

      setCommentDraft((m) => ({ ...m, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Create Post */}
      <div className="card mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              rows={3}
              disabled={submitting}
            />
            <div className="mt-3 flex justify-end">
              <button onClick={handleCreatePost} disabled={!newPost.trim() || submitting} className="btn-primary">
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                {post.authorName?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 leading-relaxed break-words">{post.content}</p>

                <div className="mt-4 flex items-center space-x-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center space-x-2 ${post.isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    <span className="text-sm font-medium">{post.isLiked ? 'Liked' : 'Like'}</span>
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>

                  <button onClick={() => toggleComments(post.id)} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span className="text-sm font-medium">Comments</span>
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>

                {openCommentsFor[post.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {loadingComments[post.id] ? (
                      <div className="text-sm text-gray-500">Loading comments...</div>
                    ) : (
                      <div className="space-y-3">
                        {(commentsByPost[post.id] ?? []).map((c) => (
                          <div key={c.id} className="text-sm">
                            <div className="font-medium text-gray-900">{c.authorName}</div>
                            <div className="text-gray-700">{c.content}</div>
                            <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                          </div>
                        ))}
                        {(commentsByPost[post.id] ?? []).length === 0 && <div className="text-sm text-gray-500">No comments yet.</div>}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <input
                        className="input-field"
                        placeholder="Write a comment..."
                        value={commentDraft[post.id] ?? ''}
                        onChange={(e) => setCommentDraft((m) => ({ ...m, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                      />
                      <button onClick={() => handleAddComment(post.id)} className="btn-primary">
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && <div className="text-center py-12 text-gray-500">No posts yet. Be the first to share something!</div>}
      </div>
    </div>
  );
}
