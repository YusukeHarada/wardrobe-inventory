@AGENTS.md

# ワードローブ資産管理アプリ

棚卸しと買い替え管理に特化したクローゼット管理アプリ。ファッション・コーディネート機能は含まない。

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動 (localhost:3000)
npm run build        # 本番ビルド
npm run lint         # ESLint
npm test             # Vitest 単体テスト
npm run test:e2e     # Playwright E2E テスト
```

## 技術スタック

| 役割 | ライブラリ / サービス |
|------|----------------------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 + TypeScript + Tailwind CSS v4 |
| フォーム | react-hook-form + zod |
| 日付 | date-fns v4 (ja ロケール) |
| グラフ | recharts |
| 認証 | Firebase Authentication (Google) |
| DB | Cloud Firestore |
| テスト | Vitest + React Testing Library + Playwright |

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx              # ルートレイアウト（AuthProvider）
│   ├── page.tsx                # / → /dashboard or /login にリダイレクト
│   ├── (auth)/login/           # ログインページ（認証不要）
│   └── (app)/                  # 認証必須グループ
│       ├── layout.tsx          # AuthGuard + NavBar
│       ├── dashboard/
│       ├── items/              # 一覧・新規・詳細・編集・取引
│       ├── replacements/       # 買い替え候補
│       ├── wishlist/           # ウィッシュリスト
│       └── statistics/         # 集計
├── components/
│   ├── ui/                     # Button, Input, Select, Textarea, Badge, Card, Modal, LoadingSpinner, EmptyState
│   ├── layout/                 # AuthGuard, NavBar, PageHeader
│   ├── auth/                   # GoogleSignInButton
│   ├── items/                  # ItemForm, ItemCard, ItemList, ItemFilterBar, ItemStatusBadge, TransactionForm
│   ├── replacements/           # ReplacementCard
│   ├── wishlist/               # WishlistForm, WishlistCard
│   ├── dashboard/              # StatCard, ReplacementAlert
│   └── statistics/             # CategoryBreakdownChart, MonthlyExpenseChart, AnnualSummaryTable
├── hooks/                      # useItems, useItem, useTransactions, useWishlist, useReplacements, useStatistics
├── lib/
│   ├── firebase.ts             # getApps() ガード付き initializeApp
│   ├── firestore/              # items.ts, transactions.ts, wishlist.ts
│   └── utils/                  # cn.ts, date.ts, replacement.ts, statistics.ts
├── types/                      # item.ts, transaction.ts, wishlist.ts
└── contexts/
    └── AuthContext.tsx         # Firebase Auth 状態管理
```

## データモデル（Firestore）

```
items/{itemId}
  userId, name, category, managementType ('individual' | 'lot')
  purchaseDate (ISO string), purchasePrice, expectedLifeMonths
  quantity, remainingQuantity   ← ロット管理のみ使用
  memo, createdAt (Timestamp), updatedAt (Timestamp)

  transactions/{transactionId}
    itemId, userId, type ('purchase' | 'disposal')
    quantity, transactionDate (ISO string), memo, createdAt (Timestamp)

wishlist/{wishlistId}
  userId, name, category, expectedPrice, memo, createdAt, updatedAt
```

Firestore の `Timestamp` は converter で ISO 文字列に変換し、UI 全体で `.toDate()` 呼び出しを排除している。

## 認証

**`signInWithPopup` のみ使用。`signInWithRedirect` は禁止。**

理由：`signInWithRedirect` はリダイレクト前に状態を `sessionStorage` に保存するが、iOS Safari の ITP（Intelligent Tracking Prevention）がクロスオリジンリダイレクト後に `sessionStorage` を消去するため、「missing initial state」エラーで認証が失敗する。`signInWithPopup` はポップアップ + `postMessage` で通信するため `sessionStorage` を使用せず、iOS Safari でも動作する。

```typescript
// AuthContext.tsx — ローディング状態は onAuthStateChanged 内で解決
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    setUser(u);
    setLoading(false);  // ここで setLoading する。useEffect の外で行うと競合する
  });
  return unsubscribe;
}, []);
```

## Firestore の重要パターン

### 原子的な残数更新（transactions.ts）
`createTransaction` は `runTransaction` でトランザクション登録とアイテムの `remainingQuantity` 更新を1つのトランザクションで実行する。複数タブからの同時更新でも整合性が保たれる。

### リアルタイムリスナー
`subscribeItems` / `subscribeTransactions` は `onSnapshot` を使う。`(app)/layout.tsx` の Context で一度だけリスナーを張り、各ページは Context を消費する（重複リスナー防止）。

## ビジネスロジック

### 買い替え候補（`src/lib/utils/replacement.ts`）
- **個体管理**：想定寿命超過のみ
- **ロット管理**：残数が総数の 25% 以下（`LOT_LOW_STOCK_THRESHOLD = 0.25`）OR 想定寿命超過

### カテゴリ
`'衣類' | '靴' | '靴下' | '下着' | 'バッグ' | '帽子' | 'その他'`（`src/lib/constants.ts`）

## Firestore セキュリティルール

`create` と `read/update/delete` でルールを分離している。`create` 時は `resource` が null なので `resource.data` を参照するとエラーになるため。

統計ページ（CollectionGroup クエリ）用に `/{path=**}/transactions/{transactionId}` の read ルールが必要。`userId` を Transaction ドキュメントに保存しているのはこのため。

## ナビゲーション

- モバイル（デフォルト）：画面下部固定タブバー（5タブ）
- デスクトップ（`sm:` 以上）：左サイドバー（幅 `w-56`、`pl-56` でコンテンツをオフセット）
- 買い替え候補数をバッジ表示

## スラッシュコマンド

- `/stack` — 技術スタック一覧を表示（`.claude/commands/stack.md`）
