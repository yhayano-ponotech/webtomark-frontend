import ResultPageClient from './ResultPageClient';

interface PageProps {
  params: Promise<{ taskid: string }>;
}

export default async function Page({ params }: PageProps) {
  // サーバーコンポーネントでパラメータを解決
  const resolvedParams = await params;
  // 解決したパラメータをクライアントコンポーネントに渡す
  return <ResultPageClient params={resolvedParams} />;
}
