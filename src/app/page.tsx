// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { startConversion } from '@/lib/api';
import { ProgressBar } from '@/components/progress-bar';

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  // 環境変数からデフォルト値を取得するか、設定されていなければフォールバック値を使用
  const defaultDepth = parseInt(process.env.NEXT_PUBLIC_DEFAULT_CRAWL_DEPTH || '1', 10);
  const maxDepth = parseInt(process.env.NEXT_PUBLIC_MAX_CRAWL_DEPTH || '5', 10);
  
  const [crawlDepth, setCrawlDepth] = useState(defaultDepth);
  const [includeImages, setIncludeImages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // 初期値を環境変数から設定
    setCrawlDepth(defaultDepth);
  }, [defaultDepth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!url) {
      setError('URLを入力してください');
      return;
    }

    try {
      // URLの形式チェック
      new URL(url);
    } catch (e) {
      setError(`有効なURLを入力してください: ${e}`);
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      const response = await startConversion({
        url,
        options: {
          crawlDepth,
          includeImages
        }
      });
      
      setTaskId(response.taskId);
      
      // 進捗状況のポーリングを開始
      const intervalId = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/tasks/${response.taskId}`);
          const data = await statusResponse.json();
          
          setProgress(data.progress);
          
          if (data.status === 'completed') {
            clearInterval(intervalId);
            router.push(`/result/${response.taskId}`);
          } else if (data.status === 'failed') {
            clearInterval(intervalId);
            setError('変換処理に失敗しました');
            setLoading(false);
          }
        } catch (err) {
          console.error('Progress check failed:', err);
        }
      }, 2000);
      
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('変換処理の開始に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Web2Markdown</CardTitle>
          <CardDescription className="text-center">
            ウェブサイトをクローリングしてMarkdown形式に変換します
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading && taskId ? (
            <div className="space-y-4">
              <p className="text-center">変換処理中...</p>
              <ProgressBar progress={progress} />
              <p className="text-sm text-center text-muted-foreground">
                大きなサイトの場合は時間がかかることがあります
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">ウェブサイトURL</Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="crawlDepth">クロール深度: {crawlDepth}</Label>
                  <span className="text-sm text-muted-foreground">
                    {crawlDepth === 1 ? '初期ページのみ' : `${crawlDepth}ページまで`}
                  </span>
                </div>
                <Slider
                  id="crawlDepth"
                  min={1}
                  max={maxDepth}
                  step={1}
                  value={[crawlDepth]}
                  onValueChange={(values) => setCrawlDepth(values[0])}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeImages"
                  checked={includeImages}
                  onCheckedChange={setIncludeImages}
                  disabled={loading}
                />
                <Label htmlFor="includeImages">画像を含める</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '処理中...' : '変換開始'}
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>MarkItDownを使用して、ウェブサイトのコンテンツを簡単にMarkdown形式に変換できます</p>
        </CardFooter>
      </Card>
    </div>
  );
}