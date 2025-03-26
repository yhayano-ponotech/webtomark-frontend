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
import { AlertCircle, Globe, FileUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { startConversion, uploadAndConvert, getTaskStatus } from '@/lib/api';
import { ProgressBar } from '@/components/progress-bar';
import { FileUpload } from '@/components/file-upload';

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
  const [activeTab, setActiveTab] = useState('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    // 初期値を環境変数から設定
    setCrawlDepth(defaultDepth);
  }, [defaultDepth]);

  // タスク進捗のポーリング関数
  const pollTaskProgress = async (taskId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await getTaskStatus(taskId);
        
        setProgress(statusResponse.progress);
        
        if (statusResponse.status === 'completed') {
          clearInterval(intervalId);
          router.push(`/result/${taskId}`);
        } else if (statusResponse.status === 'failed') {
          clearInterval(intervalId);
          setError('変換処理に失敗しました: ' + (statusResponse.message || '不明なエラー'));
          setLoading(false);
        }
      } catch (err) {
        console.error('Progress check failed:', err);
      }
    }, 2000);
    
    // コンポーネントのクリーンアップ時にインターバルをクリア
    return () => clearInterval(intervalId);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!url) {
      setError('URLを入力してください');
      return;
    }

    try {
      // URLの形式チェック
      new URL(url.startsWith('http') ? url : `https://${url}`);
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
      pollTaskProgress(response.taskId);
      
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('変換処理の開始に失敗しました');
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('ファイルを選択してください');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await uploadAndConvert(selectedFile);
      
      setTaskId(response.taskId);
      
      // 進捗状況のポーリングを開始
      pollTaskProgress(response.taskId);
      
    } catch (err) {
      console.error('File upload failed:', err);
      setError('ファイルのアップロードに失敗しました');
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const renderUrlTab = () => (
    <form onSubmit={handleUrlSubmit} className="space-y-6">
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
  );

  const renderFileTab = () => (
    <div className="space-y-6">
      <FileUpload 
        disabled={loading} 
        onFileSelect={handleFileSelect} 
      />
      
      <Button 
        onClick={handleFileUpload} 
        className="w-full" 
        disabled={loading || !selectedFile}
      >
        {loading ? '処理中...' : 'ファイルを変換'}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Web2Markdown</CardTitle>
          <CardDescription className="text-center">
            ウェブサイトやファイルをMarkdown形式に変換します
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
                処理に時間がかかる場合があります
              </p>
            </div>
          ) : (
            <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="url">
                  <Globe className="h-4 w-4 mr-2" />
                  URLから変換
                </TabsTrigger>
                <TabsTrigger value="file">
                  <FileUp className="h-4 w-4 mr-2" />
                  ファイルから変換
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                {renderUrlTab()}
              </TabsContent>
              
              <TabsContent value="file">
                {renderFileTab()}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>MarkItDownを使用して、ウェブサイトやファイルを簡単にMarkdown形式に変換できます</p>
        </CardFooter>
      </Card>
    </div>
  );
}