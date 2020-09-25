import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../layout'
import config from '../../data/SiteConfig'
import styles from '../../css/app.css' // eslint-disable-line no-unused-vars

const LabsPage = () => (
    <Layout>
      <main>
        <Helmet title={`Labs | ${config.siteTitle}`} />
        <h1>Wingify Engineering Labs</h1>
        <h2>(Not so) Super secret projects we're baking.</h2>
        <br />
        <div dangerouslySetInnerHTML={{
          __html: `
            <div class="projects">
              <div class="project-box">
                <a href="https://github.com/wingify/marque">
                  <img src="/images/marque.png" width="160" height="160">
                  <h3>Marque</h3>
                </a>
                <p>Tag Versioning Helper.</p>
                <span class="pill">javascript</span>
              </div>
              <div class="project-box">
                <a href="http://github.com/wingify/lua-resty-pubsub">
                  <img src="/images/generic_code@2x.png" width="160" height="160">
                  <h3>lua-resty-pubsub</h3>
                </a>
                <p>Pubsub client driver for the <i>ngx_lua</i> using <i>cosocket</i> API.</p>
                <span class="pill">lua</span>
              </div>
              <div class="project-box">
                <a href="/across-tabs/">
                  <img src="/images/across-tabs@2x.png" width="160" height="160">
                  <h3>AcrossTabs</h3>
                </a>
                <p>Easily communicate among browser tabs.</p>
                <span class="pill">javascript</span>
              </div>
              <div class="project-box">
                <a href="/angular-time-picker/">
                  <img src="/images/time-picker@2x.png" width="160" height="160">
                  <h3>Time Picker Directive</h3>
                </a>
                <p>Lightweight Time Picker directive for Angular.js.</p>
                <span class="pill">javascript</span>
              </div>
              <div class="project-box">
                <a href="/q-directives/">
                  <img src="/images/speed@2x.png" width="160" height="160">
                  <h3>Q-Directives</h3>
                </a>
                <p>A faster directive system for Angular.js.</p>
                <span class="pill">javascript</span>
              </div>
              <div class="project-box">
                <a href="http://github.com/wingify/please.js">
                  <img src="/images/post_message@2x.png" width="160" height="160">
                  <h3>Please.js</h3>
                </a>
                <p>A simple PostMessage communication library.</p>
                <span class="pill">javascript</span>
              </div>
              <div class="project-box">
                <a href="http://github.com/wingify/agentredrabbit">
                  <img src="/images/generic_code@2x.png" width="160" height="160">
                  <h3>AgentRedRabbit</h3>
                </a>
                <p>Transport agent that moves data from Redis to RabbitMQ.</p>
                <span class="pill">python</span>
              </div>
              <div class="project-box">
                <a href="/dom-comparator/">
                  <img src="/images/dom@2x.png" width="160" height="160">
                  <h3>DOMComparator</h3>
                </a>
                <p>A library to analyze and compare two DOM trees.</p>
                <span class="pill">javascript</span>
              </div>
            </div>
          ` }} />
        <br />
      </main>
    </Layout>
  )

export default LabsPage
