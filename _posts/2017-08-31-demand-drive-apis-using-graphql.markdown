---
layout: post
title: "Demand-driven APIs Using GraphQL"
excerpt: Demand-driven APIs Using GraphQL.
authorslug: sahilbatla
author: Sahil Batla
---

### Introduction

This article will deal with the issues we face with the current API architecture (mostly REST) and why demand-driven APIs seem a perfect replacement for it. We will also talk in brief, about <a href="http://graphql.org/learn/">GraphQL</a> and how it is a feasible solution for implementing demand-driven applications.

Note: This article is inspired from [Demand driven Applications with GraphQL](https://www.slideshare.net/vincirufus/demand-driven-applications-with-graphql-78403822) by [Vinci Rufus](https://www.linkedin.com/in/vinci) at [JS Channel 2017](http://2017.jschannel.com/).

### Why Demand-driven API? What's wrong with REST?

Let's take a simple example of author & articles. If we are given a requirement to develop an API to fetch authors or articles, it will most probably go like this, if we follow REST:

<ul>
  <li> GET /authors/:authorId </li>
  <li> GET /articles/:articleId </li>
</ul>

Let's taken an example where we have to show an article snippet on my website's dashboard. We would need its **title, description & author name**. So we hit the latter end point and it will give a response like:

```javascript
{
  title: 'Demand Driven APIs Using GraphQL',
  createdAt: '2017-04-25',
  updatedAt: '2017-08-25',
  articleId: '96',
  authorId: 50,
  status: 'published',
  description: 'Lorem Ipsum...'
}
```

There are two problems with this response:

1) **Extra information**: We only needed the **title** & **description** but we got everything related to the article and we cannot get rid of this extra payload as this extra information might be getting consumed at some other page i.e. Edit Article Page.

2) **Missing information**: We were expecting **author name** but instead we got **authorId**. This is bad and to solve this we would probably be making another network call on the former end point to get the author name. It's an overhead making 2 network calls just to fetch 3 parameters, don't you think? Also, it will just get more complex as we include more resources i.e. comments, images etc.


### How Demand-driven Applications Work?

Now that we understand few issues with REST based APIs, we need a smart system which can give me the exact information required instead of giving me partial/extra information.This can be solved if the client demands what it actually needs and server gives it only that piece of information. This can be done using GraphQL.

Let's try to solve our problem using GraphQL. The exact information that our client need can be represented in GraphQL as:

```javascript
{
  article (id: articleId)
  {
    title,
    description,
    author {
      name
    }
  }
}
```

The server can have a single end point with the following [schema](http://graphql.org/learn/schema/):

```javascript

type Article(id: Integer) {
  title: String,
  description: String,
  status: String,
  createdAt: Date,
  updatedAt: Date,
  status: String,
  author: Author
}

type Author(id: Integer) {
  name: String,
  email: String,
  photo: Picture,
  followers: [User]
}

type Picture(id: Integer) {
  imgPath: String,
  imgHeight: Integer,
  imgWidth: Integer
}

```

And each field in our schema can have a function to fetch that piece of information. In our case:

```javascript

  function Article(id) {
    return Article.find(id);
  }

  function Article_title(article) {
    return article.title;
  }

  function Article_description(article) {
    return article.description;
  }

  function Article_author(article) {
    return article.author;
  }

  function Author_name(author) {
    return author.name;
  }

```

On querying the data, we get i.e.

```javascript

curl -XGET http://myapp/articles -d "query={
  article(id: 1) {
    title,
    description,
    author {
      name
    }
  }
}"

```

We will get like this:

```javascript
{
  title: 'Demand Driven APIs Using GraphQL',
  description: 'Lorem Ipsum...',
  author: {
    name: 'Sahil Batla'
  }
}
```

This is what we needed, now we can keep the endpoint same and tweak with fields required to display relevant information at any page of our website.

### Advantages of Demand-driven APIs

1) Single end point for serving any piece of information.

2) Less payload of data as no extra information is served.

3) Versioning of APIs become simpler as we can control the exact information required.

### Disadvantages of Demand-driven APIs

1) Latency may increase due to a single end point handling all the querying of data.

2) No lazy loading possible as it's a single call which will contain all the data.

### Try it Out

If you think GraphQL is promising go ahead and try it out. There is much more to it that you will love to learn. Check out its [official documentation](http://graphql.org/learn/). It has been implemented in all the well known languages and you can find it all [here](http://graphql.org/code/).
