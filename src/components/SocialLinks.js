import React from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookShareCount,
  LinkedinShareCount,
  RedditShareCount,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon
} from 'react-share'
import urljoin from 'url-join'
import config from '../../data/SiteConfig'
import styles from './SocialLinks.module.scss'

const SocialLinks = ({ postNode, postPath, mobile }) => {
  const post = postNode.frontmatter
  const url = urljoin(config.siteUrl, config.pathPrefix, postPath)
  const iconSize = mobile ? 32 : 32
  const filter = count => (count > 0 ? count : '')
  const renderShareCount = count => (
    <div className={styles.shareCount}>{filter(count)}</div>
  )

  return (
    <div className={styles.socialLinks}>
      <RedditShareButton url={url} title={post.title}>
        <RedditIcon round size={iconSize} />
        <RedditShareCount url={url}>
          {count => renderShareCount(count)}
        </RedditShareCount>
      </RedditShareButton>
      <TwitterShareButton url={url} title={post.title}>
        <TwitterIcon round size={iconSize} />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={postNode.excerpt}>
        <FacebookIcon round size={iconSize} />
        <FacebookShareCount url={url}>
          {count => renderShareCount(count)}
        </FacebookShareCount>
      </FacebookShareButton>
      <LinkedinShareButton
        url={url}
        title={post.title}
        description={postNode.excerpt}
      >
        <LinkedinIcon round size={iconSize} />
        <LinkedinShareCount url={url}>
          {count => renderShareCount(count)}
        </LinkedinShareCount>
      </LinkedinShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon round size={iconSize} />
      </TelegramShareButton>
    </div>
  )
}

export default SocialLinks
