import React from 'react'
import { Link } from 'gatsby'
import styles from './PostsListing.module.scss'

const PostListing = ({ postEdges }) => {
  const getPostList = () => {
    const postList = []
    postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.fields.slug,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        thumbnailUrl: postEdge.node.fields.thumbnail_url,
        authorslug: postEdge.node.frontmatter.authorslug,
        author: postEdge.node.frontmatter.author,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      })
    })
    return postList
  }

  const postList = getPostList()
  return (
    <div className={styles.articleList}>
      {/* Your post list here. */
      postList.map(post => (
        <Link to={post.path} key={post.title}>
          <article className={styles.articleBox}>
            <div className={styles.right}>
              <div className={styles.thumbnailContainer}>
                <img
                  src={`${post.thumbnailUrl}`}
                  alt={post.author}
                />
              </div>
              <h3>{post.title}</h3>
              <img className={styles.authorImage}
                src={`/images/team/${post.authorslug}.png`}
                alt={post.author}
              />
              <div className={styles.authorDescription}>
                <h5 className={styles.authorName}>By {post.author}</h5>
                <div className={styles.meta}>
                  {post.date} &mdash; {post.timeToRead} Min Read{' '}
                </div>
              </div>
              <p>{post.excerpt}</p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

export default PostListing
