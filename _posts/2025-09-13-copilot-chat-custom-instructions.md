---
title: "Copilot Chat 自訂指令：提升開發效率的秘密武器"
date: 2025-09-13
categories: [技術分享, 開發工具]
tags: [VSCode, GitHub Copilot, 自訂指令, 開發效率]
---

# Copilot Chat 自訂指令：提升開發效率的秘密武器

## 前言

在日常開發工作中，GitHub Copilot 已經成為許多開發者不可或缺的 AI 助手。但你知道嗎？除了基本的程式碼建議功能外，Copilot Chat 還提供了強大的自訂指令功能，可以讓你打造專屬的開發助手。今天就來分享我使用 Copilot Chat 自訂指令的經驗和心得。

## 什麼是 Copilot Chat 自訂指令？

Copilot Chat 自訂指令（Custom Instructions）是一種讓你可以預先定義特定行為和回應模式的功能。透過設定自訂指令，你可以：

- 定義專案特定的編程風格和慣例
- 設定常用的工作流程和檢查清單
- 建立特定領域的專業知識範本
- 自動化重複性的程式碼審查任務

## 如何設定自訂指令

### 步驟 1：開啟設定介面

在 VSCode 中：
1. 開啟 Command Palette（Ctrl+Shift+P）
2. 輸入並選擇「GitHub Copilot: Configure Chat Instructions」
3. 或者直接在專案根目錄建立 `.github/copilot-instructions.md` 檔案

### 步驟 2：撰寫指令內容

自訂指令通常包含以下幾個部分：

```markdown
# 專案特定指令

## 編程風格
- 使用 Python 進行開發（建議使用 pyproject.toml + Poetry 或 venv + pip）
- 遵循 Black、isort 與 flake8 的整合配置
- 使用 type hints 與 mypy 做靜態型別檢查
- 變數與函式命名採用 snake_case，類名使用 PascalCase
- 函式與模組需包含適當的 docstring（Google 或 NumPy 風格）

## 專案結構
- 程式碼放在 `src/` 或套件目錄
- 測試放在 `tests/`，使用 pytest
- 工具函式放在 `src/utils/`，類型定義與 Pydantic model 放在 `src/models/`
- 使用 requirements.txt 或 pyproject.toml 管理依賴

## 測試要求
- 每個新功能皆需對應單元測試（pytest）
- 使用 coverage 監控測試覆蓋率，建議至少 80%
- CI 上執行 black/isort/flake8 與 pytest
```

## 實用的自訂指令範例

### 1. 程式碼審查助手

```markdown
## 程式碼審查檢查清單
當進行程式碼審查時，請檢查：
- [ ] 是否遵循專案的編碼風格
- [ ] 是否有適當的錯誤處理
- [ ] 是否有安全性考量
- [ ] 是否有效能問題
- [ ] 是否有適當的測試覆蓋
```

### 2. API 開發規範

```markdown
## API 開發指引
開發 API 時（以 FastAPI 為例）：
- 建議使用 FastAPI + Pydantic 提供自動驗證與 OpenAPI 文件
- 回傳統一的 JSON 格式（例如 { "status": "ok", "data": ... } 或 { "error": "message" }）
- 使用正確的 HTTP 狀態碼（200, 201, 400, 401, 403, 404, 500）
- 在 Pydantic 模型中做欄位驗證，避免在 handler 中寫大量驗證邏輯
- 使用依賴注入（Depends）處理授權與共用資源
- 實作適當的驗證與授權（OAuth2 / JWT 或其他）
- 提供清晰的單元與整合測試（pytest + httpx / TestClient）
```

### 3. 文件撰寫助手

```markdown
## 文件撰寫標準
撰寫技術文件時：
- 使用清晰的標題結構
- 包含實際的程式碼範例（請使用 ```python code fence）
- 提供步驟化的操作指南
- 包含常見問題和解決方案

範例 Python 程式碼片段：
```python
def add(a: int, b: int) -> int:
    """將兩個整數相加並回傳結果。"""
    return a + b
```
```

## 我觀察到的實際好處

### 1. 提升一致性
使用自訂指令後，Copilot 產生的程式碼更符合專案的編碼風格和架構模式，減少了後續的修改工作。

### 2. 節省溝通成本
團隊成員都使用相同的自訂指令，確保了程式碼的一致性，減少了 Code Review 時的討論和修改。

### 3. 加速新人上手
新加入的團隊成員可以快速透過自訂指令了解專案的開發規範和最佳實務。

### 4. 提高程式碼品質
自訂指令中包含的檢查清單和最佳實務，幫助確保產出的程式碼符合品質標準。

## 進階使用技巧

### 1. 分層指令架構
可以建立多層級的指令檔案：
- 全域指令（個人偏好）
- 專案指令（專案特定）
- 模組指令（特定功能模組）

### 2. 整合工作流程
將自訂指令與 CI/CD 流程整合，確保所有程式碼都符合定義的標準。

### 3. 定期更新維護
隨著專案發展和團隊經驗累積，定期檢視和更新自訂指令內容。

## 結語

Copilot Chat 的自訂指令功能是一個被低估的強大工具。透過適當的設定和使用，它不僅能提升個人的開發效率，更能為整個團隊帶來一致性和品質的提升。

如果你還沒有嘗試過自訂指令，強烈建議從一個簡單的專案開始實驗。相信你會發現，這個小小的設定能帶來意想不到的效果。

你有使用過 Copilot Chat 的自訂指令嗎？或是有其他提升開發效率的小技巧？歡迎在下方留言分享你的經驗！

---

*本文基於個人使用 GitHub Copilot Chat 的實際經驗分享，如有更新或改進的地方，歡迎隨時交流討論。*