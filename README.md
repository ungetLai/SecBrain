# 第二大腦 (Second Brain) Dashboard

這是一個建置在 [Zeabur](https://zeabur.com/) 上的「第二大腦」個人知識管理 Dashboard。透過此系統，您可以快速收集碎片化的想法或網頁連結，並透過 AI Agent 進行後續的整理與轉換。

## 🌟 核心功能

1. **快速輸入介面**:
   - 提供簡潔的 Dashboard 讓您貼上文案或網址。
   - 提交後自動寫入 PostgreSQL 資料庫。
   - 每筆筆記自動產生：`筆記 ID`、`建立時間`、`筆記內容`、`Markdown 格式 (預設空)`、`狀態 (預設為 Backlog)`。

2. **API 服務**:
   - `GET /api/notes/backlog`: 取得目前狀態為 `Backlog` 的待處理清單。
   - `PUT /api/notes/done`: 供 AI Agent 呼叫，將筆記內容更新為 Markdown 格式，並將狀態標記為 `Done`。
   - `PUT /api/notes/failed`: 供 AI Agent 呼叫，若處理失敗則將狀態標記為 `Failed`。

## 🛠️ 技術棧

- **前進端框架**: Next.js (App Router)
- **視覺與樣式**: Tailwind CSS
- **資料庫 ORM**: Prisma
- **資料庫**: PostgreSQL (託管於 Zeabur)
- **部署平台**: Zeabur

## 🚀 本地開發指南

### 環境變數設定

請在專案根目錄建立 `.env` 檔案，並設定您的 PostgreSQL 連線字串 (可從 Zeabur 取得)：

```env
DATABASE_URL="postgresql://<使用者名稱>:<密碼>@<主機位置>:<連接埠>/<資料庫名稱>?schema=public"
```

### 安裝依賴與啟動

```bash
# 1. 安裝套件
npm install

# 2. 同步資料庫 Schema
npx prisma db push

# 3. 產生 Prisma Client
npx prisma generate

# 4. 啟動開發伺服器
npm run dev
```

開啟瀏覽器並前往 [http://localhost:3000](http://localhost:3000) 即可瀏覽 Dashboard。

## 📦 資料表結構 (Schema)

使用 Prisma 定義的 `Note` 模型：

```prisma
model Note {
  id        String     @id @default(cuid())
  createdAt DateTime   @default(now())
  content   String
  markdown  String?
  status    NoteStatus @default(Backlog)
}

enum NoteStatus {
  Backlog
  Failed
  Done
}
```

## 🤖 AI Agent 整合

本系統的設計初衷是與 AI Agent 協同工作：

1. 您透過 UI 將原始內容 (網址或草稿) 丟入 `Backlog`。
2. AI Agent 透過 `GET /api/notes/backlog` 取得待處理事項。
3. AI Agent 進行摘要、爬蟲或格式化處理。
4. 處理成功後，AI Agent 呼叫 `PUT /api/notes/done` 寫回漂亮排版的 Markdown。
5. 處理失敗時，呼叫 `PUT /api/notes/failed` 以便後續人工介入。
