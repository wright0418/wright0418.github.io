---
title: "GitHub Copilot Agent Mode：從構想到完成 APP 的自動化開發體驗"
pubDate: 2025-09-14
categories: [技術分享, 開發工具, AI 開發]
tags: [GitHub Copilot, Agent Mode, 自動化開發, AI 程式設計, 產品規劃]
description: "本文備份自原 Jekyll 網站"
---

# GitHub Copilot Agent Mode：從構想到完成 APP 的自動化開發體驗

## 前言

最近 GitHub Copilot 的更新真的讓我驚艷不已！新版的 Agent Mode 帶來了前所未有的開發體驗，讓我從一個簡單的想法，到最終完成一個可用的 APP，幾乎全程都是 AI 自動完成的。今天想分享這個令人興奮的開發體驗，以及它對未來軟體開發可能帶來的影響。

## 新版 Copilot 的強大功能

### 1. `copilot-instructions.md` - 全專案規範定義

新版 Copilot 允許我們在專案中建立 `copilot-instructions.md` 檔案，定義整個 Workspace 的規則與開發方向。這就像是為 AI 助手制定了一套專案憲法，讓所有後續的程式碼生成都符合我們的標準。

### 2. `function.prompt.md` - 特定功能模板

透過 `function.prompt.md` 檔案，我們可以為特定功能建立詳細的提示模板，讓 Copilot 能夠更精準地理解我們的需求並產生對應的程式碼。

## 我的三步驟自動化開發體驗

### 第一步：初始化專案與 README.md

我先建立了一個新的 Git 專案，然後只寫了一行簡單的描述，說明這個 workspace 想要達到的目的。神奇的是，Copilot 自動幫我完善了整個 README.md，內容幾乎滿足我 98% 的需求！

舉例來說，我只寫了：

```markdown
# 自動化數據分析工具
一個能夠自動處理 CSV 數據並生成視覺化報表的 Python 應用程式
```

Copilot 自動擴展成：

```markdown
# 自動化數據分析工具

## 專案概述
這是一個基於 Python 的自動化數據分析工具，能夠：
- 自動讀取和處理 CSV 格式的數據文件
- 執行基礎的數據清理和預處理
- 生成各種統計圖表和視覺化報表
- 支援多種輸出格式（PNG, PDF, HTML）

## 核心功能
- 數據導入與驗證
- 自動化數據清理
- 統計分析與計算
- 互動式圖表生成
- 報表自動化輸出

## 技術棧
- Python 3.9+
- pandas - 數據處理
- matplotlib/seaborn - 數據視覺化
- streamlit - Web UI 界面
- pytest - 單元測試

## 安裝方式
```bash
pip install -r requirements.txt
```

## 使用方法
```python
from data_analyzer import DataAnalyzer

analyzer = DataAnalyzer()
analyzer.load_data('data.csv')
analyzer.generate_report()
```
```

### 第二步：自動生成 copilot-instructions.md

接著，我啟動了 Copilot 的自動生成功能。它仔細分析了 README.md 的目標需求後，自動為我建立了一份完整的 `copilot-instructions.md`，定義了整個 workspace 的開發標準規範。

生成的指令檔案包含了：

```markdown
# 數據分析工具開發指令

## 編程風格
- 使用 Python 3.9+ 進行開發
- 遵循 PEP 8 編碼規範
- 使用 type hints 進行型別標註
- 採用 dataclass 和 Pydantic 進行數據模型定義
- 錯誤處理使用自定義異常類別

## 專案結構
- `src/` - 主要程式碼
- `tests/` - 測試檔案（使用 pytest）
- `data/` - 範例數據檔案
- `reports/` - 生成的報表輸出
- `config/` - 設定檔案

## 數據處理原則
- 使用 pandas 進行數據操作
- 實作數據驗證和清理流程
- 支援大型數據集的分塊處理
- 提供詳細的處理日誌

## UI 設計原則
- 使用 Streamlit 建立簡潔的 Web 界面
- 提供拖放式檔案上傳功能
- 即時預覽處理結果
- 支援互動式圖表調整
```

### 第三步：Agent 模式自動開發

這是最神奇的部分！我建立了一個產品規劃師的 Agent，透過 `APP.prompt.md` 檔案定義了它的角色和職責：

```markdown
# 產品規劃師 Agent

## 角色定義
你是一個專業的產品規劃師，負責將概念轉化為可執行的開發計畫。

## 主要職責
- 分析需求並制定開發路線圖
- 設計應用程式架構
- 規劃 GUI 界面（使用 Streamlit）
- 建立測試策略
- 設定開發環境

## 工具與模式
- mode: agent
- 可使用的工具: 程式碼生成、檔案操作、測試執行
- GUI 框架: Streamlit（簡潔優先）
- 測試框架: pytest + coverage

## 輸入輸出規格
- 輸入: CSV 數據檔案
- 輸出: 視覺化報表（多格式支援）
- GUI: 簡單直觀的 Web 界面
```

## Agent 的自主開發過程

接下來發生的事情真的讓我驚呆了！Agent 開始：

### 1. 自主思考與規劃
Agent 開始自言自語，列出了完整的開發步驟：

```
正在分析專案需求...
✓ 確認技術棧選擇
✓ 設計專案結構  
✓ 規劃核心功能模組
✓ 制定測試策略
✓ 設計 UI 流程

開始執行開發計畫...
```

### 2. 自動建立專案結構

```python
# 自動生成的專案結構
src/
├── __init__.py
├── data_analyzer.py      # 核心分析類別
├── data_processor.py     # 數據處理模組  
├── visualizer.py         # 視覺化模組
├── exceptions.py         # 自定義異常
└── config.py            # 設定管理

tests/
├── test_data_analyzer.py
├── test_data_processor.py
└── test_visualizer.py

app.py                   # Streamlit 主程式
requirements.txt         # 依賴套件
```

### 3. 自動撰寫核心程式碼

Agent 為每個模組自動生成了完整的程式碼。以核心分析器為例：

```python
# src/data_analyzer.py
from typing import Optional, Dict, Any
import pandas as pd
import logging
from pathlib import Path

from .data_processor import DataProcessor
from .visualizer import DataVisualizer
from .exceptions import DataAnalyzerError

class DataAnalyzer:
    """主要的數據分析器類別"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.processor = DataProcessor(config)
        self.visualizer = DataVisualizer(config)
        self.data: Optional[pd.DataFrame] = None
        self.logger = logging.getLogger(__name__)
        
    def load_data(self, file_path: str) -> None:
        """載入數據檔案"""
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                raise DataAnalyzerError(f"檔案不存在: {file_path}")
                
            self.data = pd.read_csv(file_path)
            self.logger.info(f"成功載入數據: {len(self.data)} 筆記錄")
            
        except Exception as e:
            raise DataAnalyzerError(f"載入數據失敗: {str(e)}")
    
    def analyze(self) -> Dict[str, Any]:
        """執行數據分析"""
        if self.data is None:
            raise DataAnalyzerError("請先載入數據")
            
        # 自動數據清理
        cleaned_data = self.processor.clean_data(self.data)
        
        # 執行統計分析
        stats = self.processor.calculate_statistics(cleaned_data)
        
        # 生成視覺化
        charts = self.visualizer.create_charts(cleaned_data)
        
        return {
            'statistics': stats,
            'charts': charts,
            'row_count': len(cleaned_data),
            'columns': list(cleaned_data.columns)
        }
    
    def generate_report(self, output_path: str = 'reports/') -> str:
        """生成完整報表"""
        analysis_result = self.analyze()
        
        # 生成 HTML 報表
        report_path = self.visualizer.generate_html_report(
            analysis_result, output_path
        )
        
        self.logger.info(f"報表已生成: {report_path}")
        return report_path
```

### 4. 自動建立 Streamlit UI

```python
# app.py
import streamlit as st
import pandas as pd
from src.data_analyzer import DataAnalyzer
from src.exceptions import DataAnalyzerError

def main():
    st.title("📊 自動化數據分析工具")
    st.markdown("上傳您的 CSV 檔案，自動生成專業的數據分析報表")
    
    # 檔案上傳
    uploaded_file = st.file_uploader(
        "選擇 CSV 檔案", 
        type=['csv'],
        help="支援 UTF-8 編碼的 CSV 檔案"
    )
    
    if uploaded_file is not None:
        try:
            # 建立分析器
            analyzer = DataAnalyzer()
            
            # 儲存上傳的檔案
            with open("temp_data.csv", "wb") as f:
                f.write(uploaded_file.getvalue())
            
            # 載入並分析數據
            analyzer.load_data("temp_data.csv")
            
            # 顯示基本資訊
            st.success(f"✓ 成功載入 {len(analyzer.data)} 筆記錄")
            
            # 資料預覽
            if st.checkbox("顯示資料預覽"):
                st.subheader("資料預覽")
                st.dataframe(analyzer.data.head())
            
            # 執行分析
            if st.button("🚀 開始分析", type="primary"):
                with st.spinner("正在分析數據..."):
                    results = analyzer.analyze()
                
                # 顯示統計結果
                st.subheader("📈 統計摘要")
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.metric("資料筆數", results['row_count'])
                with col2:
                    st.metric("欄位數量", len(results['columns']))
                with col3:
                    st.metric("分析完成", "✓")
                
                # 顯示圖表
                st.subheader("📊 視覺化圖表")
                for chart_name, chart_fig in results['charts'].items():
                    st.plotly_chart(chart_fig, use_container_width=True)
                
                # 生成報表
                if st.button("📋 生成完整報表"):
                    report_path = analyzer.generate_report()
                    st.success(f"報表已生成: {report_path}")
                    
        except DataAnalyzerError as e:
            st.error(f"❌ 分析錯誤: {str(e)}")
        except Exception as e:
            st.error(f"❌ 未預期的錯誤: {str(e)}")

if __name__ == "__main__":
    main()
```

### 5. 自動測試與除錯

最令人印象深刻的是，Agent 還自動寫了測試，運行測試，發現問題後自動修復！

```python
# tests/test_data_analyzer.py
import pytest
import pandas as pd
from src.data_analyzer import DataAnalyzer
from src.exceptions import DataAnalyzerError

def test_data_analyzer_initialization():
    """測試分析器初始化"""
    analyzer = DataAnalyzer()
    assert analyzer.data is None
    assert analyzer.config == {}

def test_load_valid_csv(tmp_path):
    """測試載入有效的 CSV 檔案"""
    # 建立測試數據
    test_data = pd.DataFrame({
        'name': ['Alice', 'Bob', 'Charlie'],
        'age': [25, 30, 35],
        'salary': [50000, 60000, 70000]
    })
    
    # 儲存為臨時 CSV
    csv_path = tmp_path / "test.csv"
    test_data.to_csv(csv_path, index=False)
    
    # 測試載入
    analyzer = DataAnalyzer()
    analyzer.load_data(str(csv_path))
    
    assert len(analyzer.data) == 3
    assert list(analyzer.data.columns) == ['name', 'age', 'salary']

def test_analyze_without_data():
    """測試未載入數據時的分析"""
    analyzer = DataAnalyzer()
    
    with pytest.raises(DataAnalyzerError):
        analyzer.analyze()
```

當測試發現某些邊界情況的問題時，Agent 會自動修正程式碼，直到所有測試都通過！

## 體驗心得與反思

### 革命性的開發體驗

這次的經驗讓我深刻體會到 AI 輔助開發的巨大潛力。以往需要：

1. **需求溝通** - 與工程師反覆討論技術細節
2. **架構設計** - 花時間規劃程式結構  
3. **程式開發** - 逐一實作各個功能模組
4. **測試除錯** - 撰寫測試、發現問題、修復程式碼
5. **文件撰寫** - 建立使用手冊和 API 文件

現在，我只需要：
1. **描述需求** - 一句話說明想要什麼
2. **驗收結果** - 檢查最終產出是否符合期望

### 降低技術門檻

最重要的是，這個過程大大降低了非技術人員參與軟體開發的門檻。作為一個企劃人員，我不再需要：

- 深入理解程式語言語法
- 學習複雜的軟體架構模式  
- 掌握測試驅動開發流程
- 熟悉各種開發工具和框架

我只需要專注於：
- **清楚表達需求**
- **設計使用者體驗**  
- **驗證功能完整性**

### 溝通成本的革命

以往的開發流程中，溝通是最大的成本：
- 工程師不懂業務需求的細節
- 企劃人員不了解技術實作的限制
- 反覆的需求澄清和修改

現在，AI Agent 能夠：
- 理解自然語言的需求描述
- 自動轉換為技術實作方案
- 即時回饋可行性和建議

## 對未來的展望

### 角色轉變

我認為這個技術會帶來以下變化：

**企劃人員**：從溝通協調者轉變為產品設計師，更專注於用戶體驗和商業價值。

**工程師**：從代碼實作者轉變為架構師和品質把關者，更專注於系統設計和技術決策。

**專案經理**：從進度管控者轉變為價值交付的推動者，更專注於業務成果。

### 開發流程的演進

傳統開發流程：
```
需求分析 → 系統設計 → 程式開發 → 測試驗證 → 部署上線
```

AI 輔助開發流程：
```
需求描述 → AI 自動實作 → 功能驗證 → 迭代優化
```

### 技能需求的改變

未來可能更重要的技能：
- **需求分析與表達能力** - 如何清楚描述想要的功能
- **系統思維** - 理解整體架構和模組間的關係
- **品質驗證** - 評估 AI 產出的程式碼品質
- **使用者體驗設計** - 專注於產品的實際價值

## 結語

GitHub Copilot 的 Agent Mode 讓我看到了軟體開發的未來。當 AI 能夠自主完成從規劃到實作的全部流程時，我們的工作重心將從「如何做」轉向「做什麼」和「為什麼做」。

這不是要取代工程師，而是要讓每個人都能成為更好的產品創造者。專注於解決真正的問題，而不是被技術細節所困擾。

當然，目前這個技術還在發展階段，在複雜的企業級專案中可能還需要更多的人工介入。但我相信，隨著 AI 技術的持續進步，這種「想法即產品」的開發體驗會越來越普及。

你有試過類似的 AI 輔助開發體驗嗎？或者你認為這種技術會對軟體開發帶來什麼樣的影響？歡迎在下方分享你的看法！

---

*本文記錄了作者使用 GitHub Copilot Agent Mode 的真實開發體驗，如果你也想嘗試這種革命性的開發方式，建議從簡單的專案開始實驗。*