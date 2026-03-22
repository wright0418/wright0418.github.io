---
layout: ../layouts/Page.astro
title: "關於我"
description: "關於 Wright 吳奇峯 — 嵌入式系統工程師、IC 設計愛好者"
---

<div class="about-intro">
  <p>嗨！我是 <strong>Wright 吳奇峯</strong>。歡迎來到我的個人網站。</p>
  <p>我是一名專注於嵌入式系統的工程師，對硬體設計、半導體 IC 架構、以及 AI 人工智慧有著深厚的熱情。在這個網站上，我記錄自己的技術學習歷程，分享開發心得，並展示專案作品。</p>
</div>

<h2>💼 技術背景</h2>

<div class="skill-list">
  <div class="skill-item">
    <span class="skill-label">主要技術</span>
    <span class="skill-value">MCU Firmware (C/C++)、Python、JavaScript</span>
  </div>
  <div class="skill-item">
    <span class="skill-label">興趣領域</span>
    <span class="skill-value">物理、AI 類神經網路、硬體系統設計、半導體 MCU IC 架構</span>
  </div>
  <div class="skill-item">
    <span class="skill-label">開發工具</span>
    <span class="skill-value">VS Code、GitHub Copilot、Git、Astro</span>
  </div>
</div>

<h2>🎯 學習與分享</h2>

<p>我相信透過分享可以讓知識更有價值。這個網站是我記錄技術學習、解題心得與專案過程的地方，也期待與更多人交流學習。</p>

<h2>📫 聯絡方式</h2>

<div class="contact-list">
  <a href="mailto:wright0418.wu@gmail.com" class="contact-item">
    <span class="contact-icon">📧</span>
    <span>wright0418.wu@gmail.com</span>
  </a>
  <a href="https://github.com/wright0418" target="_blank" rel="noopener" class="contact-item">
    <span class="contact-icon">💻</span>
    <span>GitHub @wright0418</span>
  </a>
  <a href="https://www.youtube.com/c/%E5%A5%B6%E7%88%B8%E7%9A%84%E6%95%99%E8%82%B2" target="_blank" rel="noopener" class="contact-item">
    <span class="contact-icon">🎥</span>
    <span>YouTube — 奶爸的教育</span>
  </a>
</div>

<style>
  .about-intro {
    margin-bottom: 2em;
    padding: 1.5em;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    border-left: 3px solid var(--accent);
  }
  .about-intro p { margin: 0.5em 0; }

  .skill-list {
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    margin: 1em 0 2em;
  }
  .skill-item {
    display: flex;
    align-items: baseline;
    gap: 1em;
    padding: 0.8em 1.2em;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
  }
  .skill-label {
    flex-shrink: 0;
    font-weight: 600;
    color: var(--accent);
    font-size: 0.88em;
    min-width: 80px;
  }
  .skill-value {
    color: var(--text-secondary);
    font-size: 0.92em;
  }

  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    margin-top: 1em;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.8em;
    padding: 0.8em 1.2em;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s ease;
  }
  .contact-item:hover {
    border-color: var(--border-accent);
    box-shadow: 0 0 16px rgba(0, 212, 255, 0.1);
    transform: translateX(4px);
    text-decoration: none;
  }
  .contact-icon { font-size: 1.2em; }
</style>