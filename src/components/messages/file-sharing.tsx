"use client";

import React, { useState } from 'react';
import { Files, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from './file-upload';
import { FilePreview } from './file-preview';
import { FileManager } from './file-manager';
import { useFileSharing } from '@/hooks/use-file-sharing';
import { FileMetadata } from '@/types/file-sharing.types';

interface FileSharingProps {
  conversationId: string;
  onFileSent?: (file: FileMetadata) => void;
}

export function FileSharing({ conversationId, onFileSent }: FileSharingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  const {
    files,
    uploadProgress,
    previewState,
    organization,
    filteredFiles,
    uploadMultipleFiles,
    deleteFile,
    openFilePreview,
    closeFilePreview,
    navigatePreview,
    searchFiles,
    sortFiles,
    downloadFile
  } = useFileSharing(conversationId);

  const handleFilesUpload = async (files: File[]) => {
    try {
      const result = await uploadMultipleFiles(files);
      
      // Notify parent component about sent files
      result.successful.forEach(file => {
        onFileSent?.(file);
      });

      // Switch to manage tab after successful upload
      if (result.successful.length > 0) {
        setActiveTab('manage');
      }

      // Show upload results
      if (result.failed.length > 0) {
        alert(`Some files failed to upload:\n${result.failed.map(f => f.message).join('\n')}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleFileSent = (file: FileMetadata) => {
    onFileSent?.(file);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Files className="w-4 h-4" />
        Files
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">File Sharing</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === 'upload' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('upload')}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <Button
                  variant={activeTab === 'manage' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('manage')}
                >
                  <Files className="w-4 h-4 mr-2" />
                  Manage ({files.length})
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'upload' ? (
              <div className="space-y-6">
                <FileUpload
                  onFilesUpload={handleFilesUpload}
                  maxFiles={10}
                  maxSize={100 * 1024 * 1024}
                />
                
                {/* Recent Files Preview */}
                {files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Recent Files
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {files.slice(0, 8).map((file) => (
                        <div
                          key={file.id}
                          className="border rounded-lg p-3 cursor-pointer hover:border-gray-300 transition-colors"
                          onClick={() => openFilePreview(file)}
                        >
                          <div className="text-center space-y-2">
                            <div className="text-2xl">
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-12 h-12 object-cover rounded mx-auto"
                                />
                              ) : (
                                <span>{FileSecurity.getFileIcon(file.type)}</span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {FileSecurity.formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FileManager
                files={filteredFiles}
                organization={organization}
                onSearch={searchFiles}
                onSort={sortFiles}
                onPreview={openFilePreview}
                onDownload={downloadFile}
                onDelete={deleteFile}
              />
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="border-t p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Upload Progress
              </h4>
              <div className="space-y-2">
                {uploadProgress.map((progress) => (
                  <div key={progress.fileId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">{progress.fileId}</span>
                        <span>{progress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            progress.status === 'completed'
                              ? 'bg-green-500'
                              : progress.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                      {progress.error && (
                        <p className="text-xs text-red-500 mt-1">{progress.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreview
        previewState={previewState}
        onClose={closeFilePreview}
        onNavigate={navigatePreview}
        onDownload={downloadFile}
      />
    </>
  );
}