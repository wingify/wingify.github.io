---
layout: page
title: Archive
permalink: /posts/
---

{% for post in site.posts %}
<h3>
  <small>{{ post.date | date_to_string }}</small> <a href="{{ post.url }}">{{ post.title }}</a> <small>{{post.author}}</small>
  <img src="/images/team/{{post.authorslug}}.png" class="img-circle pull-right" style="width: 32px; height: 32px;">
</h3>
{% endfor %}
