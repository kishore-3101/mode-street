import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils.js';

export interface ImageItem {
  id?: string;
  url: string;
  path?: string;
  file?: File;
  isNew?: boolean;
}

export interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  className?: string;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 5,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB
  className,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const validNewImages: ImageItem[] = [];
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      validNewImages.push({
        url: previewUrl,
        file,
        isNew: true,
      });
    }

    if (validNewImages.length > 0) {
      onChange([...images, ...validNewImages]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeImage = (indexToRemove: number) => {
    const target = images[indexToRemove];
    if (target?.isNew && target.url.startsWith('blob:')) {
      URL.revokeObjectURL(target.url);
    }
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const item = newImages[fromIndex];
    if (!item) return;
    newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, item);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-4 text-left', className)}>
      {/* Drop Zone */}
      {images.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl',
            'border-2 border-dashed transition-all duration-150 cursor-pointer',
            'bg-cream-surface/70 hover:bg-cream-surface hover:border-camel',
            isDragging
              ? 'border-camel bg-sand/20 scale-[0.99]'
              : 'border-sand'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="p-3 bg-cream rounded-full mb-3 shadow-2xs border border-sand/40">
            <UploadCloud className="w-6 h-6 text-camel" />
          </div>
          <p className="text-sm font-medium text-espresso">
            <span className="text-camel font-semibold hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-espresso/60 mt-1">
            PNG, JPG, WebP up to 5MB each (Max {maxFiles} images, {images.length}/{maxFiles} selected)
          </p>
        </div>
      )}

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((item, idx) => (
            <div
              key={`${item.url}-${idx}`}
              className={cn(
                'group relative aspect-square rounded-lg overflow-hidden border bg-cream-surface shadow-2xs',
                idx === 0 ? 'border-camel ring-2 ring-camel/40' : 'border-sand'
              )}
            >
              <img
                src={item.url}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />

              {/* Cover badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-espresso text-cream text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-xs select-none">
                  Cover
                </span>
              )}

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(idx);
                    }}
                    aria-label="Remove image"
                    className="p-1 bg-espresso/80 text-cream rounded-full hover:bg-danger transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Move Left / Right */}
                <div className="flex justify-between items-center bg-espresso/80 rounded-md px-1 py-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(idx, idx - 1);
                    }}
                    aria-label="Move image left"
                    className="p-1 text-cream hover:text-camel disabled:opacity-30 disabled:hover:text-cream cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-cream/70 font-mono">
                    {idx + 1}/{images.length}
                  </span>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(idx, idx + 1);
                    }}
                    aria-label="Move image right"
                    className="p-1 text-cream hover:text-camel disabled:opacity-30 disabled:hover:text-cream cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-espresso/60 italic">
          <ImageIcon className="w-4 h-4 text-espresso/40" />
          No images uploaded yet. The first image will be used as the product cover photo.
        </div>
      )}
    </div>
  );
}
