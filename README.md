# MarkItDown - ウェブサイトクローラー＆変換アプリケーション（フロントエンド）

![Next.js](https://img.shields.io/badge/Next.js-15.2.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-green)

## 📖 概要

MarkItDownは、ウェブサイトのURLを入力すると、そのサイトをクローリング・スクレイピングし、Markdown形式に変換するWebアプリケーションです。フロントエンドはNext.js、TypeScript、Tailwind CSSを使用して構築されています。

## ✨ 機能

- ウェブサイトのURL入力によるクローリング開始
- クロール深度とオプションのカスタマイズ
- リアルタイム進捗状況の表示
- 変換結果のMarkdownプレビュー表示
- Markdownのコピーとダウンロード機能
- レスポンシブデザインによるマルチデバイス対応

## 🛠️ 技術スタック

- **Next.js 15.2.2**: Reactベースのフレームワーク (App Router)
- **TypeScript**: 型安全なコード開発
- **Tailwind CSS v4**: ユーティリティファーストCSSフレームワーク
- **shadcn/ui**: 再利用可能なUIコンポーネント
- **Axios**: HTTP通信ライブラリ（API呼び出し用）
- **Lucide Icons**: モダンなアイコンライブラリ

## 🚀 セットアップ方法

### 前提条件

- Node.js 20.x以上
- npm または yarn または pnpm または bun
- バックエンドAPIサーバーのセットアップ（別リポジトリ）

### インストール

1. リポジトリをクローンする:

```bash
git clone https://github.com/your-username/markitdown-frontend.git
cd markitdown-frontend
```

2. 依存関係をインストールする:

```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

3. 環境変数の設定:

`.env.example` ファイルを `.env.local` にコピーして適切な値を設定します:

```bash
cp .env.example .env.local
```

4. 開発サーバーを起動する:

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## 🧩 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `BACKEND_API_URL` | バックエンドAPIのURL | `http://localhost:8000` |
| `NEXT_PUBLIC_MAX_CRAWL_DEPTH` | 最大クロール深度 | `5` |
| `NEXT_PUBLIC_DEFAULT_CRAWL_DEPTH` | デフォルトクロール深度 | `1` |

## 📁 プロジェクト構造

```
/
├── public/               # 静的ファイル
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes (バックエンドへのプロキシ)
│   │   ├── result/       # 結果表示ページ
│   │   └── page.tsx      # ホームページ (URL入力フォーム)
│   ├── components/       # Reactコンポーネント
│   │   ├── ui/           # shadcn/uiコンポーネント
│   │   └── ...           # カスタムコンポーネント
│   └── lib/              # ユーティリティ関数と型定義
├── .env.example          # 環境変数の例
├── next.config.ts        # Next.js設定
├── tailwind.config.js    # Tailwind CSS設定
└── tsconfig.json         # TypeScript設定
```

## 🌐 Vercelへのデプロイ

このプロジェクトはVercelに最適化されています。Vercelにデプロイするには以下の手順に従ってください：

1. [Vercel](https://vercel.com) にアクセスしてアカウントを作成します（まだの場合）
2. 新しいプロジェクトを作成し、GitHubリポジトリと連携します
3. 必要な環境変数を設定します
4. デプロイを開始します

あるいは、以下のボタンをクリックしてすぐにデプロイすることもできます：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fmarkitdown-frontend)

## 🔄 バックエンドとの連携

このフロントエンドアプリケーションは対応するバックエンドAPIサーバーと通信します。バックエンドのセットアップについては、バックエンドリポジトリのREADMEを参照してください。

## 📝 開発ガイドライン

### コード規約

- コンポーネントはTypeScriptで記述し、適切な型定義を行ってください
- コンポーネントは可能な限り再利用可能に設計してください
- tailwindのユーティリティクラスを使用してスタイリングしてください
- UIコンポーネントは可能な限りshadcn/uiを使用してください

### ブランチ戦略

- `main`: 本番環境用のコード
- `develop`: 開発環境用のコード
- `feature/*`: 新機能開発用の個別ブランチ
- `bugfix/*`: バグ修正用の個別ブランチ

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトを利用しています：

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ by [PONOTECH](https://github.com/your-username)
