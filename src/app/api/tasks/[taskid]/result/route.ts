// src/app/api/tasks/[taskId]/result/route.ts
import { NextRequest, NextResponse } from 'next/server';

// タスクの結果を取得するAPIルート
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    // FastAPIバックエンドに結果リクエストを転送
    const backendUrl = process.env.BACKEND_API_URL;
    
    const backendResponse = await fetch(`${backendUrl}/api/tasks/${taskId}/result/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch task result' },
        { status: backendResponse.status }
      );
    }
    
    const data = await backendResponse.json();
    
    // バックエンドからのレスポンスをクライアント向けに整形
    return NextResponse.json({
      taskId: data.task_id,
      markdown: data.markdown,
      metadata: {
        sourceUrl: data.metadata.source_url,
        title: data.metadata.title,
        pageCount: data.metadata.page_count,
        crawlDepth: data.metadata.crawl_depth,
        includeImages: data.metadata.include_images,
        convertedAt: data.metadata.converted_at,
      },
    });
    
  } catch (error) {
    console.error(`Error in /api/tasks/${params.taskId}/result:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}