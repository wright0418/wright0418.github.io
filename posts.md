---
layout: default
title: 文章
---

# 所有文章

這裡列出了所有的技術文章和心得分享，按時間順序排列。

## 最新文章

{% if site.posts.size > 0 %}
<div class="posts-list">  
{% for post in site.posts %}
  <article class="post-item">
    <h1 style="font-size: 2.5em; margin-bottom: 0.2em;"><a href="{{ post.url | relative_url }}">{{ post.title | split: '\n' | first }}</a></h1>
    <div class="post-meta">
      <div class="post-date">{{ post.date | date: "%Y年%m月%d日" }}</div>
      {% if post.categories.size > 0 %}
        <div class="post-categories">
          分類：
          {% for category in post.categories %}
            <a href="{{ '/category/' | append: category | downcase | append: '/' | relative_url }}" class="category-link">{{ category }}</a>
            {% unless forloop.last %}, {% endunless %}
          {% endfor %}
        </div>
      {% endif %}
      {% if post.tags.size > 0 %}
        <div class="post-tags">
          標籤：
          {% assign unique_tags = post.tags | uniq %}
          {% for tag in unique_tags %}
            <span class="tag">{{ tag }}</span>
            {% unless forloop.last %}, {% endunless %}
          {% endfor %}
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
<p>還沒有文章，敬請期待...</p>
{% endif %}

## 其他瀏覽方式

- [依分類瀏覽]({{ '/categories' | relative_url }})
- 回到 [首頁]({{ '/' | relative_url }})