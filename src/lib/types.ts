// src/lib/types.ts

/**
 * 変換リクエストの型定義
 */
export interface ConversionRequest {
  url: string;
  options: {
    crawlDepth: number;
    includeImages: boolean;
  };
}

/**
 * タスクステータスの型定義
 */
export interface TaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message?: string;
}

/**
 * 変換結果のメタデータの型定義
 */
export interface ConversionMetadata {
  sourceUrl: string;
  title?: string;
  pageCount?: number;
  crawlDepth: number;
  includeImages: boolean;
  convertedAt: string;
  fileType?: string; // ファイル変換の場合の元ファイル形式
}

/**
 * 変換結果の型定義
 */
export interface ConversionResult {
  taskId: string;
  markdown: string;
  metadata: ConversionMetadata;
}