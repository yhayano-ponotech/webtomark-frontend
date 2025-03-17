// src/components/markdown-preview.tsx
'use client';

import React from 'react';

interface MarkdownPreviewProps {
  markdown: string;
}

// この実装はクライアントサイドでMarkdownをレンダリングします
// 本番環境では react-markdown などのライブラリを使うことを推奨
export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  // シンプルなMarkdownレンダリング
  // 実際のアプリケーションではreact-markdownなどのライブラリを使用することをお勧めします
  const htmlContent = React.useMemo(() => {
    // シンプルなMarkdownレンダリング
    const processed = markdown
      // 見出し
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 太字
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // イタリック
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // リンク
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      // コードブロック
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      // インラインコード
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      // リスト
      .replace(/^\s*-\s(.*$)/gim, '<li>$1</li>')
      // 段落
      .replace(/^\s*([^\n<]*)\s*$/gim, '<p>$1</p>')
      // 画像
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />');
    
    return processed;
  }, [markdown]);

  return (
    <div 
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}