"use client";

import React, { useState } from 'react';
import { Search, Filter, Grid, List, Download, Trash2, Eye, Folder, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileMetadata, FileOrganization } from '@/types/file-sharing.types';
import { FileSecurity } from '@/utils/file-security';

interface FileManagerProps {
  files: FileMetadata[];
  organization: FileOrganization;
  onSearch: (query: string) => void;
  onSort: (sortBy: FileOrganization['sortBy'], sortOrder: FileOrganization['sortOrder']) => void;
  onPreview: (file: FileMetadata) => void;
  onDownload: (file: FileMetadata) => void;
  onDelete: (fileId: string) => void;
  onManageTags?: (fileId: string, tags: string[]) => void;
  onMoveToFolder?: (fileId: string, folderId: string) => void;
}

export function FileManager({
  files,
  organization,
  onSearch,
  onSort,
  onPreview,
  onDownload,
  onDelete,
  onManageTags,
  onMoveToFolder
}: FileManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const selectAllFiles = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)));
    }
  };

  const handleBulkDownload = () => {
    files
      .filter(file => selectedFiles.has(file.id))
      .forEach(file => onDownload(file));
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.size} files?`)) {
      selectedFiles.forEach(fileId => onDelete(fileId));
      setSelectedFiles(new Set());
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={organization.searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>

          <select
            value={`${organization.sortBy}-${organization.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [FileOrganization['sortBy'], FileOrganization['sortOrder']];
              onSort(sortBy, sortOrder);
            }}
            className="px-3 py-2 text-sm border rounded-md"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedFiles.size} file{selectedFiles.size > 1 ? 's' : ''} selected
          </span>
          <Button variant="outline" size="sm" onClick={handleBulkDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedFiles(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Files */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileGridItem
              key={file.id}
              file={file}
              isSelected={selectedFiles.has(file.id)}
              onSelect={toggleFileSelection}
              onPreview={onPreview}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.size === files.length && files.length > 0}
                    onChange={selectAllFiles}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">Name</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">Size</th>
                <th className="text-left p-3 text-sm font-medium text-gray-900">Date</th>
                <th className="text-right p-3 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  isSelected={selectedFiles.has(file.id)}
                  onSelect={toggleFileSelection}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No files found</p>
          {organization.searchQuery && (
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Grid View Item
function FileGridItem({
  file,
  isSelected,
  onSelect,
  onPreview,
  onDownload,
  onDelete
}: {
  file: FileMetadata;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
  onPreview: (file: FileMetadata) => void;
  onDownload: (file: FileMetadata) => void;
  onDelete: (fileId: string) => void;
}) {
  const isImage = file.type.startsWith('image/');

  return (
    <div
      className={`
        border rounded-lg p-4 cursor-pointer transition-colors
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={() => onPreview(file)}
    >
      <div className="flex items-start justify-between mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(file.id);
          }}
          className="rounded"
        />
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(file);
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-3xl mb-2">
          {isImage ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-16 h-16 object-cover rounded mx-auto"
            />
          ) : (
            FileSecurity.getFileIcon(file.type)
          )}
        </div>
        
        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </p>
        
        <p className="text-xs text-gray-500">
          {FileSecurity.formatFileSize(file.size)}
        </p>
        
        <p className="text-xs text-gray-400">
          {new Date(file.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// List View Item
function FileListItem({
  file,
  isSelected,
  onSelect,
  onPreview,
  onDownload,
  onDelete
}: {
  file: FileMetadata;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
  onPreview: (file: FileMetadata) => void;
  onDownload: (file: FileMetadata) => void;
  onDelete: (fileId: string) => void;
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(file.id)}
          className="rounded"
        />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">{FileSecurity.getFileIcon(file.type)}</span>
          <div>
            <p 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => onPreview(file)}
            >
              {file.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded by {file.uploadedBy}
            </p>
          </div>
        </div>
      </td>
      <td className="p-3 text-sm text-gray-600">
        {file.type.split('/')[1]?.toUpperCase() || file.type}
      </td>
      <td className="p-3 text-sm text-gray-600">
        {FileSecurity.formatFileSize(file.size)}
      </td>
      <td className="p-3 text-sm text-gray-600">
        {new Date(file.uploadedAt).toLocaleDateString()}
      </td>
      <td className="p-3">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(file)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(file)}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}