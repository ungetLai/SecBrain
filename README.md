# 第二大腦 (Second Brain) Dashboard

這是一個建置在 [Zeabur](https://zeabur.com/) 上的「第二大腦」個人知識管理 Dashboard。透過此系統，您可以快速收集碎片化的想法或網頁連結，並透過 AI Agent 進行後續的整理與轉換。

## 🌟 核心功能

1. **快速輸入介面**:
   - 提供簡潔的 Dashboard 讓您貼上文案或網址。
   - 提交後自動寫入 PostgreSQL 資料庫。
   - 每筆筆記自動產生：`筆記 ID`、`建立時間`、`筆記內容`、`Markdown 格式 (預設空)`、`狀態 (預設為 Backlog)`。

2. **Backlog 筆記清單**:
   - 輸入框下方即時顯示目前所有 `Backlog` 狀態的筆記清單。
   - 新增筆記後自動刷新列表。
   - 每筆筆記卡片提供刪除按鈕 (Hover 後顯示)，方便人工清除輸入錯誤的內容。

3. **動態資料表建立**:
   - 首次寫入時，系統會自動偵測 `Note` 資料表是否存在。
   - 若資料表不存在，會自動透過原生 SQL 建立 (`CREATE TABLE IF NOT EXISTS`)，不會影響資料庫中的其他既有資料表。

4. **API 服務 (供 AI Agent 使用)**:

   | 方法 | 路徑 | 說明 |
   |------|------|------|
   | `POST` | `/api/notes` | 新增筆記，狀態預設為 `Backlog` |
   | `GET` | `/api/notes/backlog` | 取得所有 `Backlog` 狀態的筆記清單 |
   | `PUT` | `/api/notes/done` | 更新筆記內容為 Markdown 格式，狀態改為 `Done` |
   | `PUT` | `/api/notes/failed` | 將筆記狀態標記為 `Failed` |
   | `DELETE` | `/api/notes/[id]` | 刪除指定筆記 |

## 🛠️ 技術棧

- **前端框架**: Next.js (App Router)
- **視覺與樣式**: Tailwind CSS
- **資料庫 ORM**: Prisma
- **資料庫**: PostgreSQL (託管於 Zeabur)
- **部署平台**: Zeabur

## 🚀 本地開發指南

### 環境變數設定

請在 Zeabur 的環境變數設定中，或是本地的 `.env` 檔案中加入：

```env
POSTGRES_CONNECTION_STRING="postgresql://<使用者名稱>:<密碼>@<主機位置>:<連接埠>/<資料庫名稱>?schema=public"
# Zeabur PostgreSQL 服務啟動後會自動注入此變數
```

### 安裝依賴與啟動

```bash
# 1. 安裝套件
npm install

# 2. 產生 Prisma Client
npx prisma generate

# 3. 啟動開發伺服器
npm run dev
```

開啟瀏覽器並前往 [http://localhost:3000](http://localhost:3000) 即可瀏覽 Dashboard。

> **提示**: 不需要手動執行 `npx prisma db push`，系統會在首次寫入筆記時自動建立資料表。

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
  Archive
}
```

## 🤖 AI Agent 整合

本系統的設計初衷是與 AI Agent 協同工作：

1. 您透過 UI 將原始內容 (網址或草稿) 丟入 `Backlog`。
2. AI Agent 透過 `GET /api/notes/backlog` 取得待處理事項。
3. AI Agent 進行摘要、爬蟲或格式化處理。
4. 處理成功後，AI Agent 呼叫 `PUT /api/notes/done` 寫回漂亮排版的 Markdown。
5. 處理失敗時，呼叫 `PUT /api/notes/failed` 以便後續人工介入。

## 🔗 Zeabur 自動部署

本專案已連結 GitHub Repository，每次 `git push` 後 Zeabur 會自動觸發建置與部署。

> 若自動部署未觸發，請至 GitHub → Settings → Applications → Zeabur → Configure，確認 **Repository access** 中已包含此 Repository。
