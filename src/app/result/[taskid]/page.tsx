// src/app/result/[taskId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Copy, Download, ArrowLeft } from 'lucide-react';
import { fetchConversionResult } from '@/lib/api';
import { ConversionResult } from '@/lib/types';
import { MarkdownPreview } from '@/components/markdown-preview';

interface ResultPageProps {
  params: {
    taskId: string;
  };
}

export default function ResultPage({ params }: ResultPageProps) {
  const { taskId } = params;
  const router = useRouter();
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await fetchConversionResult(taskId);
        setResult(data);
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setError('結果の取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [taskId]);

  const handleCopyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('クリップボードへのコピーに失敗しました');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata.title || 'converted'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">結果を読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>結果が見つかりません</AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
            <span>変換結果</span>
            <Button variant="outline" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              ホームに戻る
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 space-y-2">
            <p><strong>URL:</strong> {result.metadata.sourceUrl}</p>
            <p><strong>タイトル:</strong> {result.metadata.title || 'タイトルなし'}</p>
            <p><strong>ページ数:</strong> {result.metadata.pageCount || 1}</p>
          </div>
          
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
              <TabsTrigger value="source">Markdownソース</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="min-h-96 max-h-[600px] overflow-auto border rounded-md p-4">
              <MarkdownPreview markdown={result.markdown} />
            </TabsContent>
            
            <TabsContent value="source" className="min-h-96 max-h-[600px] overflow-auto">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
                {result.markdown}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? 'コピーしました！' : 'クリップボードにコピー'}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Markdownをダウンロード
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}