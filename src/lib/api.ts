export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  token: string;
  user: User;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  period: string;
  description?: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
};

export type Profile = {
  id: string;
  userId: string;
  headline: string;
  about: string;
  location: string;
  avatar?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
};

export type ConnectionStatus = 'pending' | 'connected' | 'cancelled' | 'rejected';

export type Connection = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;

  // Derived fields for UI (the "other" user relative to current user)
  otherUserId: string;
  otherName: string;
  otherHeadline: string;
  otherAvatar?: string;
};

export type SearchResult = {
  id: string;
  name: string;
  headline: string;
  location: string;
  avatar?: string;
  connectionStatus: ConnectionStatus | null; // null = no connection
};

export type AdminUserStatus = 'active' | 'inactive';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  joinDate: string;
  role: UserRole;
};

export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPosts: number;
  totalConnections: number;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantHeadline?: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
};

const TOKEN_KEY = 'auth_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}
