// src/app/api/tasks/[taskid]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// タスクのステータスを取得するAPIルート
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskid: string }> }
) {
  try {
    const { taskid } = await params;
    
    if (!taskid) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    // FastAPIバックエンドにステータスリクエストを転送
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    const backendResponse = await fetch(`${backendUrl}/api/tasks/${taskid}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch task status' },
        { status: backendResponse.status }
      );
    }
    
    const data = await backendResponse.json();
    
    // バックエンドからのレスポンスをクライアント向けに整形
    return NextResponse.json({
      taskId: data.task_id,
      status: data.status,
      progress: data.progress,
      message: data.message,
    });
    
  } catch (error) {
    console.error(`Error in /api/tasks/${(await params).taskid}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}