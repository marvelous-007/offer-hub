export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLogin: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'client' | 'freelancer';
  isVerified: boolean;
  isActive: boolean;
  profileCompleteness: number;
  totalEarnings?: number;
  totalSpent?: number;
  projectsCompleted: number;
  rating: number;
  joinedAt: Date;
  lastActiveAt: Date;
  profilePicture?: string;
  location?: string;
  phoneNumber?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface PlatformStatistics {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  averageProjectValue: number;
  userGrowthRate: number;
  projectGrowthRate: number;
  revenueGrowthRate: number;
}

export interface SystemHealthMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  databaseStatus: 'healthy' | 'warning' | 'error';
  serverLoad: number;
  memoryUsage: number;
  diskUsage: number;
  lastUpdated: Date;
}

export interface SecurityEvent {
  id: string;
  type:
    | 'login_attempt'
    | 'failed_login'
    | 'suspicious_activity'
    | 'data_breach'
    | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  platformFees: number;
  paymentProcessingFees: number;
  netRevenue: number;
  averageTransactionValue: number;
  transactionVolume: number;
  refundsTotal: number;
  disputesTotal: number;
  pendingPayouts: number;
  completedPayouts: number;
}

export interface ContentModerationItem {
  id: string;
  type: 'project' | 'profile' | 'review' | 'message';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reportedBy?: string;
  reportReason?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminPermission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  description: string;
}

export interface PlatformConfiguration {
  id: string;
  category: 'general' | 'security' | 'payments' | 'features' | 'notifications';
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isEditable: boolean;
  updatedBy: string;
  updatedAt: Date;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  isImportant: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserManagementFilters {
  search?: string;
  userType?: 'client' | 'freelancer' | 'all';
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'all';
  isActive?: boolean;
  joinedDateFrom?: Date;
  joinedDateTo?: Date;
  lastActiveDateFrom?: Date;
  lastActiveDateTo?: Date;
  minRating?: number;
  maxRating?: number;
  location?: string;
}

export interface BulkUserAction {
  action:
    | 'activate'
    | 'deactivate'
    | 'verify'
    | 'suspend'
    | 'delete'
    | 'send_message';
  userIds: string[];
  reason?: string;
  message?: string;
  expiresAt?: Date;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type:
    | 'user_analytics'
    | 'project_analytics'
    | 'financial_analytics'
    | 'performance_analytics';
  dateRange: {
    from: Date;
    to: Date;
  };
  filters: Record<string, string | number | boolean>;
  data: Record<string, unknown>;
  generatedBy: string;
  generatedAt: Date;
  format: 'json' | 'csv' | 'pdf';
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'notification';
  title: string;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, string | number | boolean>;
  isVisible: boolean;
  refreshInterval?: number;
}

export interface AdminDashboardState {
  user: AdminUser | null;
  platformStats: PlatformStatistics | null;
  systemHealth: SystemHealthMetrics | null;
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  widgets: DashboardWidget[];
  isLoading: boolean;
  error: string | null;
}
