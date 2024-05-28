const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const siteConfig = require("./data/SiteConfig");
const { createFilePath } = require(`gatsby-source-filesystem`);
const slugify = require("slug");
const execSync = require('child_process').execSync;
const markdown = require( "markdown" ).markdown;
const cheerio = require('cheerio');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const { categories } = node.frontmatter;
    const slug = createFilePath({ node, getNode, basePath: `_posts` });
    const [, date, title] = slug.match(
      /^\/([\d]{4}-[\d]{2}-[\d]{1,2})-{1}(.+)\/$/
    );
    const value = `/posts/${title}/`;
    let html = entities.decode(markdown.toHTML(node.rawMarkdownBody));
    const $ = cheerio.load(`<section>${html}</section>`);
    if ($('section').find('img').length > 0) {
      createNodeField({ node, name: `thumbnail_url`, value: $('section').find('img:nth-of-type(1)').attr('src').replace(/<em>/g, '_').replace(/<\/em>/g, '_') });
    } else {
      createNodeField({ node, name: `thumbnail_url`, value: 'https://wingify.com/wp-content/themes/wingify/images/labs/engg_blog.png'})
    }
    createNodeField({ node, name: `slug`, value });
    createNodeField({ node, name: `date`, value: moment(date).toISOString() });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark (sort: { fields: [fields___date], order: DESC }) {
          edges {
            node {
              fields {
                slug
                date
              }
              frontmatter {
                title
                author
                authorslug
              }
            }
          }
        }
      }
    `).then(result => {

      const postsEdges = result.data.allMarkdownRemark.edges;

      postsEdges.forEach((edge, index) => {
        const nextID = index + 1 < postsEdges.length ? index + 1 : 0;
        const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1;
        const nextEdge = postsEdges[nextID];
        const prevEdge = postsEdges[prevID];

        createPage({
          path: edge.node.fields.slug,
          component: path.resolve(`src/templates/post.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: edge.node.fields.slug,
            date: edge.node.fields.date,
            nexttitle: nextEdge.node.frontmatter.title,
            nextslug: nextEdge.node.fields.slug,
            prevtitle: prevEdge.node.frontmatter.title,
            prevslug: prevEdge.node.fields.slug
          }
        });
      });

      /*
      postsEdges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`src/templates/post.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
            date: node.fields.date
          }
        });
      });*/
      execSync("mkdir -p public/images && cp -R images/* public/images && cp robots.txt public/robots.txt && cp -R labs/* public/ && cp -R css public/ && cp -R docs/* public/");
      resolve();
    });
  });
};
