import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface FileUploadProps {
  onFileSelect: (base64: string) => void;
  isLoading: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image of your lab results.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreview(reader.result as string);
      onFileSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] cursor-pointer",
          isDragging ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={onFileChange}
          disabled={isLoading}
          accept="image/*"
        />
        
        {preview ? (
          <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-slate-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
              <Upload size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Upload Lab Results</h3>
            <p className="text-sm text-slate-500 text-center">
              Drag and drop an image of your report, or click to browse
            </p>
          </>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <span className="text-sm font-medium text-slate-700">Analyzing results...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
