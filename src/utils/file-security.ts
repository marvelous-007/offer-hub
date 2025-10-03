import { FileSecurityScanResult, FileSharingConfig } from '@/types/file-sharing.types';

export class FileSecurity {
  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly ALLOWED_TYPES = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/rtf',
    
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/quicktime',
    
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-tar',
    'application/gzip'
  ];

  private static readonly DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.ps1'
  ];

  static validateFileType(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: `File type ${file.type} is not allowed` };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasDangerousExtension = this.DANGEROUS_EXTENSIONS.some(ext => 
      fileName.endsWith(ext)
    );

    if (hasDangerousExtension) {
      return { isValid: false, error: 'File extension is not allowed for security reasons' };
    }

    return { isValid: true };
  }

  static validateFileSize(file: File): { isValid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB` 
      };
    }

    return { isValid: true };
  }

  static async scanFileForThreats(file: File): Promise<FileSecurityScanResult> {
    // Simulate malware scanning (in real implementation, integrate with antivirus API)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic heuristic checks
        const threats: string[] = [];
        
        // Check for suspicious file patterns
        if (file.name.includes('script') || file.name.includes('executable')) {
          threats.push('Suspicious file name pattern');
        }

        // Check for double extensions
        if (file.name.split('.').length > 2) {
          threats.push('Potential double extension attack');
        }

        resolve({
          isSafe: threats.length === 0,
          threats,
          scanTimestamp: new Date().toISOString()
        });
      }, 1000);
    });
  }

  static sanitizeFileName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }

  static async encryptFile(file: File): Promise<Blob> {
    // Simple client-side encryption (in production, use proper encryption)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // Simple XOR encryption (replace with proper encryption in production)
        const encryptedData = new Uint8Array(arrayBuffer);
        for (let i = 0; i < encryptedData.length; i++) {
          encryptedData[i] ^= 0xAA; // Simple XOR key
        }
        resolve(new Blob([encryptedData], { type: file.type }));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static async decryptFile(encryptedBlob: Blob): Promise<Blob> {
    // Decrypt the file (reverse of encryptFile)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const decryptedData = new Uint8Array(arrayBuffer);
        for (let i = 0; i < decryptedData.length; i++) {
          decryptedData[i] ^= 0xAA; // Same XOR key
        }
        resolve(new Blob([decryptedData], { type: encryptedBlob.type }));
      };
      reader.readAsArrayBuffer(encryptedBlob);
    });
  }

  static getFileIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'application/pdf': '📄',
      'application/msword': '📝',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
      'application/vnd.ms-excel': '📊',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
      'text/plain': '📄',
      'image/': '🖼️',
      'video/': '🎬',
      'audio/': '🎵',
      'application/zip': '📦'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (type.startsWith(key)) return icon;
    }

    return '📎';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}