import React from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../layout'
import Bio from '../components/Bio'
import PostTags from '../components/PostTags' // eslint-disable-line no-unused-vars
import SocialLinks from '../components/SocialLinks'
import SEO from '../components/SEO'
import config from '../../data/SiteConfig'
import styles from './post.module.scss'
import './prism-okaidia.css'
import yamlData from "../../_config.yml"
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'

export default ({ data, pageContext }) => {
  const { slug, nexttitle, nextslug, prevtitle, prevslug } = pageContext
  const postNode = data.markdownRemark
  const post = postNode.frontmatter
  const date = postNode.fields.date;
  postNode.frontmatter.twitter = yamlData.authors[postNode.frontmatter.authorslug] && yamlData.authors[postNode.frontmatter.authorslug].twitter;
  let disqusConfig = {
    url: `${config.siteUrl+slug}`,
    identifier: post.id,
    title: post.title,
  }
  if (!post.id) {
    post.id = slug
  }

  function loadJs() {
    return new Promise(function (resolve, reject) {
      var scriptEl = document.createElement('script');

      scriptEl.setAttribute('type','text/javascript')
      scriptEl.setAttribute('src', 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML')

      scriptEl.onload = function () {
        resolve();
      }

      scriptEl.onerror = function () {
        reject();
      }

      document.getElementsByTagName('head')[0].appendChild(scriptEl)
    });
  }

  if (window.location.href.indexOf('maths-behind-bayesian-duration-calculator') > -1) {
    loadJs().then(function () {
      if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
      }
    })
  }

  return (
    <Layout>
      <main>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitle}`}</title>
          <link rel="icon" type="image/png" href="/images/favicon.png" />
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <div>
          <h1>{post.title}</h1>
          <Bio frontmatter={postNode.frontmatter} yamlData={yamlData} />
          <p className={styles.postMeta}>
            {date} &mdash; {postNode.timeToRead} Min Read{' '} | &nbsp;
            <CommentCount config={disqusConfig} placeholder={'...'} />
          </p>

          <div dangerouslySetInnerHTML={{ __html: postNode.html }} />

          <hr />
          <div className={styles.postMeta}>
            <SocialLinks postPath={slug} postNode={postNode} />
          </div>
        </div>
        <nav>
          <ul className={styles.pagination}>
            <li>
              <Link to={prevslug} rel="prev">
                ← {prevtitle}
              </Link>
            </li>
            <li>
              <Link to={nextslug} rel="next">
                {nexttitle}→
              </Link>
            </li>
          </ul>
        </nav>
        <Disqus config={disqusConfig} />
      </main>
    </Layout>
  )
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        author
        authorslug
      }
      fields {
        slug
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
