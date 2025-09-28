import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV, exportToJSON, ExportData } from '@/utils/export-helpers';

interface ExportButtonProps {
  data: ExportData[];
  filename?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename = 'export', 
  className 
}) => {
  const handleCSVExport = () => {
    exportToCSV(data, `${filename}.csv`);
  };

  const handleJSONExport = () => {
    exportToJSON(data, `${filename}.json`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCSVExport}
        disabled={!data || data.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleJSONExport}
        disabled={!data || data.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        JSON
      </Button>
    </div>
  );
};
