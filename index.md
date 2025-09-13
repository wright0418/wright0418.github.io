---
layout: default
title: 首頁
---

# 我是 Wright (吳奇峯) 👋

這裡是我的個人網站，會分享技術筆記、開發心得，以及我正在做或完成的專案。

## 最新文章
{% if site.posts.size > 0 %}
<ul>
{% for post in site.posts limit:5 %}
  <li><span>{{ post.date | date: "%Y-%m-%d" }}</span> — <a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
{% else %}
<p>還沒有文章，準備中...</p>
{% endif %}

## 專案
- 我的作品與連結：<a href="{{ '/projects' | relative_url }}">Projects</a>
- 我的學習電子書：<a href="https://github.com/wright0418/My_eBook/tree/main" target="_blank" rel="noopener">My_eBook（學習電子書）</a>

## 關於我
- 認識我：<a href="{{ '/about' | relative_url }}">About</a>
- 我的 Youtube頻道 : <a href="https://www.youtube.com/c/%E5%A5%B6%E7%88%B8%E7%9A%84%E6%95%99%E8%82%B2">奶爸的教育</a>