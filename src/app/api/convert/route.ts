// src/app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// このAPIルートはクライアントからのリクエストを受け取り、バックエンドAPIに転送します
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // URLバリデーション
    if (!body.url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    try {
      new URL(body.url);
    } catch (e) {
      return NextResponse.json(
        { error: `Invalid URL format: ${e}` },
        { status: 400 }
      );
    }
    
    // 環境変数からクロール深度の制限値を取得
    const maxCrawlDepth = parseInt(process.env.MAX_CRAWL_DEPTH || '5', 10);
    
    // クロール深度が最大値を超えていないか確認
    if (body.options?.crawlDepth > maxCrawlDepth) {
      body.options.crawlDepth = maxCrawlDepth;
    }
    
    // タスクIDを生成
    const taskId = uuidv4();
    
    // FastAPIバックエンドにリクエストを転送
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend API URL is not configured' },
        { status: 500 }
      );
    }
    
    const backendResponse = await fetch(`${backendUrl}/api/convert/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: body.url,
        options: body.options,
        task_id: taskId,
      }),
    });
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to start conversion' },
        { status: backendResponse.status }
      );
    }
    
    // 成功レスポンス
    return NextResponse.json({ taskId });
    
  } catch (error) {
    console.error('Error in /api/convert:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}