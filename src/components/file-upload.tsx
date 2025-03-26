// src/components/file-upload.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileUp, FileX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FileUploadProps {
  disabled: boolean;
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
}

export function FileUpload({ 
  disabled, 
  onFileSelect, 
  acceptedFileTypes = ".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.html,.csv,.json,.xml,.zip,.txt,.mp3,.wav,.md"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイルタイプのリスト（表示用）
  const supportedFileTypes = [
    "PDF", "Word", "Excel", "PowerPoint", 
    "画像ファイル", "HTML", "テキストファイル", 
    "CSV", "JSON", "XML", "ZIPファイル", "音声ファイル"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // ファイルサイズチェック (10MB上限)
    if (file.size > 10 * 1024 * 1024) {
      setError("ファイルサイズは10MB以下にしてください");
      return;
    }
    
    // ファイルタイプチェック（簡易的な検証）
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes(fileExtension)) {
      setError(`サポートされていないファイル形式です: ${fileExtension}`);
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleButtonClick}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            disabled={disabled}
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <FileUp className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  disabled={disabled}
                >
                  <FileX className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">別のファイルを選択するにはクリックしてください</p>
            </div>
          ) : (
            <>
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">ファイルをドラッグ＆ドロップするか、クリックして選択</p>
                <p className="text-xs text-muted-foreground mt-1">ファイルサイズ上限: 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="text-sm">
        <Label className="block mb-2">サポートしているファイル形式:</Label>
        <div className="flex flex-wrap gap-2">
          {supportedFileTypes.map((type, index) => (
            <span key={index} className="bg-muted px-2 py-1 rounded-md text-xs">
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}