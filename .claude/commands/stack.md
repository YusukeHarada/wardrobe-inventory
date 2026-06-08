# ワードローブ資産管理アプリ 技術スタック

このプロジェクトの技術構成を整理して表示する。

## フロントエンド
| 役割 | ライブラリ | バージョン |
|------|-----------|-----------|
| フレームワーク | Next.js (App Router) | 16.2.7 |
| UI ランタイム | React | 19.2.4 |
| 言語 | TypeScript | ^5 |
| スタイリング | Tailwind CSS | ^4 |
| クラス結合 | clsx + tailwind-merge | ^2 / ^3 |
| アイコン | lucide-react | ^1.17 |
| グラフ | recharts | ^3.8 |

## フォーム・バリデーション
| 役割 | ライブラリ |
|------|-----------|
| フォーム管理 | react-hook-form ^7 |
| スキーマ検証 | zod ^4 |
| リゾルバー連携 | @hookform/resolvers ^5 |

## バックエンド / BaaS
| 役割 | サービス |
|------|---------|
| 認証 | Firebase Authentication（Googleログイン、signInWithPopup のみ） |
| データベース | Cloud Firestore（リアルタイムリスナー onSnapshot） |
| SDK | firebase ^12 |

## ユーティリティ
| 役割 | ライブラリ |
|------|-----------|
| 日付処理 | date-fns ^4（ja ロケール） |

## テスト
| 役割 | ライブラリ |
|------|-----------|
| 単体・コンポーネント | Vitest ^4 + React Testing Library ^16 |
| DOM 検証 | @testing-library/jest-dom |
| E2E | Playwright ^1.60 |
| テスト DOM | jsdom ^29 |

## ディレクトリ構成
```
src/
├── app/           # Next.js App Router
│   ├── (auth)/    # ログインページ
│   └── (app)/     # 認証必須ページ（dashboard, items, replacements, wishlist, statistics）
├── components/    # ui/ layout/ auth/ items/ dashboard/ statistics/ wishlist/ replacements/
├── hooks/         # useItems, useItem, useTransactions, useWishlist, useReplacements, useStatistics
├── lib/
│   ├── firebase.ts
│   ├── firestore/  # items.ts, transactions.ts, wishlist.ts
│   └── utils/      # cn.ts, date.ts, replacement.ts, statistics.ts
├── types/          # Item, Transaction, WishlistItem
└── contexts/       # AuthContext（signInWithPopup）
```

## 認証の注意点
- `signInWithPopup` のみ使用（iOS Safari の ITP で sessionStorage が消去されるため `signInWithRedirect` は使用禁止）
- `onAuthStateChanged` でローディング状態を管理

## データモデル（Firestore）
```
items/{itemId}           # userId, name, category, managementType, purchaseDate, purchasePrice, expectedLifeMonths, quantity, remainingQuantity, memo
  └── transactions/{id}  # itemId, userId, type(purchase/disposal), quantity, transactionDate, memo

wishlist/{wishlistId}    # userId, name, category, expectedPrice, memo
```

## 買い替え候補ロジック
- 個体管理：想定寿命超過のみ
- ロット管理：残数が総数の 25% 以下 OR 想定寿命超過
