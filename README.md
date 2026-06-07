# Wardrobe Inventory

ワードローブ資産管理アプリ — 衣類・靴・下着・靴下などの所有物を棚卸しし、買い替え時期を把握するためのWebアプリです。

## 機能

- **Google認証** — Googleアカウントでログイン。ユーザーごとにデータを完全分離
- **アイテム管理** — 登録・編集・削除・一覧表示（検索／フィルタ／ソート）
- **2種類の管理方式**
  - 個体管理：スーツ・コート・革靴など高価な長寿命品を1件ずつ管理
  - ロット管理：靴下・下着など数量で管理し、購入・廃棄で残数を追跡
- **買い替え候補表示** — 想定寿命超過またはロット残数が25%以下のアイテムを自動抽出
- **ウィッシュリスト** — 購入予定品の管理。購入済みへの変換リンク付き
- **ダッシュボード** — 保有数・買い替え候補数のKPI表示
- **統計** — カテゴリ別件数／購入金額（円グラフ）、月次推移（棒グラフ）、年次サマリー

## 技術スタック

| 区分 | 技術 |
|------|------|
| フロントエンド | Next.js 14 (App Router) / TypeScript / Tailwind CSS |
| バックエンド | Firebase Authentication / Cloud Firestore |
| フォーム | react-hook-form + zod |
| チャート | Recharts |
| テスト | Vitest / React Testing Library / Playwright |
| ホスティング | Vercel |

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/YusukeHarada/wardrobe-inventory.git
cd wardrobe-inventory
npm install
```

### 2. Firebase プロジェクトを用意

[Firebase Console](https://console.firebase.google.com/) で新しいプロジェクトを作成し、以下を有効化してください。

- Authentication → Google プロバイダーを有効化
- Firestore Database → 本番モードで作成

### 3. 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成し、Firebaseの設定値を入力します。

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Firestore セキュリティルールをデプロイ

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # 既存プロジェクトを選択、firestore.rules を使用
firebase deploy --only firestore:rules
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

`http://localhost:3000` を開いてGoogleログインを確認してください。

## テスト

```bash
# 単体テスト（ユーティリティ・ビジネスロジック）
npm test

# ウォッチモード
npm run test:watch

# E2Eテスト（Firebase Emulator が必要）
npm run test:e2e
```

## ディレクトリ構成

```
src/
├── app/
│   ├── (auth)/login/        # ログインページ
│   └── (app)/               # 認証必須ルートグループ
│       ├── dashboard/        # ダッシュボード
│       ├── items/            # アイテム一覧・詳細・登録・編集・取引
│       ├── replacements/     # 買い替え候補
│       ├── wishlist/         # ウィッシュリスト
│       └── statistics/       # 統計
├── components/
│   ├── ui/                  # 汎用UIプリミティブ
│   ├── layout/              # NavBar・AuthGuard
│   ├── items/               # アイテム関連コンポーネント
│   ├── dashboard/           # ダッシュボードウィジェット
│   ├── statistics/          # チャートコンポーネント
│   └── wishlist/            # ウィッシュリストコンポーネント
├── hooks/                   # Firestoreリアルタイムフック
├── lib/
│   ├── firebase.ts          # Firebase初期化
│   ├── firestore/           # Firestoreアクセス層
│   └── utils/               # 日付・買い替え・統計ユーティリティ
├── types/                   # TypeScript型定義
└── contexts/                # AuthContext
```

## Vercel へのデプロイ

1. [Vercel](https://vercel.com/) にリポジトリを連携
2. Environment Variables に `.env.local` の値を設定
3. デプロイ実行（`main` ブランチへのマージで自動デプロイ）

## データモデル

```
Firestore
├── items/{itemId}
│   ├── userId, name, category, managementType
│   ├── purchaseDate, purchasePrice, expectedLifeMonths
│   ├── quantity, remainingQuantity  ← ロット管理のみ
│   ├── memo, createdAt, updatedAt
│   └── transactions/{transactionId}
│       └── userId, type, quantity, transactionDate, memo, createdAt
└── wishlist/{wishlistId}
    └── userId, name, category, expectedPrice, memo, createdAt, updatedAt
```
