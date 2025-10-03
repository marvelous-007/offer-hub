import { useState, useCallback, useRef } from 'react';
import { 
  FileMetadata, 
  FileUploadProgress, 
  FilePreviewState,
  FileSharingConfig,
  FileOrganization,
  FileSharingPermissions,
  FileAnalytics
} from '@/types/file-sharing.types';
import { FileSecurity } from '@/utils/file-security';

export function useFileSharing(conversationId: string) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Map<string, FileUploadProgress>>(new Map());
  const [previewState, setPreviewState] = useState<FilePreviewState>({
    isOpen: false,
    file: null,
    currentIndex: 0,
    files: []
  });
  const [organization, setOrganization] = useState<FileOrganization>({
    folders: [],
    tags: [],
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File, onProgress?: (progress: number) => void) => {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate file
    const typeValidation = FileSecurity.validateFileType(file);
    if (!typeValidation.isValid) {
      throw new Error(typeValidation.error);
    }

    const sizeValidation = FileSecurity.validateFileSize(file);
    if (!sizeValidation.isValid) {
      throw new Error(sizeValidation.error);
    }

    // Scan for threats
    const scanResult = await FileSecurity.scanFileForThreats(file);
    if (!scanResult.isSafe) {
      throw new Error(`Security scan failed: ${scanResult.threats.join(', ')}`);
    }

    // Set initial progress
    setUploadProgress(prev => new Map(prev.set(fileId, {
      fileId,
      progress: 0,
      status: 'uploading'
    })));

    try {
      // Encrypt file
      const encryptedFile = await FileSecurity.encryptFile(file);
      
      // Simulate upload progress (replace with actual upload logic)
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => new Map(prev.set(fileId, {
          fileId,
          progress,
          status: 'uploading'
        })));
        onProgress?.(progress);
      }

      // Create file metadata
      const fileMetadata: FileMetadata = {
        id: fileId,
        name: FileSecurity.sanitizeFileName(file.name),
        size: file.size,
        type: file.type,
        mimeType: file.type,
        url: URL.createObjectURL(file), // In production, this would be the server URL
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user', // Replace with actual user ID
        conversationId
      };

      // Add to files list
      setFiles(prev => [...prev, fileMetadata]);

      // Mark upload as completed
      setUploadProgress(prev => new Map(prev.set(fileId, {
        fileId,
        progress: 100,
        status: 'completed'
      })));

      return fileMetadata;
    } catch (error) {
      setUploadProgress(prev => new Map(prev.set(fileId, {
        fileId,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      })));
      throw error;
    }
  }, [conversationId]);

  const uploadMultipleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const results = await Promise.allSettled(
      fileArray.map(file => uploadFile(file))
    );

    const successfulUploads = results
      .filter((result): result is PromiseFulfilledResult<FileMetadata> => result.status === 'fulfilled')
      .map(result => result.value);

    const failedUploads = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason);

    return {
      successful: successfulUploads,
      failed: failedUploads
    };
  }, [uploadFile]);

  const deleteFile = useCallback(async (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  const openFilePreview = useCallback((file: FileMetadata, allFiles: FileMetadata[] = files) => {
    const fileIndex = allFiles.findIndex(f => f.id === file.id);
    setPreviewState({
      isOpen: true,
      file,
      currentIndex: fileIndex,
      files: allFiles
    });
  }, [files]);

  const closeFilePreview = useCallback(() => {
    setPreviewState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const navigatePreview = useCallback((direction: 'next' | 'previous') => {
    setPreviewState(prev => {
      if (!prev.isOpen || prev.files.length === 0) return prev;

      let newIndex = direction === 'next' ? prev.currentIndex + 1 : prev.currentIndex - 1;
      
      // Loop around
      if (newIndex >= prev.files.length) newIndex = 0;
      if (newIndex < 0) newIndex = prev.files.length - 1;

      return {
        ...prev,
        currentIndex: newIndex,
        file: prev.files[newIndex]
      };
    });
  }, []);

  const searchFiles = useCallback((query: string) => {
    setOrganization(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const sortFiles = useCallback((sortBy: FileOrganization['sortBy'], sortOrder: FileOrganization['sortOrder']) => {
    setOrganization(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const getFilteredAndSortedFiles = useCallback(() => {
    let filtered = files;

    // Apply search filter
    if (organization.searchQuery) {
      const query = organization.searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.type.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (organization.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'date':
        default:
          aValue = new Date(a.uploadedAt).getTime();
          bValue = new Date(b.uploadedAt).getTime();
          break;
      }

      if (organization.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [files, organization]);

  const downloadFile = useCallback(async (file: FileMetadata) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download file');
    }
  }, []);

  return {
    // State
    files,
    uploadProgress: Array.from(uploadProgress.values()),
    previewState,
    organization,
    filteredFiles: getFilteredAndSortedFiles(),

    // Actions
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    openFilePreview,
    closeFilePreview,
    navigatePreview,
    searchFiles,
    sortFiles,
    downloadFile,
    fileInputRef
  };
}