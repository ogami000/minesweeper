### アプリURL
- https://ogami-app.com/

### 技術スタック
- フロントエンド: React (Vite, TypeScript)
- バックエンド: Ruby on Rails (APIモード)
- 認証: Devise + JWT
- データベース: MySQL
- インフラ: Docker, Nginx
- Xserver VPS 上に Docker Compose を利用してデプロイ

### 主な機能
- ユーザー登録 / ログイン（JWT認証）
- 記録のCRUD機能
- ランキング表示

### 工夫した点
- SPA構成にして、Rails API + React を分離
- JWTを使った認証処理を実装
- Docker Composeで開発環境を統一

### 今後の改善点
- テストコード（RSpec, Jest）の追加
- CI/CDパイプラインの構築
- パフォーマンス改善
