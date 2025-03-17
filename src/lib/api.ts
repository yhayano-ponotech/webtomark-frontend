// src/lib/api.ts
import { ConversionRequest, ConversionResult, TaskStatus } from '@/lib/types';

/**
 * 変換処理を開始する
 */
export async function startConversion(request: ConversionRequest): Promise<{ taskId: string }> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`変換処理の開始に失敗しました: ${response.statusText}`);
  }

  return response.json();
}

/**
 * タスクのステータスを取得する
 */
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`タスクステータスの取得に失敗しました: ${response.statusText}`);
    }
  
    return response.json();
}

/**
 * 変換結果を取得する
 */
export async function fetchConversionResult(taskId: string): Promise<ConversionResult> {
    const response = await fetch(`/api/tasks/${taskId}/result`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`変換結果の取得に失敗しました: ${response.statusText}`);
    }
  
    return response.json();
}