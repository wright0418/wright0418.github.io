# Copilot Instructions for wright0418.github.io

## 專案概覽
- 本專案為 Wright 吳奇峯的個人網站，採用 Jekyll 架構，部署於 GitHub Pages。
- 主要內容包括個人網誌 (`_posts/`)、靜態頁面（如 `about.md`, `projects.md`, `categories.md`）、與設定檔（如 `_config.yml`）。
- 網站使用 `jekyll-theme-midnight` 佈景主題，包含自訂 CSS 樣式。

## 重要結構
- `_posts/`：所有部落格文章，檔名格式為 `YYYY-MM-DD-title.md`，內容採用 Markdown，前置 YAML 標頭（front matter）定義標題、日期、分類與標籤等。
- 根目錄 Markdown 檔案：`index.md`, `about.md`, `projects.md`, `categories.md` 為主要頁面。
- `category/`：分類頁面目錄，包含各個分類的專屬頁面（如 `ai.md`, `技術分享.md` 等）。
- `assets/`：靜態資源目錄，包含 CSS 樣式 (`styles.css`)、圖片 (`image/`, `images/`) 等。
- `_layouts/`：Jekyll 布局模板，包含 `category.html` 用於分類頁面展示。
- `_config.yml`：Jekyll 與 GitHub Pages 的設定檔，包含網站標題、描述、佈景主題等。

## 關鍵工作流程
- **新增文章**：在 `_posts/` 依照 `YYYY-MM-DD-title.md` 命名新增 Markdown 檔案，並加上 YAML front matter。
- **新增分類**：在 `category/` 目錄建立對應的分類頁面（如 `新分類.md`），並在 `categories.md` 中加入相應的分類連結。
- **圖片管理**：將圖片放在 `assets/image/posts/YYYY-MM-DD-title/` 目錄下，並在文章中使用相對路徑引用。
- **部署**：推送至 `main` 分支後，GitHub Pages 會自動建置並部署。

## 專案慣例
- 文章檔案必須有正確的日期與標題格式，YAML front matter 至少包含 `title`、`date`、`categories` 與 `tags`。
- 所有靜態頁面皆採用 Markdown 格式，並可加入 YAML front matter。
- 分類系統：使用 `categories` 陣列定義文章分類，常用分類包括：
  - `AI`：人工智慧相關內容
  - `教學心得`：教學經驗與心得分享
  - `技術分享`：技術筆記與分享
  - `embedded-Linux`：嵌入式 Linux 相關
  - `工具分享`：開發工具與軟體分享
  - `提示工程`：AI 提示工程相關
  - `生活思考`：個人生活與思考
- 標籤系統：使用 `tags` 陣列提供更細緻的內容標記。
- 設定檔 `_config.yml` 為唯一 Jekyll 設定來源，請勿分散設定於其他檔案。
- 自訂樣式：使用 `assets/styles.css` 進行額外樣式定義，包含響應式設計。

## 整合與外部依賴
- 依賴 Jekyll 與 GitHub Pages，無額外 build/test script。
- 使用 `jekyll-theme-midnight` 佈景主題。
- 外掛程式：`jekyll-feed`（RSS 摘要）、`jekyll-sitemap`（網站地圖）。
- 若需自訂佈景主題或外掛，請於 `_config.yml` 設定並於 Gemfile 安裝（本專案預設未見 Gemfile）。

## 典型修改範例
- 新增文章：
  ```md
  ---
  layout: default
  title: "新文章標題"
  date: 2025-09-18
  categories: [AI, 技術分享]
  tags: [Python, 機器學習, 教學]
  ---
  文章內容...
  
  ## 程式範例
  ```python
  def hello_world():
      print("Hello, World!")
  ```
  
  ![圖片描述](/assets/image/posts/2025-09-18-article-title/image.png)
  ```
- 新增分類頁面：
  ```md
  ---
  layout: category
  title: "新分類"
  category: "新分類"
  ---
  ```
- 修改設定：直接編輯 `_config.yml`，如更改網站標題、描述、佈景主題。

## 參考檔案
- `README.md`：簡要說明專案用途與技術。
- `_config.yml`：Jekyll 與 GitHub Pages 設定（使用 jekyll-theme-midnight）。
- `_posts/`：所有部落格文章。
- `category/`：各分類頁面（ai.md, 技術分享.md 等）。
- `categories.md`：分類索引頁面。
- `assets/styles.css`：自訂 CSS 樣式，包含響應式設計。
- `_layouts/category.html`：分類頁面布局模板。
- 根目錄 Markdown 檔案：主要靜態頁面。

## 作者資訊
- 作者：Wright 吳奇峯
- 主要技術：MCU firmware "C", Python, Javascript
- 興趣領域：物理, AI 類神經網路, 硬體系統設計, 半導體 MCU IC 架構
- 聯絡方式：wright0418.wu@gmail.com
- GitHub：wright0418
- YouTube 頻道：奶爸的教育

---
## 內容創作指導原則
- 文章中使用到的範例程式碼盡量使用 Python 為例。
- 作者如果沒有明確提到需要將程式寫入文章中，請不要隨意加入程式碼。
- 技術文章應包含清晰的標題結構、實際的程式碼範例（使用 ```python code fence）。
- 提供步驟化的操作指南和常見問題解決方案。
- 圖片應放置在 `assets/image/posts/` 對應的文章目錄下。
- 每篇文章都應該有適當的分類（categories）和標籤（tags）。

## 網站特色功能
- 分類系統：支援多層分類瀏覽，每個分類都有專屬頁面。
- 響應式設計：透過 `assets/styles.css` 提供不同螢幕尺寸的最佳閱讀體驗。
- 圖片支援：支援在文章中嵌入圖片，並有組織化的存放結構。
- RSS 訂閱：透過 jekyll-feed 外掛提供 RSS 摘要功能。
- 網站地圖：透過 jekyll-sitemap 外掛自動生成 sitemap.xml。
---
如有不明確或遺漏之處，請回饋以便補充或修正。
