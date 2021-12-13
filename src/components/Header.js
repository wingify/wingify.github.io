import React from 'react'
import { Link } from 'gatsby'
import config from '../../data/SiteConfig'
import styles from './Header.module.scss'

const Header = () => (
  <header>
    <h1>
      <Link to="/" activeClassName={styles.activeNav}>
        <span className={styles.brand}>
          <img src="https://wingify.com/wp-content/themes/wingify/images/labs/engg_blog.png" width="30px" height="30px" alt="Wingify Engineering" />
          <span style={{ marginTop: "5px", marginLeft: "15px" }}>{config.siteTitle}</span>
        </span>
      </Link>
    </h1>
    <nav>
      <ul className={styles.mainNav}>
        <li>
          <Link to="/" activeClassName={styles.activeNav}>
            Posts
          </Link>
        </li>
        <li>
          <Link to="/labs" activeClassName={styles.activeNav}>
            Labs
          </Link>
        </li>
        <li>
          <Link to="/about" activeClassName={styles.activeNav}>
            About
          </Link>
        </li>
        <li>
          <a href="https://github.com/wingify">
            Github
          </a>
        </li>
        <li>
          <a href="/atom.xml">
            Feed
          </a>
        </li>
        <li>
          <a href="https://wingify.com/careers/" className={styles.weAreHiring} target="_blank">
            <span>We are Hiring</span>
          </a>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header
