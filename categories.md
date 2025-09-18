---
layout: default
title: 分類
---

<link rel="stylesheet" href="assets/styles.css">

# 分類

<ul>
{% for category in site.categories %}
  {% case category[0] %}
    {% when 'AI' %}
      <li><a href="{{ '/category/ai/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '工具分享' %}
      <li><a href="{{ '/category/工具分享/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '提示工程' %}
      <li><a href="{{ '/category/提示工程/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '教學心得' %}
      <li><a href="{{ '/category/教學心得/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when 'embedded-Linux' %}
      <li><a href="{{ '/category/embedded-linux/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when 'buildroot' %}
      <li><a href="{{ '/category/buildroot/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when 'nuc980' %}
      <li><a href="{{ '/category/nuc980/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '技術分享' %}
      <li><a href="{{ '/category/技術分享/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '開發工具' %}
      <li><a href="{{ '/category/開發工具/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when 'AI 開發' %}
      <li><a href="{{ '/category/ai-開發/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% when '生活思考' %}
      <li><a href="{{ '/category/生活思考/' | relative_url }}">{{ category[0] }} ({{ category[1].size }})</a></li>
    {% else %}
      <li>{{ category[0] }} ({{ category[1].size }})</li>
  {% endcase %}
{% endfor %}
</ul>