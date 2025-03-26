// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // multipart/form-dataからファイルを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }
    
    // ファイルサイズチェック (10MB上限)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以下にしてください' },
        { status: 400 }
      );
    }
    
    // バイナリデータの取得
    const fileBuffer = await file.arrayBuffer();
    
    // タスクIDの生成
    const taskId = uuidv4();
    
    // FastAPIバックエンドにリクエストを転送
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend API URL is not configured' },
        { status: 500 }
      );
    }
    
    // フォームデータの作成
    const backendFormData = new FormData();
    backendFormData.append('task_id', taskId);
    backendFormData.append('file', new Blob([fileBuffer]), file.name);
    
    // バックエンドAPIにファイルを送信
    const backendResponse = await fetch(`${backendUrl}/api/convert/file/`, {
      method: 'POST',
      body: backendFormData,
    });
    
    if (!backendResponse.ok) {
      let errorDetail = 'ファイルの変換開始に失敗しました';
      try {
        const errorData = await backendResponse.json();
        errorDetail = errorData.detail || errorDetail;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // JSONのパースに失敗した場合はデフォルトエラーメッセージを使用
      }
      
      return NextResponse.json(
        { error: errorDetail },
        { status: backendResponse.status }
      );
    }
    
    // 成功レスポンス
    return NextResponse.json({ taskId });
    
  } catch (error) {
    console.error('Error in /api/upload:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// POSTリクエストのサイズ制限を大きくする設定
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};