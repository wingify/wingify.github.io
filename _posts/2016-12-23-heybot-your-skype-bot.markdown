---
layout: post
title: "Heybot! - Our skype bot"
excerpt: Heybot! - Our skype bot
authorslug: kushagra_gour
author: Kushagra Gour
---

Few days back, we open-sourced our internal Skype bot to the world. Its called [Heybot!](https://github.com/wingify/heybot), but we call it Ramukaka at Wingify :) Whether its about running a jenkins build or getting a customer info from account ID, Ramukaka does it all for us.

Heybot! gives you a simple framework to write commands that you can run, with provision of restricted access to some commands by power users only. Its written over [Microsoft's bot framework](https://dev.botframework.com/), designed to be extensible for any sort of task in small and large teams. Bot framework based bots work out of the box with Skype, but the same bots can act as a base for a Messenger, slack etc bot too.

So if your team communication is on Skype (or even if you work alone) and regularly do some tasks which could be automated through a command, Heybot! can definitely prove useful for you. Lets see how you can quickly set it up for Skype.

### Installing

Heybot! is written in NodeJS. To set it up on a server you need to clone the Github repository first:

```shell
git clone git@github.com:wingify/heybot.git
```

and run `npm install` in the repository folder to install all the required dependencies.

### Setup

Before you can start using the bot on Skype, you need to create a bot and register it with Microsoft as an app. Create a Microsoft app as directed [here](https://docs.botframework.com/en-us/csharp/builder/sdkreference/gettingstarted.html#registering). When you register your bot, you'll have to give it a name of your choice that will be used in Skype chat to talk with it.

Once you register the bot, you'll have an app ID and app Password with you. Go ahead and create a copy of the file `creds.template.js` into `creds.js` and replace the ID and password in it. If you don't want to store the ID and password in that readable file, you can have the same keys set as environment variables and Heybot will read from there. Note, that you still need to have a dummy `creds.js` file.

The bot framework requires the bot server to be running on a valid secure connection. Therefore, you'll need to provide the Heybot with your domain's SSL certificates (the .crt and .key files). Place them in the repository folder as `ssl.cert` and `ssl.key`.

### Running the bot server

Now that you have setup your bot, you can run the bot server by running the command `npm start`. Similarly to stop it you can run `npm stop`.

### Adding your bot on Skype

The bot you setup would in most cases have commands that you use on day to day basis and it won't make sense to put such a bot publicly on the Microsoft bot marketplace. For this reason, you can keep you bot in preview mode - just available for you and anyone with the link to add the bot.

Go to your bot's page from https://dev.botframework.com/bots. Now click on the **Add to Skype** button to add it to your skype.

<div style="text-align:center; margin: 10px;">
  <img src="/images/2016/12/add-to-skype.png">
</div>

Once you have added it your skype, you are all set to give it commands. Lets assume you gave your bot the name **droid** while registering. You can test your new bot by starting a conversation with it and saying anything. If it replies with a Hello message, its working perfectly. You can then try out pre-loaded commands such as `!bored`, `!sad`, `!bitcoin` etc.

If you add the bot to a group chat, you can give it command by simply mentioning its name before the command's usual syntax. Eg. `@Droid !bored`.

<div style="text-align:center; margin: 10px;">
  <img src="/images/2016/12/chatscreen.png">
</div>

There you go! Build your own commands and automate your daily boring tasks with Heybot! And do [tell us on Github](https://github.com/wingify/heybot/issues) about any feature request, suggestion or any cool command that you made for Heybot!
