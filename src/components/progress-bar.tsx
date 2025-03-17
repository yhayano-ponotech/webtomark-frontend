// src/components/progress-bar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    // アニメーションのためにプログレスをゆっくり更新
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  // 現在の状態テキストを計算
  const getStatusText = () => {
    if (progress < 20) return 'URLを解析中...';
    if (progress < 40) return 'ウェブサイトをクローリング中...';
    if (progress < 70) return 'コンテンツの抽出中...';
    if (progress < 90) return 'Markdownに変換中...';
    return '完了処理中...';
  };
  
  return (
    <div className="space-y-2">
      <Progress value={displayProgress} className="h-2" />
      <p className="text-sm text-center text-muted-foreground">
        {getStatusText()} ({Math.round(displayProgress)}%)
      </p>
    </div>
  );
}