---
layout: ../layouts/Page.astro
title: "專案與作品"
description: "Wright 的技術專案與作品集"
---

<p style="color: var(--text-secondary); margin-bottom: 2em;">這裡整理並展示我的技術專案與學習成果。</p>

<div class="project-card">
  <div class="project-header">
    <span class="project-icon">📖</span>
    <div>
      <h3>My_eBook — 學習電子書</h3>
      <div class="project-tags">
        <span class="tag">學習筆記</span>
        <span class="tag violet">嵌入式系統</span>
        <span class="tag">AI</span>
      </div>
    </div>
  </div>
  <p>我的個人學習筆記與技術文件整理，涵蓋嵌入式系統、程式設計、AI 開發等主題。</p>
  <a href="https://github.com/wright0418/My_eBook/tree/main" target="_blank" rel="noopener" class="project-link">
    GitHub Repository →
  </a>
</div>

<div class="project-card">
  <div class="project-header">
    <span class="project-icon">🌐</span>
    <div>
      <h3>個人網站 — wright0418.github.io</h3>
      <div class="project-tags">
        <span class="tag">Astro</span>
        <span class="tag violet">GitHub Pages</span>
      </div>
    </div>
  </div>
  <p>你現在看到的這個網站！使用 Astro 靜態生成器，搭配科技風深色主題，部署在 GitHub Pages 上。</p>
  <a href="https://github.com/wright0418/wright0418.github.io" target="_blank" rel="noopener" class="project-link">
    GitHub Repository →
  </a>
</div>

<div class="project-placeholder">
  <p>🚧 更多專案正在整理中，敬請期待...</p>
</div>

<style>
  .project-card {
    margin-bottom: 1.25em;
    padding: 1.5em;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    transition: all 0.3s ease;
  }
  .project-card:hover {
    border-color: var(--border-accent);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
    transform: translateY(-2px);
  }
  .project-header {
    display: flex;
    align-items: flex-start;
    gap: 1em;
    margin-bottom: 0.8em;
  }
  .project-icon {
    font-size: 2em;
    flex-shrink: 0;
  }
  .project-header h3 {
    margin: 0 0 0.4em;
    font-size: 1.15em;
    color: var(--text-primary);
  }
  .project-tags {
    display: flex;
    gap: 0.4em;
    flex-wrap: wrap;
  }
  .tag {
    display: inline-block;
    padding: 0.15em 0.65em;
    font-size: 0.72em;
    font-weight: 600;
    border-radius: 9999px;
    background: rgba(0, 212, 255, 0.1);
    color: var(--accent);
    border: 1px solid rgba(0, 212, 255, 0.15);
  }
  .tag.violet {
    background: rgba(167, 139, 250, 0.1);
    color: var(--accent2);
    border-color: rgba(167, 139, 250, 0.15);
  }
  .project-card p {
    color: var(--text-secondary);
    font-size: 0.92em;
    margin: 0 0 1em;
  }
  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.5em 1.2em;
    font-size: 0.88em;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid var(--border-accent);
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .project-link:hover {
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
    text-decoration: none;
  }
  .project-placeholder {
    margin-top: 2em;
    padding: 2em;
    text-align: center;
    border: 1px dashed var(--border-color);
    border-radius: 14px;
    color: var(--text-muted);
  }
</style>