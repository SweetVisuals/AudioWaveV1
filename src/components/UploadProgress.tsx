import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface UploadProgressProps {
  progress: number;
  fileName: string;
  onCancel?: () => void;
  error?: string;
}

export function UploadProgress({ progress, fileName, onCancel, error }: UploadProgressProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white truncate">{fileName}</span>
        {onCancel && progress < 100 && !error && (
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={clsx(
            'absolute left-0 top-0 h-full transition-all duration-300',
            error ? 'bg-red-500' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : (
        <p className="mt-2 text-sm text-white/60">
          {progress < 100 ? `${Math.round(progress)}% uploaded` : 'Upload complete'}
        </p>
      )}
    </div>
  );
}