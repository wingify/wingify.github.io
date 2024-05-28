import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../layout'
import config from '../../data/SiteConfig'
import styles from '../../css/app.css' // eslint-disable-line no-unused-vars

const DocsPage = () => (
    <Layout>
      <main>
        <Helmet title={`Docs | ${config.siteTitle}`} />
        <h1>Wingify Engineering Projects - Documentation</h1>
        <h2>Documentation of our public projects</h2>
        <br />
        <div dangerouslySetInnerHTML={{
          __html: `
            <div class="projects">
              <div class="project-box">
                <a href="/vwo-fme-node-sdk/">
                  <img src="/images/generic_code@2x.png" width="160" height="160">
                  <h3>VWO FME Node SDK - Documentation</h3>
                </a>
                <p>Node.js SDK for VWO Feature Management and Experimentation</p>
                <span class="pill">javascript</span>
              </div>
            </div>
          ` }} />
        <br />
      </main>
    </Layout>
  )

export default DocsPage
