---
layout: page
title: Archive
permalink: /posts/
---



<h1>Posts</h1>
{% for post in site.posts %}
<h3>
  <span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a>
  <a href="/team/#{{post.authorslug}}">
    <img src="/images/team/{{post.authorslug}}.png" class="img-circle pull-right" style="width: 32px; height: 32px;">
  </a>
</h3>
{% endfor %}
