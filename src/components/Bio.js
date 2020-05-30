import React from 'react'
import { Follow } from 'react-twitter-widgets'
import styles from './Bio.module.scss'

const Bio = ({ frontmatter, expanded }) => (
  <>
    <img
      className={styles.avatar}
      src={`/images/team/${frontmatter.authorslug}.png`}
      alt={frontmatter.author}
    />
    <p>
      Written by <strong>{frontmatter.author}</strong>
      {` `}
      <Follow
        username={frontmatter.twitter}
        options={{ count: expanded ? true : 'none' }}
      />
    </p>
  </>
)

export default Bio
