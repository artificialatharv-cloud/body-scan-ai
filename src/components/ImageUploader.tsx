import { useCallback, useState } from 'react';
import { Upload, X, User, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  label: string;
  description: string;
  viewType: 'front' | 'side' | 'standing';
  onImageSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const viewIcons = {
  front: User,
  side: ArrowRight,
  standing: Users,
};

export const ImageUploader = ({
  label,
  description,
  viewType,
  onImageSelect,
  selectedFile,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const Icon = viewIcons[viewType];

  const handleFile = useCallback(
    (file: File) => {
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onImageSelect(null);
    setPreview(null);
  }, [onImageSelect]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div
        className={cn(
          'relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200',
          isDragging
            ? 'border-primary bg-accent'
            : preview
            ? 'border-primary/50 bg-accent/50'
            : 'border-border hover:border-primary/50 hover:bg-accent/30'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        {preview ? (
          <div className="relative h-full w-full p-3">
            <img
              src={preview}
              alt={`${label} preview`}
              className="h-full w-full rounded-lg object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-transform hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Upload className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your image here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <p className="text-xs text-muted-foreground truncate">
          {selectedFile.name}
        </p>
      )}
    </div>
  );
};
