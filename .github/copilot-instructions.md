# Copilot Instructions for wright0418.github.io

## 專案概覽
- 本專案為 WrightWu 的個人網站，採用 Jekyll 架構，部署於 GitHub Pages。
- 主要內容包括個人網誌 (`_posts/`)、靜態頁面（如 `about.md`, `projects.md`）、與設定檔（如 `_config.yml`）。

## 重要結構
- `_posts/`：所有部落格文章，檔名格式為 `YYYY-MM-DD-title.md`，內容採用 Markdown，前置 YAML 標頭（front matter）定義標題、日期等。
- 根目錄 Markdown 檔案：`index.md`, `about.md`, `projects.md` 為主要頁面。
- `_config.yml`：Jekyll 與 GitHub Pages 的設定檔，包含網站標題、描述、導航、佈景主題等。

## 關鍵工作流程
- **新增文章**：在 `_posts/` 依照 `YYYY-MM-DD-title.md` 命名新增 Markdown 檔案，並加上 YAML front matter。

- **部署**：推送至 `main` 分支後，GitHub Pages 會自動建置並部署。

## 專案慣例
- 文章檔案必須有正確的日期與標題格式，YAML front matter 至少包含 `title` 與 `date`。
- 所有靜態頁面皆採用 Markdown 格式，並可加入 YAML front matter。
- 設定檔 `_config.yml` 為唯一 Jekyll 設定來源，請勿分散設定於其他檔案。

## 整合與外部依賴
- 依賴 Jekyll 與 GitHub Pages，無額外 build/test script。
- 若需自訂佈景主題或外掛，請於 `_config.yml` 設定並於 Gemfile 安裝（本專案預設未見 Gemfile）。

## 典型修改範例
- 新增文章：
  ```md
  ---
  title: "新文章標題"
  date: 2025-09-13
  ---
  文章內容 ...
  ```
- 修改設定：直接編輯 `_config.yml`，如更改網站標題、描述、導航。

## 參考檔案
- `README.md`：簡要說明專案用途與技術。
- `_config.yml`：Jekyll 與 GitHub Pages 設定。
- `_posts/`：所有部落格文章。
- 根目錄 Markdown 檔案：主要靜態頁面。

---
## 其他說明
- 文章中使用到的 example 盡量使用 python 為例子
---
如有不明確或遺漏之處，請回饋以便補充或修正。
