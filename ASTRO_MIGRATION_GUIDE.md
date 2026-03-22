# Astro 網站開發與檔案放置指南 (Migration Guide)

恭喜！你的個人網站已經成功從 Jekyll 轉換至現代化的 **Astro** 架構。
Astro 是一個極速、基於前端生態系的靜態網站生成器。以下是專屬於你的操作指南，讓你未來在寫文章、加專案時能得心應手！

---

## 🚀 常用指令
請使用你的終端機 (Terminal / PowerShell)，在專案資料夾底下輸入以下指令：

| 指令 | 說明 |
| --- | --- |
| `npm run dev` | **在本地端啟動開發伺服器** (預設網址 `http://localhost:4321`)。修改檔案存檔後，瀏覽器會 **自動更新畫面**！ |
| `npm run build` | **產生靜態網頁檔案**。若要在本地測試編譯結果，可以執行此指令。Astro 會把結果打包到 `dist/` 目錄。 |
| `npm run preview` | 預覽剛剛 build 出來的靜態結果。 |

> **提示**：我們已經設定好 GitHub Actions。以後只要把修改 `git push` 到 GitHub，GitHub 就會自動幫你執行 `npm run build` 並更新你的網站，你不需要在本地手動上傳編譯後的檔案！

---

## 📂 檔案放置規則 (File Structure rules)

在新的 Astro 架構下，請遵守以下規則來存放你的內容：

### 1. 📝 新增部落格文章 -> `src/content/blog/`
所有的**技術筆記、日誌**都必須放在這裡。你可以繼續使用原本熟悉的 Markdown (`.md`)。

💡 **必填的檔案開頭 (Frontmatter) 格式**：
```md
---
title: "你的文章標題"
description: "簡短描述這篇文章"
pubDate: "2025-09-02"       # 必填，請用 YYYY-MM-DD 格式
heroImage: "/blog-placeholder-1.jpg" # (可選) 封面圖片路徑
---

你的文章內容開始...
```

### 2. 🗂️ 新增獨立頁面 -> `src/pages/`
像是首頁 (`index.astro`)、關於我 (`about.md`)、專案列表 (`projects.md`) 都在這裡。
放在這裡的檔案名稱，會自動變成網址。例如 `src/pages/hello.md` 就會變成 `https://wright0418.github.io/hello`。

如果你想要建立一個簡單的 `.md` 頁面，並套用基礎版型，請加上 Layout：
```md
---
title: "我的新頁面"
description: "頁面描述"
layout: ../layouts/Page.astro
---
```

### 3. 🖼️ 新增圖片與靜態檔案 -> `public/`
不需要經過 Astro 加工的檔案（例如圖片、履歷 PDF、favicon）請放在 `public/` 目錄下。
- 若你放了一張圖在 `public/images/test.png`
- 在文章或網頁中引用的路徑就是：`/images/test.png`

### 4. 🧩 修改版面元件 -> `src/components/`
如果你想要客製化網站的外觀，像是導覽列 (`Header.astro`) 或頁尾 (`Footer.astro`)，可以在此資料夾內修改 HTML 與 CSS。

---

## 🔧 未來擴充潛能
Astro 原生支援整合 React、Vue、Svelte 等現代前端框架。若未來你想在部落格加入複雜的互動功能（如：計算機、動態圖表），你隨時可以透過擴充指令來整合！
