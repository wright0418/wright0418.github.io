---
layout: default
title: 首頁
---

<!-- Hero Section -->
<div class="hero-section">
  <h1>👋 歡迎來到 Wright 的個人網站</h1>
  <p style="font-size: 1.1em; margin-bottom: 0;">這裡是我分享技術筆記、開發心得與專案的地方。我專注於 MCU firmware、Python、JavaScript 開發，對 AI 與嵌入式系統充滿熱情。</p>
</div>

<!-- 最新文章 -->
<div class="home-section">
  <h2>📝 最新文章</h2>
  {% if site.posts.size > 0 %}
  <ul>
    {% for post in site.posts limit:10 %}
    <li>
      <span>{{ post.date | date: "%Y-%m-%d" }}</span>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p>還沒有文章，準備中...</p>
  {% endif %}
  <p style="margin-top: 20px;">
    <a href="{{ '/posts' | relative_url }}" style="font-weight: 600;">查看所有文章 →</a>
  </p>
</div>

<!-- 瀏覽文章 -->
<div class="home-section">
  <h2>📚 瀏覽文章</h2>
  <p>依分類瀏覽：<a href="{{ '/categories' | relative_url }}" style="font-weight: 600;">分類列表</a></p>
</div>

<!-- 專案 -->
<div class="home-section">
  <h2>🚀 我的專案</h2>
  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom: 10px;">
      📦 <a href="{{ '/projects' | relative_url }}" style="font-weight: 600;">作品集與專案</a> - 我的技術作品展示
    </li>
    <li>
      📖 <a href="https://github.com/wright0418/My_eBook/tree/main" target="_blank" rel="noopener" style="font-weight: 600;">My_eBook（學習電子書）</a> - 我的學習筆記與電子書
    </li>
  </ul>
</div>

<!-- 關於我 -->
<div class="home-section">
  <h2>👤 關於我</h2>
  <ul style="list-style: none; padding-left: 0;">
    <li style="margin-bottom: 10px;">
      💼 <a href="{{ '/about' | relative_url }}" style="font-weight: 600;">關於我</a> - 了解我的技術背景與興趣
    </li>
    <li>
      🎥 <a href="https://www.youtube.com/c/%E5%A5%B6%E7%88%B8%E7%9A%84%E6%95%99%E8%82%B2" target="_blank" rel="noopener" style="font-weight: 600;">奶爸的教育</a> - 我的 YouTube 頻道
    </li>
  </ul>
</div>

<!-- Back to Top Button -->
<div class="back-to-top" id="backToTop" title="回到頂部"></div>

<script>
// Back to top button functionality
window.addEventListener('scroll', function() {
  var backToTop = document.getElementById('backToTop');
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

document.getElementById('backToTop').addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>