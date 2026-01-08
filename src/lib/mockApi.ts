import {
  User,
  LoginResponse,
  SignupResponse,
  Profile,
  Post,
  Connection,
  SearchResult,
  AdminUser,
  AdminStats,
  Comment,
  Conversation,
  Message,
  ConnectionStatus,
} from '@/types/api';

// ---------------------------
// Mock "database" (in memory)
// ---------------------------

let mockUsers: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin', avatar: undefined },
  { id: '2', email: 'john@example.com', name: 'John Doe', role: 'user', avatar: undefined },
  { id: '3', email: 'jane@example.com', name: 'Jane Smith', role: 'user', avatar: undefined },
  { id: '4', email: 'bob@example.com', name: 'Bob Johnson', role: 'user', avatar: undefined },
];

let mockProfiles: Record<string, Profile> = {
  '1': {
    id: 'p1',
    userId: '1',
    headline: 'Platform Administrator',
    about: 'Managing the professional networking platform and ensuring smooth operations.',
    location: 'San Francisco, CA',
    avatar: undefined,
    experience: [
      { id: 'e1', title: 'Platform Administrator', company: 'ProNetwork', period: '2020 - Present', description: 'Operations and user experience.' },
    ],
    education: [{ id: 'ed1', degree: 'MBA', school: 'Stanford University', period: '2018 - 2020' }],
    skills: ['Leadership', 'Platform Management', 'User Experience'],
  },
  '2': {
    id: 'p2',
    userId: '2',
    headline: 'Senior Software Engineer at Tech Corp',
    about: 'Building scalable web applications. React, Node.js, cloud.',
    location: 'New York, NY',
    avatar: undefined,
    experience: [
      { id: 'e2', title: 'Senior Software Engineer', company: 'Tech Corp', period: '2020 - Present', description: 'Leading frontend development.' },
      { id: 'e3', title: 'Software Engineer', company: 'StartupXYZ', period: '2016 - 2020', description: 'Full-stack React/Node.' },
    ],
    education: [{ id: 'ed2', degree: 'BS Computer Science', school: 'MIT', period: '2012 - 2016' }],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  },
  '3': {
    id: 'p3',
    userId: '3',
    headline: 'Product Manager | AI & Machine Learning',
    about: 'Product leader focused on AI-powered solutions.',
    location: 'Seattle, WA',
    avatar: undefined,
    experience: [{ id: 'e4', title: 'Senior Product Manager', company: 'AI Solutions Inc', period: '2021 - Present', description: 'AI product strategy.' }],
    education: [{ id: 'ed3', degree: 'MS Computer Science', school: 'CMU', period: '2017 - 2019' }],
    skills: ['Product', 'AI/ML', 'Strategy', 'Analytics'],
  },
  '4': {
    id: 'p4',
    userId: '4',
    headline: 'UX Designer | Design Systems',
    about: 'Design systems and product design.',
    location: 'Austin, TX',
    avatar: undefined,
    experience: [{ id: 'e5', title: 'Lead UX Designer', company: 'Design Co', period: '2019 - Present', description: 'Design systems.' }],
    education: [{ id: 'ed4', degree: 'BFA Design', school: 'RISD', period: '2014 - 2018' }],
    skills: ['UI/UX', 'Figma', 'Design Systems'],
  },
};

let mockPosts: Post[] = [
  {
    id: 'post1',
    authorId: '2',
    authorName: 'John Doe',
    authorAvatar: undefined,
    content: 'Excited to share that our team just launched a new feature that improves performance by 40%!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    comments: 1,
    isLiked: false,
  },
  {
    id: 'post2',
    authorId: '3',
    authorName: 'Jane Smith',
    authorAvatar: undefined,
    content: 'Key takeaway from AI product workshop: Start with the user problem, not the technology.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 42,
    comments: 1,
    isLiked: false,
  },
];

let mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'post1',
    authorId: '3',
    authorName: 'Jane Smith',
    authorAvatar: undefined,
    content: 'Nice work—performance wins are the best.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c2',
    postId: 'post2',
    authorId: '2',
    authorName: 'John Doe',
    authorAvatar: undefined,
    content: 'Totally agree. Problem-first always.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// NEW: Connections with requesterId/receiverId model
let mockConnections: Connection[] = [
  {
    id: 'conn1',
    requesterId: '1',
    receiverId: '2',
    status: 'connected',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    otherUserId: '2',
    otherName: 'John Doe',
    otherHeadline: mockProfiles['2']?.headline ?? 'Professional',
    otherAvatar: undefined,
  },
  {
    id: 'conn2',
    requesterId: '3',
    receiverId: '1',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    otherUserId: '3',
    otherName: 'Jane Smith',
    otherHeadline: mockProfiles['3']?.headline ?? 'Professional',
    otherAvatar: undefined,
  },
  {
    id: 'conn3',
    requesterId: '1',
    receiverId: '4',
    status: 'connected',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    otherUserId: '4',
    otherName: 'Bob Johnson',
    otherHeadline: mockProfiles['4']?.headline ?? 'Professional',
    otherAvatar: undefined,
  },
];

let mockAdminUsers: AdminUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', status: 'active', joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(), role: 'user' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), role: 'user' },
  { id: '4', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive', joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), role: 'user' },
];

let mockMessages: Message[] = [
  {
    id: 'm1',
    conversationId: 'conv_1_2',
    senderId: '2',
    senderName: 'John Doe',
    senderAvatar: undefined,
    content: 'Hey! How are you doing?',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'm2',
    conversationId: 'conv_1_2',
    senderId: '1',
    senderName: 'Admin User',
    senderAvatar: undefined,
    content: 'Great! Just working on some new features.',
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'm3',
    conversationId: 'conv_1_4',
    senderId: '4',
    senderName: 'Bob Johnson',
    senderAvatar: undefined,
    content: 'Would love to collaborate on a design project!',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
];

const delay = (ms: number = 500) => new Promise((r) => setTimeout(r, ms));

function conversationIdFor(a: string, b: string) {
  const [id1, id2] = [a, b].sort();
  return `conv_${id1}_${id2}`;
}

// Helper: find connection between two users (any status)
function findConnectionBetween(userId1: string, userId2: string): Connection | undefined {
  return mockConnections.find(
    (c) =>
      (c.requesterId === userId1 && c.receiverId === userId2) ||
      (c.requesterId === userId2 && c.receiverId === userId1)
  );
}

// Helper: enrich connection with "other" user data relative to currentUserId
function enrichConnection(conn: Connection, currentUserId: string): Connection {
  const otherUserId = conn.requesterId === currentUserId ? conn.receiverId : conn.requesterId;
  const otherUser = mockUsers.find((u) => u.id === otherUserId);
  const otherProfile = mockProfiles[otherUserId!];

  return {
    ...conn,
    otherUserId,
    otherName: otherUser?.name ?? 'Unknown',
    otherHeadline: otherProfile?.headline ?? 'Professional',
    otherAvatar: otherUser?.avatar,
  };
}

export const mockApiClient = {
  getConversationId(userId1: string, userId2: string) {
    return conversationIdFor(userId1, userId2);
  },

  getUserSummary(userId: string): { user: User | null; profile: Profile | null } {
    const user = mockUsers.find((u) => u.id === userId) ?? null;
    const profile = mockProfiles[userId] ?? null;
    return { user, profile };
  },

  // ----------------
  // Auth
  // ----------------
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay();
    const user = mockUsers.find((u) => u.email === email);
    if (!user || password.length < 3) throw new Error('Invalid email or password');

    const token = `mock_token_${user.id}_${Date.now()}`;
    return { token, user };
  },

  async signup(name: string, email: string, password: string): Promise<SignupResponse> {
    await delay();

    if (mockUsers.some((u) => u.email === email)) throw new Error('Email already exists');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const newUser: User = { id: `user_${Date.now()}`, email, name, role: 'user', avatar: undefined };
    mockUsers.push(newUser);

    mockProfiles[newUser.id] = {
      id: `profile_${Date.now()}`,
      userId: newUser.id,
      headline: 'Professional',
      about: 'Welcome to my profile!',
      location: 'Location',
      avatar: undefined,
      experience: [],
      education: [],
      skills: [],
    };

    const token = `mock_token_${newUser.id}_${Date.now()}`;
    return { token, user: newUser };
  },

  // ----------------
  // Profile
  // ----------------
  async getProfile(userId: string): Promise<Profile> {
    await delay();
    const profile = mockProfiles[userId];
    if (!profile) throw new Error('Profile not found');
    return profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    await delay();
    const profile = mockProfiles[userId];
    if (!profile) throw new Error('Profile not found');

    mockProfiles[userId] = { ...profile, ...updates, id: profile.id, userId: profile.userId };
    return mockProfiles[userId];
  },

  // ----------------
  // Posts + comments
  // ----------------
  async getPosts(): Promise<Post[]> {
    await delay();
    return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createPost(authorId: string, content: string): Promise<Post> {
    await delay();
    const author = mockUsers.find((u) => u.id === authorId);
    if (!author) throw new Error('User not found');

    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId,
      authorName: author.name,
      authorAvatar: author.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    mockPosts.unshift(newPost);
    return newPost;
  },

  async toggleLikePost(postId: string): Promise<{ likes: number; isLiked: boolean }> {
    await delay(200);
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (post.isLiked) {
      post.isLiked = false;
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.isLiked = true;
      post.likes += 1;
    }
    return { likes: post.likes, isLiked: post.isLiked };
  },

  async getComments(postId: string): Promise<Comment[]> {
    await delay(250);
    return mockComments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async addComment(params: { postId: string; authorId: string; content: string }): Promise<Comment> {
    await delay(250);

    const post = mockPosts.find((p) => p.id === params.postId);
    if (!post) throw new Error('Post not found');

    const author = mockUsers.find((u) => u.id === params.authorId);
    if (!author) throw new Error('User not found');

    const comment: Comment = {
      id: `c_${Date.now()}`,
      postId: params.postId,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      content: params.content.trim(),
      createdAt: new Date().toISOString(),
    };

    mockComments.push(comment);
    post.comments += 1;

    return comment;
  },

  // ----------------
  // Connections (FIXED)
  // ----------------
  async getConnections(currentUserId: string): Promise<Connection[]> {
    await delay();

    // Filter out self-connections and enrich with "other" user data
    const validConnections = mockConnections
      .filter((c) => c.requesterId !== c.receiverId) // no self
      .filter((c) => c.requesterId === currentUserId || c.receiverId === currentUserId)
      .map((c) => enrichConnection(c, currentUserId));

    return validConnections;
  },

  async sendConnectionRequest(currentUserId: string, targetUserId: string): Promise<void> {
    await delay();

    // Guard: no self-connection
    if (currentUserId === targetUserId) {
      throw new Error('You cannot connect with yourself');
    }

    const targetUser = mockUsers.find((u) => u.id === targetUserId);
    if (!targetUser) throw new Error('User not found');

    const existing = findConnectionBetween(currentUserId, targetUserId);

    if (existing) {
      // If cancelled or rejected, re-open as pending
      if (existing.status === 'cancelled' || existing.status === 'rejected') {
        existing.status = 'pending';
        existing.requesterId = currentUserId;
        existing.receiverId = targetUserId;
        return;
      }

      // If already pending or connected, throw error
      if (existing.status === 'pending') {
        throw new Error('Connection request already pending');
      }
      if (existing.status === 'connected') {
        throw new Error('Already connected');
      }
    }

    // Create new connection
    const profile = mockProfiles[targetUserId];
    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      requesterId: currentUserId,
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      otherUserId: targetUserId,
      otherName: targetUser.name,
      otherHeadline: profile?.headline ?? 'Professional',
      otherAvatar: targetUser.avatar,
    };

    mockConnections.push(newConn);
  },

  async acceptConnection(currentUserId: string, connectionId: string): Promise<void> {
    await delay();
    const conn = mockConnections.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection not found');

    // Only receiver can accept
    if (conn.receiverId !== currentUserId) {
      throw new Error('Only the receiver can accept this connection');
    }

    if (conn.status !== 'pending') {
      throw new Error('Connection is not pending');
    }

    conn.status = 'connected';
    conn.updatedAt = new Date().toISOString();
  },

  async rejectConnection(currentUserId: string, connectionId: string): Promise<void> {
    await delay();
    const conn = mockConnections.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection not found');

    // Only receiver can reject
    if (conn.receiverId !== currentUserId) {
      throw new Error('Only the receiver can reject this connection');
    }

    if (conn.status !== 'pending') {
      throw new Error('Connection is not pending');
    }

    conn.status = 'rejected';
    conn.updatedAt = new Date().toISOString();
  },

  async cancelConnection(currentUserId: string, connectionId: string): Promise<void> {
    await delay();
    const conn = mockConnections.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection not found');

    // Only requester can cancel
    if (conn.requesterId !== currentUserId) {
      throw new Error('Only the requester can cancel this connection');
    }

    if (conn.status !== 'pending') {
      throw new Error('Connection is not pending');
    }

    conn.status = 'cancelled';
    conn.updatedAt = new Date().toISOString();
  },

  async disconnectUser(currentUserId: string, connectionId: string): Promise<void> {
    await delay();
    const conn = mockConnections.find((c) => c.id === connectionId);
    if (!conn) throw new Error('Connection not found');

    // Only connected users can disconnect
    if (conn.status !== 'connected') {
      throw new Error('Connection is not active');
    }

    if (conn.requesterId !== currentUserId && conn.receiverId !== currentUserId) {
      throw new Error('You are not part of this connection');
    }

    // Mark as cancelled (or you could delete it)
    conn.status = 'cancelled';
    conn.updatedAt = new Date().toISOString();
  },

  // ----------------
  // Search
  // ----------------
  async searchUsers(currentUserId: string, query: string): Promise<SearchResult[]> {
    await delay();
    const q = query.toLowerCase();

    return mockUsers
      .filter((u) => u.id !== currentUserId) // exclude self
      .filter((u) => {
        const headline = mockProfiles[u.id]?.headline ?? '';
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || headline.toLowerCase().includes(q);
      })
      .map((u) => {
        const profile = mockProfiles[u.id];
        const conn = findConnectionBetween(currentUserId, u.id);
        return {
          id: u.id,
          name: u.name,
          headline: profile?.headline ?? 'Professional',
          location: profile?.location ?? 'Location',
          avatar: u.avatar,
          connected: conn?.status === 'connected',
          connectionStatus: conn?.status ?? null,
        };
      });
  },

  // ----------------
  // Admin
  // ----------------
  async getAdminStats(): Promise<AdminStats> {
    await delay();
    return {
      totalUsers: mockAdminUsers.length,
      activeUsers: mockAdminUsers.filter((u) => u.status === 'active').length,
      inactiveUsers: mockAdminUsers.filter((u) => u.status === 'inactive').length,
      totalPosts: mockPosts.length,
      totalConnections: mockConnections.filter((c) => c.status === 'connected').length,
    };
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    await delay();
    return [...mockAdminUsers];
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<void> {
    await delay();
    const u = mockAdminUsers.find((x) => x.id === userId);
    if (!u) throw new Error('User not found');
    u.status = status;
  },

  // ----------------
  // Messaging
  // ----------------
  async getConversations(currentUserId: string): Promise<Conversation[]> {
    await delay();

    const convIds = new Set<string>();
    for (const m of mockMessages) {
      if (m.conversationId.includes(`_${currentUserId}_`) || m.conversationId.endsWith(`_${currentUserId}`)) {
        convIds.add(m.conversationId);
      }
    }

    const conversations: Conversation[] = [];

    for (const convId of convIds) {
      const parts = convId.split('_');
      const id1 = parts[1];
      const id2 = parts[2];
      const participantId = id1 === currentUserId ? id2 : id1;

      const participant = mockUsers.find((u) => u.id === participantId);
      const profile = mockProfiles[participantId];
      if (!participant) continue;

      const msgs = mockMessages
        .filter((m) => m.conversationId === convId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const last = msgs[0];
      const unreadCount = msgs.filter((m) => m.senderId !== currentUserId && !m.read).length;

      conversations.push({
        id: convId,
        participantId: participant.id,
        participantName: participant.name,
        participantHeadline: profile?.headline,
        participantAvatar: participant.avatar,
        lastMessage: last?.content,
        lastMessageAt: last?.createdAt,
        unreadCount,
      });
    }

    conversations.sort((a, b) => {
      const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bt - at;
    });

    return conversations;
  },

  async ensureConversation(currentUserId: string, otherUserId: string): Promise<Conversation> {
    await delay(150);

    const convId = conversationIdFor(currentUserId, otherUserId);

    const { user: otherUser, profile } = this.getUserSummary(otherUserId);
    if (!otherUser) throw new Error('User not found');

    const msgs = mockMessages
      .filter((m) => m.conversationId === convId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const last = msgs[0];
    const unreadCount = msgs.filter((m) => m.senderId !== currentUserId && !m.read).length;

    return {
      id: convId,
      participantId: otherUserId,
      participantName: otherUser.name,
      participantHeadline: profile?.headline,
      participantAvatar: otherUser.avatar,
      lastMessage: last?.content,
      lastMessageAt: last?.createdAt,
      unreadCount,
    };
  },

  async getMessages(conversationId: string, currentUserId?: string): Promise<Message[]> {
    await delay(250);

    const items = mockMessages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (currentUserId) {
      for (const m of items) {
        if (m.senderId !== currentUserId) m.read = true;
      }
    }

    return items;
  },

  async sendMessage(params: { conversationId: string; senderId: string; content: string }): Promise<Message> {
    await delay(250);

    const sender = mockUsers.find((u) => u.id === params.senderId);
    if (!sender) throw new Error('User not found');

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId: params.conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content: params.content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    mockMessages.push(message);
    return message;
  },
};
