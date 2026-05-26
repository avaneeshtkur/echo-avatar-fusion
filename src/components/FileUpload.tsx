
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Upload, X, FileVideo, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface FileUploadProps {
  label: string;
  accept?: string;
  icon?: React.ReactNode;
  file: File | null;
  onFileChange: (file: File | null) => void;
  className?: string;
}

export function FileUpload({
  label,
  accept = "audio/*,video/*",
  icon = <Upload className="h-5 w-5 mr-2" />,
  file,
  onFileChange,
  className
}: FileUploadProps) {
  const [duration, setDuration] = useState<number | null>(null);
  
  const getFileDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve) => {
      if (file.type.includes('video')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve(video.duration);
          window.URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.includes('audio')) {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
          window.URL.revokeObjectURL(audio.src);
        };
        audio.src = URL.createObjectURL(file);
      } else {
        // Default duration for other file types
        resolve(0);
      }
    });
  }, []);
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Simple file validation
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 100MB",
          variant: "destructive"
        });
        return;
      }
      
      // Get file duration for media files
      if (selectedFile.type.includes('audio') || selectedFile.type.includes('video')) {
        const fileDuration = await getFileDuration(selectedFile);
        setDuration(fileDuration);
      } else {
        setDuration(null);
      }
      
      onFileChange(selectedFile);
      
      // Show a toast notification
      toast({
        title: "File selected",
        description: `${selectedFile.name} is ready for processing`,
      });
    }
  }, [onFileChange, getFileDuration]);

  const clearFile = useCallback(() => {
    onFileChange(null);
    setDuration(null);
  }, [onFileChange]);
  
  // Function to get the appropriate icon based on file type
  const getFileIcon = (file: File) => {
    if (file.type.includes('audio')) {
      return <Mic className="h-5 w-5 text-primary" />;
    } else if (file.type.includes('video')) {
      return <FileVideo className="h-5 w-5 text-primary" />;
    } else {
      return <FileText className="h-5 w-5 text-primary" />;
    }
  };
  
  // Format seconds to MM:SS format
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`file-${label}`}>{label}</Label>
      
      {!file ? (
        <div className="flex gap-2">
          <Input
            type="file"
            id={`file-${label}`}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="secondary" 
            onClick={() => document.getElementById(`file-${label}`)?.click()}
            className="flex-1"
          >
            {icon}
            Select File
          </Button>
          
          {accept.includes('audio') && (
            <Button variant="outline" onClick={() => {
              toast({
                title: "Recording",
                description: "Audio recording functionality would be implemented here",
              });
            }}>
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center border rounded-md p-2 bg-muted">
          <div className="mr-2">
            {getFileIcon(file)}
          </div>
          <div className="mr-auto truncate ml-2">
            <div className="font-medium">{file.name}</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1]}</span>
              {duration && (
                <span className="flex items-center ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(duration)}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
