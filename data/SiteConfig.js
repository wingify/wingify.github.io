const config = {
  siteTitle: 'Wingify Engineering', // Site title.
  siteTitleShort: 'Wingify Engg', // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: 'Wingify Engineering - Blog', // Alternative site title for SEO.
  siteLogo: '/images/logo-1024.png', // Logo used for SEO and manifest.
  siteUrl: 'https://engineering.wingify.com/', // Domain of your website without pathPrefix.
  siteDescription:
    'This is the engineering blog from the hackers at Wingify', // Website description used for RSS feeds/meta description tag.
  siteRss: '/atom.xml', // Path to the RSS file.
  googleAnalyticsID: 'UA-36431088-2', // GA tracking ID.
  dateFromFormat: 'YYYY-MM-DD', // Date format used in the frontmatter.
  dateFormat: 'DD/MM/YYYY', // Date format for display.
  userTwitter: 'wingify_engg', // Optionally renders "Follow Me" in the Bio segment.
  userGitHub: 'wingify', // Optionally renders "Follow Me" in the Bio segment.
  copyright: 'Copyright © Wingify. All rights reserved.', // Copyright string for the footer of the website and RSS feed.
  themeColor: '#c62828', // Used for setting manifest and progress theme colors.
  backgroundColor: 'red', // Used for setting manifest background color.
  pathPrefix: '',
  gtmID: 'GTM-T9CS925'
}

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/')
  config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
// if (config.siteRss && config.siteRss[0] !== "/")
//   config.siteRss = `/${config.siteRss}`;

module.exports = config
