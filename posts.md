---
layout: default
title: 文章
---

<div class="hero-section" style="margin-bottom: 30px;">
  <h1>📝 所有文章</h1>
  <p style="font-size: 1.05em; margin-bottom: 0;">這裡列出了所有的技術文章和心得分享，按時間順序排列。</p>
</div>

{% if site.posts.size > 0 %}
<div class="posts-list">  
{% for post in site.posts %}
  <article class="post-item">
    <h1 style="font-size: 2em; margin-bottom: 0.3em;"><a href="{{ post.url | relative_url }}">{{ post.title | split: '\n' | first }}</a></h1>
    <div class="post-meta">
      <div class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</div>
      {% if post.categories.size > 0 %}
        <div class="post-categories">
          分類：
          {% for category in post.categories %}
            <a href="{{ '/category/' | append: category | downcase | append: '/' | relative_url }}" class="category-link">{{ category }}</a>{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        </div>
      {% endif %}
      {% if post.tags.size > 0 %}
        <div class="post-tags">
          {% assign unique_tags = post.tags | uniq %}
          {% for tag in unique_tags limit:5 %}
            <span class="tag">{{ tag }}</span>
          {% endfor %}
          {% if unique_tags.size > 5 %}
            <span style="opacity: 0.6;">...</span>
          {% endif %}
        </div>
      {% endif %}
    </div>
    {% if post.excerpt %}
      <div class="post-excerpt">
        {{ post.excerpt | strip_html | truncate: 200 }}
      </div>
    {% endif %}
  </article>
{% endfor %}
</div>
{% else %}
<p style="text-align: center; padding: 40px 0; opacity: 0.7;">還沒有文章，敬請期待...</p>
{% endif %}

<div style="margin-top: 40px; padding: 25px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; text-align: center;">
  <h3 style="margin-top: 0; color: #64b5f6;">其他瀏覽方式</h3>
  <p>
    <a href="{{ '/categories' | relative_url }}" style="font-weight: 600;">📂 依分類瀏覽</a> | 
    <a href="{{ '/' | relative_url }}" style="font-weight: 600;">🏠 返回首頁</a>
  </p>
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