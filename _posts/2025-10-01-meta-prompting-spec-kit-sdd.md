---
layout: default
title: "Meta-Prompting 與 Spec-Driven Development：把自然語言提示變成可執行的 Agent"
date: 2025-10-01
categories: [AI, 提示工程]
tags: [meta-prompting, GitHub Spec Kit, SDD, prompt-engineering, Gemini]
description: "記錄我使用 GitHub Spec Kit 練習 Spec-Driven Development 的過程，如何借助 Gemini 整理 meta-prompting 的概念，建立可迴圈優化的提示模板與 agent 流程。"
---

## 前言

這幾天持續用 GitHub Spec Kit 嘗試 Spec-Driven Development（SDD）流程，希望讓代理開發（agent development）更有結構。過去我常靠直覺寫提示，效果忽好忽壞；這次在 Gemini 協助分析國外 YouTube 的分享後，意外發現了「meta-prompting」這個關鍵字，於是開始思考：能不能透過元提示，把「寫提示」本身變成可迭代的流程，甚至交給 AI 自己去優化？

## 核心概念：Meta-Prompting 如何自我優化提示

Meta-prompting 的核心不是直接求出答案，而是生成「更好的提示模板」。[Prompt Engineering Guide 將它描述為一種專注結構與語法的技巧](https://www.promptingguide.ai/techniques/meta-prompting)，強調：

- 以格式、步驟、輸出結構為主體，淡化特定內容細節。
- 透過抽象範例告訴模型「應該怎麼表達」，而不是「要說什麼」。
- 因為不綁定具體案例，所以更容易重用、也更節省 token。

當我們把原始提示、模型輸出、人工回饋包成「元提示」再次餵給模型時，就像在訓練一個提示編輯器，讓它持續修訂模板直到符合需求。下表整理我這次的觀察：

| 應用情境 | 初始問題 | 元提示後的改善 |
| --- | --- | --- |
| 產品摘要 | 只有重複規格，缺少品牌語境與賣點。 | 加入品牌詞彙、情境式句子，語氣統一。 |
| 程式碼生成 | 產生過多註解與樣板，變數名稱縮寫。 | 僅保留目標函式，使用完整命名與專注邏輯。 |

## 實作方法：結合 Spec Kit 的四個迭代循環

參考 Gemini 的整理，我把 meta-prompting 迭代流程映射到 Spec Kit 的 slash commands：

1. **提出初始提示**：以 `/specify` 撰寫最基本的需求說明，取得第一次輸出。
2. **詳細審查與回饋**：透過 `/clarify` 或自行檢查輸出，指出缺漏、語氣、格式等問題。
3. **產生元提示**：把原始提示、輸出與回饋包成新的指令，並要求模型「修訂提示模板」。
4. **測試與重複**：用 `/plan`、`/tasks`、`/implement` 按照新的模板執行，必要時再把最新回饋帶回第 3 步。

這個循環讓 Spec-Driven Development 不再只是「照規格自動寫程式」，而是把撰寫規格本身也標準化、優化，讓 agent 有能力在每次迭代中學習。

## 進階應用：打造像 Agent 的工作流程

- **建立提示原則庫**：用 `/constitution` 定義 prompt 編寫守則，例如「輸出需含成功條件」「禁止縮寫」。
- **Meta-prompt 範本化**：把以下模板加入知識庫，讓任何任務都能快速啟動自我優化迴圈。

```text
You are a prompt editor. Given the original prompt, the model response, and my review notes, rewrite the prompt template so that a future agent can meet the success criteria without additional hints.

Original prompt:
{{原始指令}}

Model response:
{{模型輸出}}

Review notes:
{{具體回饋}}

Rewrite the prompt template with:
1. 明確的角色與目標
2. 可檢查的輸出格式
3. 需要避免的錯誤
4. 必要的評估指標
```

- **引導多代理協作**：讓一個 agent 專職收集回饋、另一個 agent 專職執行 `/implement`。元提示成為兩者溝通的 API。

## 常見問題與注意事項

- **回饋如果不夠具體怎麼辦？** 請列出缺漏欄位、語氣、錯誤案例，讓元提示有更清楚的修訂方向。
- **會不會過度迭代？** 每一輪都要重新測試輸出，若看到邊際改善趨緩，就暫停並記錄模板版本。
- **模型是否知道領域知識？** Meta-prompting 假設模型具備基本背景。若遇到冷門領域，需先補充上下文，再啟動元提示迴圈。

## 總結與下一步

透過 meta-prompting，我不只是讓 Spec Kit 幫我「按部就班」建構專案，而是讓 AI 參與提示設計本身。當提示模板能被記錄、分享、再利用，SDD 的產出品質也會更穩定。接下來我想實驗：

1. 建立不同任務的元提示資料庫，觀察是否能快速複製成功流程。
2. 把 Gemini 的聽打與重點整理納入 meta-prompt 的輸入，讓回饋更完整。
3. 試著用多代理分工方式，驗證有沒有更高的迭代效率。

## 參考資料

- [Meta Prompting — Prompt Engineering Guide](https://www.promptingguide.ai/techniques/meta-prompting)
- [GitHub Spec Kit README](https://github.com/github/spec-kit)
