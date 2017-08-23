---
layout: post
title: "PyData at Wingify - My Experience"
excerpt: PyData at Wingify - My Experience.
authorslug: pramod_dutta
author: Pramod Dutta
---


### About PyData 

Recently I got an opportunity to Speak at PyData as Speaker. PyData is chapter in Delhi and other region where Python enthusiast share there ideas, projects related to Data Analysis and Machine learning. 


### Background about My Talk

Let me give a little background, It was Friday before one day of the PyData Meetup/Conference , It was Chill day ☀️ . All of our engineering team was doing there daily task. I had just taken up the coffee to alienate my laziness 😩. Suddenly Our Engineering lead came up and Ask if anyone can Present anything on the PyData that we are going to organise in the Next 24 hour. I can clearly sees that most of the people avoided the eye contact with the Lead as Saturday Holiday was at Risk (My Personal Opinion) but I had something different in my mind and during this transition or confusion  I said  I can do it I had one Project that I did a  back in  College when I was Learning Python I can present it. He said very well, Keep the slides ready.

### Preparing the Project &  Slides	
That Friday Night, I was just searching the old files which i have used, Finally I found all of them on my website, downloaded it and  ran the code it was working like a Charm 😍,  Yeah so I quickly created the slides around it,  after finishing smiled and slept at 4.30am.


### Little About the Basics and My Talk.

The Presentation I did was related to the Learning Data Analysis by Scrapping Websites. During may College Days we heavily used the BeautifulSoup Library in Python to scrap websites for the many personal projects. In this project I had an Idea if I can scrap the data from the websites which have data for the movies I can create a list  which all movies I definitely watch and have released date  after 2000 at least(I don’t like to watch Movies with rating > 8 but year > 2000). 

It was not the best idea at that time to scrap the website and then analyse(Data frame) but I learned lots of things by Scrapping data from Website using Beautifulsoup and then Data Analysis using Pandas & Data Visualization using MatplotLib (Python library) and then coming to conclusion about my movies list.

Now coming to Objective - Which movie to watch First from the Year 2000-2017(If year < 2000 then I don't want to watch them) -
Let's scrap the imdb for movies Data From 2000-2017 From and see.

```
from
bs4 import BeautifulSoup
import urllib2
def main():
    print("** ======  Data Extracting Lib -- by Promode  ===== **")
    testUrl = "http://www.imdb.com/search/title?at=0&count=100&\
    groups=top_1000&release_date=2000,2017&sort=moviemeter"
    pageSource = urllib2.urlopen(testUrl).read()
    soupPKG = BeautifulSoup(pageSource, 'lxml')
    titles = soupPKG.findAll("div",class_='lister-item mode-advanced')
    mymovieslist = []
    mymovies = {}
    for t in titles:
        mymovies = {}
        mymovies['name'] = t.findAll("a")[1].text
        mymovies['year'] = str(t.find("span", "lister-item-year").text).replace('','')
        mymovies['rating'] = float(str(t.find("span", "rating-rating").text)\
        .replace('','')[0:-3])
        mymovies['runtime'] = t.find("span", "runtime").text
        mymovieslist.append(mymovies)
    print mymovieslist
if __name__=="__main__":
    main()
```

Now we have data lets analyse it with the other libraries


<script>Galleria.run('#fifth-elephant-gallery');</script>
<div id="fifth-elephant-gallery" style="height: 600px;">
    <img src="/images/2017/06/6.jpg">
    <img src="/images/2017/06/0.jpg">
    <img src="/images/2017/06/8.jpg">
    <img src="/images/2017/06/7.jpg">
    <img src="/images/2017/06/2.jpg">
    <img src="/images/2017/06/1.jpg">
    <img src="/images/2017/06/5.jpg">
    <img src="/images/2017/06/4.jpg">
    <img src="/images/2017/06/9.jpg">
</div>

### Take away From Talk

With this method you can have winner's data from a Data set. For Example. Suppose You want to create a Cricket Team ( IPLT20) which
has a maximum probability to win the match. What you can do is Parse the IPLT20(iplt20) website for last 5 year data and select the top 5 batmans and 6 bowler 😎. 


### Other Talks

There are other Talk realted to the Machine Learning related to the Topic - Tensor Flow, Data layer at Wingify which were very good and are in Depth also. In the Talk 'Data layer at Wingify' By Manish where manish talked about how we handle millions of request at Wingify.
You can find the slides here. 


### Conclusion

I totally Understand that this may not be a complete project for the Data analysis. I am still learning I showed What i did. I believe it severed my Purpose.

I will be doing more research in Data analysis area in Python specially. Thanks for reading this.


Slides - 

<iframe src='http://py.scrolltest.com/#/' height="500px" width="100%" />

If you would like to source code. You can have a look here [https://github.com/PramodDutta/ScrapToDataAnalysis].

 