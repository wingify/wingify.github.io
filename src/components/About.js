import React from 'react'
import Markdown from 'react-markdown'

const About = () => (
  <>
    <h1>About</h1>
    <br />
    <center>
	    <img src="/images/hamster-says-hello.png" alt="Hamster says hello" width="400" />
    </center>
    <br />
    <Markdown source={`We are bunch of young fun filled, smart and energetic hamsters powering the super duper A/B testing tool [VWO](https://vwo.com) and website push notifications tool [VWO Engage](https://vwo.com/engage).`} />
  </>
)

export default About
