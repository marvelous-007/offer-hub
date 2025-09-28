/**
 * Utility functions for data export functionality
 */

export interface ExportData {
  [key: string]: any;
}

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param filename - Name of the exported file
 */
export const exportToCSV = (data: ExportData[], filename: string = 'export.csv'): void => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export data to JSON format
 * @param data - Array of objects to export
 * @param filename - Name of the exported file
 */
export const exportToJSON = (data: ExportData[], filename: string = 'export.json'): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

/**
 * Download file with given content
 * @param content - File content
 * @param filename - Name of the file
 * @param mimeType - MIME type of the file
 */
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
