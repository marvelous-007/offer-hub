"use client";

import React, { useEffect, useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileMetadata, FilePreviewState } from '@/types/file-sharing.types';
import { FileSecurity } from '@/utils/file-security';

interface FilePreviewProps {
  previewState: FilePreviewState;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'previous') => void;
  onDownload: (file: FileMetadata) => void;
}

export function FilePreview({ previewState, onClose, onNavigate, onDownload }: FilePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (previewState.isOpen) {
      setZoom(1);
      setRotation(0);
      setIsLoading(true);
      
      // Prevent body scroll when preview is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [previewState.isOpen]);

  if (!previewState.isOpen || !previewState.file) return null;

  const { file, files, currentIndex } = previewState;
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isPDF = file.type === 'application/pdf';
  const canNavigate = files.length > 1;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const renderPreviewContent = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-full transition-transform"
            style={{ 
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex items-center justify-center h-full">
          <video
            controls
            className="max-w-full max-h-full"
            onLoadedData={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          >
            <source src={file.url} type={file.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex items-center justify-center h-full">
          <iframe
            src={file.url}
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      );
    }

    // For other file types, show download option
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-6xl">{FileSecurity.getFileIcon(file.type)}</div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            {FileSecurity.formatFileSize(file.size)} • {file.type}
          </p>
        </div>
        <Button onClick={() => onDownload(file)}>
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {canNavigate && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('previous')}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('next')}
                  disabled={currentIndex === files.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {currentIndex + 1} of {files.length} • {FileSecurity.formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controls for images */}
            {isImage && (
              <>
                <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Reset
                </Button>
              </>
            )}

            <Button variant="ghost" size="sm" onClick={() => onDownload(file)}>
              <Download className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading preview...</p>
              </div>
            </div>
          )}
          
          <div className={`w-full h-full ${isLoading ? 'invisible' : 'visible'}`}>
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  );
}