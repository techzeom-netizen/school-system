import React, { useCallback } from 'react';
import { Download, File, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToExcel, exportToPDF, exportToWord } from './exportUtils';
import { ExportData } from './exportTemplateGenerator';

export interface DownloadButtonProps {
  data: ExportData;
  onError?: (error: string) => void;
  onSuccess?: (format: string) => void;
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  data,
  onError,
  onSuccess,
  variant = 'outline',
  size = 'sm',
  className = '',
}) => {
  const handleExport = useCallback(
    async (format: 'excel' | 'pdf' | 'word') => {
      try {
        let success = false;

        switch (format) {
          case 'excel':
            success = exportToExcel(data);
            break;
          case 'pdf':
            success = exportToPDF(data);
            break;
          case 'word':
            success = exportToWord(data);
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        if (success) {
          onSuccess?.(format);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        onError?.(errorMessage);
      }
    },
    [data, onError, onSuccess]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download className="h-4 w-4 mr-2" />
          Download
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <File className="h-4 w-4 mr-2" />
          Download as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('word')}>
          <FileText className="h-4 w-4 mr-2" />
          Download as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
