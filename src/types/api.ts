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
  period: string; // dev-friendly string like "2022 - Present"
  description?: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string; // dev-friendly string like "2018 - 2022"
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
  comments: number; // count
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

export type ConnectionStatus = 'connected' | 'pending' | 'rejected' | 'cancelled';

export type Connection = {
  id: string;
  userId: string;
  name: string;
  headline: string;
  avatar?: string;
  status: ConnectionStatus;
  createdAt: string;
  receiverId?: string;
  requesterId?: string;
  otherUserId?: string;
  otherName?: string;
  otherHeadline?: string;
};

export type SearchResult = {
  id: string;
  name: string;
  headline: string;
  location: string;
  avatar?: string;
  connected: boolean; // dev-friendly "connected or not"
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
