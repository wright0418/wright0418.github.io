---
title: "Nuvoton M482 + VSCode NuMicro 擴充套件開發全紀錄：BSP、Copilot自動化、硬體規則與驗證"
pubDate: 2025-10-21
categories: [技術分享, embedded-Linux]
tags: [Nuvoton, M480, VSCode, NuMicro, Copilot, BSP, MCU, C語言, Keil, IoT, BLE]
description: "完整記錄 Nuvoton M482 MCU 在 VSCode 下安裝 NuMicro 擴充套件、BSP建構、Copilot自動化專案更名、硬體I/O規則撰寫與驗證流程，適合嵌入式開發者參考。"
---

## 緣起：一場嵌入式開發的自我挑戰

每次啟動一個新專案，心裡總是既期待又緊張。這次，我選擇了 Nuvoton Cortex-M4 M482 MCU，目標是打造一個 BLE 物聯網裝置。過去習慣用傳統 IDE，但這回決定用 VSCode，搭配 NuMicro Cortex-M 擴充套件，試試現代化的嵌入式開發流程。

一開始其實有點忐忑，畢竟 VSCode 跟 MCU 開發的結合還不算主流，但也正因如此，才更有探索的樂趣。

## 安裝 NuMicro 擴充套件：從陌生到熟悉

第一步，當然是到 VSCode Extension Marketplace 搜尋「Nuvoton NuMicro Cortex-M」。安裝的過程很順利，但真正的挑戰是「怎麼用？」

幸好 BSP 裡附的 PDF 教學非常詳細，像是有個老手在旁邊一步步帶著我。跟著 User Guide 設定環境，下載 Github Open Nuvoton 最新 M480 BSP，逐步建構 Keil Compiler 編譯環境。每完成一個步驟，心裡就多一分踏實。

## BSP 建構與 Hello World：小小的成就感

照著教學把 BSP 樣板編譯環境建起來，第一次按下編譯鍵時，心裡還是有點緊張。看到 Hello World 跳出來的那一刻，真的有種「我做到了！」的成就感。這種小確幸，是每個工程師都懂的。

## Copilot 自動化：AI 真的懂我

接下來想把樣板專案改成自己的 Project 名稱。以往這種「搬家」很麻煩，但這次我直接用 Copilot 下指令：「請幫我把專案名稱、路徑、編譯環境都改成 XXX」。

沒想到 Copilot 真的兩三下就搞定了！路徑、檔案、編譯設定全部自動調整，編譯也一次成功。那一刻，真的有種「AI 變成我的小助手」的感覺。

## AGENTS.md：把硬體規則寫下來，讓團隊更有默契

專案進入到硬體規則設計時，我開始思考：「如果未來有新夥伴加入，他怎麼快速了解這塊板子的 I/O 配置？」

於是我決定撰寫 AGENTS.md，把所有硬體規則、I/O腳位、命名慣例都記錄下來：

### 硬體電路配置
- PB0：紅色 LED，Low 亮（拉低才亮，避免誤判）
- PB1：綠色 LED，Low 亮
- UART0：PD0 (TX), PD1 (RX)，Baudrate 115200

### 專案規則
- 所有硬體I/O配置請明確記錄於 AGENTS.md
- 周邊驅動程式請放置於 /lib
- 範例程式請放置於 /SampleCode
- 命名慣例：以功能+腳位命名，易於維護
- 新增硬體規則請隨時補充 AGENTS.md

這樣不管是自己回頭查，還是團隊協作，都能一目了然。

## Copilot 產生規則檔：AI 讓規範自動化

有了 AGENTS.md，下一步就是用 Copilot 產生 copilot.instruction.md。只要下指令，Copilot 會自動把硬體規則條列化，變成 AI 助手和協作者都能遵循的專案規範。

這種自動化，讓專案管理變得更輕鬆，也減少溝通上的誤會。

## 硬體驗證：從失敗到成功的過程

最後一關是硬體驗證。這次我設計了 SysTick 產生 10ms 中斷，作為計時基準。紅色 LED 要 1 秒閃爍一次，亮 0.1 秒；綠色 LED 則是 3 秒週期，亮 1 秒。

一開始程式邏輯有點卡，LED 亮的時間總是不對。後來用 Copilot 幫忙重構程式，才發現原來是計時邏輯沒對齊。修正後，LED 閃爍終於如預期，心裡超有成就感。

## 心得與反思：工程師的成長日記

這次的開發旅程，讓我深刻體會到：
- 工具的進步（VSCode + NuMicro + Copilot）真的能改變嵌入式開發的效率與體驗。
- 把規則、細節寫下來，不只是為了自己，更是為了團隊、未來的自己。
- AI 助手不只是「自動化」，更像是開發路上的夥伴。

未來我會持續擴充 AGENTS.md 與 copilot.instruction.md，讓專案知識不斷累積，也歡迎有興趣的朋友一起交流、成長！

---

如果你也在嵌入式開發路上遇到類似挑戰，或對這些工具有興趣，歡迎留言交流，一起讓開發更有溫度！