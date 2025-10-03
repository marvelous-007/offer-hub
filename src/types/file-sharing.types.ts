export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  conversationId: string;
  messageId?: string;
}

export interface FilePreviewState {
  isOpen: boolean;
  file: FileMetadata | null;
  currentIndex: number;
  files: FileMetadata[];
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileSecurityScanResult {
  isSafe: boolean;
  threats: string[];
  scanTimestamp: string;
}

export interface FileVersion {
  version: number;
  fileId: string;
  uploadedAt: string;
  uploadedBy: string;
  changes: string;
  size: number;
}

export interface FileSharingConfig {
  maxFileSize: number;
  allowedTypes: string[];
  maxFilesPerUpload: number;
  enableCompression: boolean;
  enableEncryption: boolean;
  scanForMalware: boolean;
}

export interface FileOrganization {
  folders: Folder[];
  tags: string[];
  searchQuery: string;
  sortBy: 'name' | 'size' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  fileCount: number;
  createdAt: string;
}

export interface FileSharingPermissions {
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
  canDelete: boolean;
  canManage: boolean;
  expiresAt?: string;
  allowedUsers: string[];
}

export interface FileAnalytics {
  fileId: string;
  views: number;
  downloads: number;
  shares: number;
  lastAccessed: string;
  storageOptimized: boolean;
}