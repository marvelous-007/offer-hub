"use client";

import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileSecurity } from '@/utils/file-security';
import { FileUploadProgress } from '@/types/file-sharing.types';

interface FileUploadProps {
  onFilesUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  disabled?: boolean;
}

export function FileUpload({ 
  onFilesUpload, 
  maxFiles = 10, 
  maxSize = 100 * 1024 * 1024, 
  allowedTypes,
  disabled = false 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<FileUploadProgress[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed per upload`);
      return { valid, errors };
    }

    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max ${FileSecurity.formatFileSize(maxSize)})`);
        continue;
      }

      // Check file type
      const typeValidation = FileSecurity.validateFileType(file);
      if (!typeValidation.isValid) {
        errors.push(`${file.name}: ${typeValidation.error}`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  }, [maxFiles, maxSize]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const { valid, errors } = validateFiles(files);

    // Show errors
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (valid.length > 0) {
      await onFilesUpload(valid);
    }
  }, [disabled, validateFiles, onFilesUpload]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;

    const files = Array.from(e.target.files);
    const { valid, errors } = validateFiles(files);

    // Show errors
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (valid.length > 0) {
      await onFilesUpload(valid);
    }

    // Reset input
    e.target.value = '';
  }, [disabled, validateFiles, onFilesUpload]);

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
          accept={allowedTypes?.join(',')}
        />
        
        <div className="space-y-3">
          <Upload className={`w-8 h-8 mx-auto ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxFiles} files, {FileSecurity.formatFileSize(maxSize)} each
            </p>
          </div>
        </div>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadQueue.map((item) => (
            <div key={item.fileId} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : item.status === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.fileId}
                </p>
                <Progress value={item.progress} className="h-1 mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  {item.status === 'uploading' && `Uploading... ${item.progress}%`}
                  {item.status === 'completed' && 'Upload completed'}
                  {item.status === 'error' && item.error}
                </p>
              </div>

              {(item.status === 'completed' || item.status === 'error') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadQueue(prev => prev.filter(i => i.fileId !== item.fileId))}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}