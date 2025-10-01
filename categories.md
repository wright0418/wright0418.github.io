---
layout: default
title: 分類
---

<div class="hero-section" style="margin-bottom: 30px;">
  <h1>📂 文章分類</h1>
  <p style="font-size: 1.05em; margin-bottom: 0;">依照主題瀏覽所有文章，找到你感興趣的內容。</p>
</div>

<div class="categories-grid">
{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
  {% case category[0] %}
    {% when 'AI' %}
      <div class="category-card">
        <a href="{{ '/category/ai/' | relative_url }}">
          🤖 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '工具分享' %}
      <div class="category-card">
        <a href="{{ '/category/工具分享/' | relative_url }}">
          🛠️ {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '提示工程' %}
      <div class="category-card">
        <a href="{{ '/category/提示工程/' | relative_url }}">
          💡 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '教學心得' %}
      <div class="category-card">
        <a href="{{ '/category/教學心得/' | relative_url }}">
          📚 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when 'embedded-Linux' %}
      <div class="category-card">
        <a href="{{ '/category/embedded-linux/' | relative_url }}">
          🐧 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when 'buildroot' %}
      <div class="category-card">
        <a href="{{ '/category/buildroot/' | relative_url }}">
          ⚙️ {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when 'nuc980' %}
      <div class="category-card">
        <a href="{{ '/category/nuc980/' | relative_url }}">
          🔧 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '技術分享' %}
      <div class="category-card">
        <a href="{{ '/category/技術分享/' | relative_url }}">
          💻 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '開發工具' %}
      <div class="category-card">
        <a href="{{ '/category/開發工具/' | relative_url }}">
          🔨 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when 'AI 開發' %}
      <div class="category-card">
        <a href="{{ '/category/ai-開發/' | relative_url }}">
          🧠 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% when '生活思考' %}
      <div class="category-card">
        <a href="{{ '/category/生活思考/' | relative_url }}">
          🌱 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
    {% else %}
      <div class="category-card">
        <a href="#">
          📌 {{ category[0] }}
          <span class="category-count">({{ category[1].size }})</span>
        </a>
      </div>
  {% endcase %}
{% endfor %}
</div>

<div style="margin-top: 40px; text-align: center;">
  <p><a href="{{ '/' | relative_url }}" style="font-weight: 600;">← 返回首頁</a> | <a href="{{ '/posts' | relative_url }}" style="font-weight: 600;">查看所有文章 →</a></p>
</div>

<!-- Back to Top Button -->
<div class="back-to-top" id="backToTop" title="回到頂部"></div>

<script>
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