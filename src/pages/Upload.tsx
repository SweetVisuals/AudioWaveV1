import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Music, X, Edit2, DollarSign, Percent } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDropzone } from 'react-dropzone';
import { uploadToIPFS } from '../lib/nftStorage';
import { UploadProgress } from '../components/UploadProgress';
import clsx from 'clsx';

interface UploadFile extends File {
  id: string;
  preview?: string;
  progress: number;
  error?: string;
  details?: {
    name: string;
    price: string;
    leasePrice: string;
    resalePercentage: string;
    ipfsUrl?: string;
  };
}

export function Upload() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      details: {
        name: file.name.substring(0, 25),
        price: '',
        leasePrice: '',
        resalePercentage: '10',
      }
    }));
    setFiles(prev => [...prev, ...newFiles].sort((a, b) => a.name.localeCompare(b.name)));
    if (!selectedFile && newFiles.length > 0) {
      setSelectedFile(newFiles[0]);
    }
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    multiple: true
  });

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const handleUpdateDetails = (key: keyof UploadFile['details'], value: string) => {
    if (!selectedFile) return;

    setFiles(prev => prev.map(file => {
      if (file.id === selectedFile.id) {
        return {
          ...file,
          details: {
            ...file.details!,
            [key]: value
          }
        };
      }
      return file;
    }));

    setSelectedFile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        details: {
          ...prev.details!,
          [key]: value
        }
      };
    });
  };

  const uploadFile = async (file: UploadFile) => {
    try {
      const ipfsUrl = await uploadToIPFS(file, (progress) => {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      });

      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          progress: 100,
          details: {
            ...f.details!,
            ipfsUrl
          }
        } : f
      ));
    } catch (error: any) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          error: error.message || 'Upload failed'
        } : f
      ));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      // Upload all files to IPFS
      await Promise.all(files.map(file => uploadFile(file)));
      
      // Continue with the rest of the upload process...
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <Music className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
        <p className="text-white/80 mb-8">You have to sign-in to use this feature</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* File List */}
      <div className="w-1/2 border-r border-white/10 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Upload Tracks</h2>
          <p className="text-white/60">Drag and drop your audio files here</p>
        </div>

        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg p-8 mb-6 transition-colors',
            isDragActive
              ? 'border-primary/50 bg-primary/5'
              : 'border-white/20 hover:border-primary/30'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <UploadIcon className="h-12 w-12 text-white/60 mb-4" />
            <p className="text-white/80 text-center">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop audio files here, or click to select files'}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Supported formats: MP3, WAV, M4A
            </p>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={clsx(
                'flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer',
                selectedFile?.id === file.id
                  ? 'bg-primary/20'
                  : 'hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-3">
                <Music className="text-white/60" size={20} />
                <span className="text-white truncate">{file.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(file.id);
                }}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Progress */}
        <div className="mt-6 space-y-4">
          {files.map((file) => (
            <UploadProgress
              key={file.id}
              fileName={file.name}
              progress={file.progress}
              error={file.error}
              onCancel={
                file.progress < 100 && !file.error
                  ? () => handleRemoveFile(file.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Details Form */}
      <div className="w-1/2 p-6">
        {selectedFile ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Track Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Track Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedFile.details?.name}
                    onChange={(e) => handleUpdateDetails('name', e.target.value)}
                    maxLength={25}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <Edit2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Give your track a unique name that will help it stand out
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Buy Price (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedFile.details?.price}
                    onChange={(e) => handleUpdateDetails('price', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Set the price for exclusive ownership rights
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Lease Price (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedFile.details?.leasePrice}
                    onChange={(e) => handleUpdateDetails('leasePrice', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Set the price for non-exclusive usage rights
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Resale Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={selectedFile.details?.resalePercentage}
                    onChange={(e) => handleUpdateDetails('resalePercentage', e.target.value)}
                    min="0"
                    max="100"
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Set your percentage of future resales (royalties)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/60">
            Select a file to edit its details
          </div>
        )}
      </div>

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-light/95 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload All Files'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}