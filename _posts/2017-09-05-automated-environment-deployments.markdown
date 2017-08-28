---
layout: post
title: "Automated environment deployments"
excerpt: How we deploy environments through automation at VWO.
authorslug: kushagra_gour
author: Kushagra Gour
---

Shipping bug-free feature is always important in every release. To ensure this, we do quality analysis(QA) at various points of the feature cycle. To facilitate an efficient QA, we also maintain certain environments for our app each having a different purpose. We have following environments to be specific:

1. **Production** - The actual live app.
2. **Staging** - A replica of production where final sign-off QA is done just before going live.
3. **Testapp** - A quick deployable environment which can be used by developers to share the WIP feature branch with anyone in the company or among other developers.

With multiple features in development simultaneously and multiple environments to deploy, automated deployment become very important to ensure friction-less and fast feature lifecycle. In this post I'll try to explain how to manage all this environment deployments through automation, especially for our product VWO.

## Testapps

As mentioned above, testapps are very lightweight environments which developers generally create to share their WIP feature branch with other developers, QA or someone from marketing/product to gather feedback. Our app consists of various components: frontend, main-backend and various other micro-services. So each testapp environment is basically a combination of different branches from each of the constituent components. For example we have frontend, backend and Service-1, our testapps can look like so:

Testapp #1 - *master* (frontend) + *feat-notifications* (backend) + *master* (service-1)

Testapp #2 - *feat-auth* (frontend) + *feat-auth* (backend) + *master* (service-1)

And as these testapp should have a unique sharable URL,  they can be given names like: `feat1.vwo.com` or `heatmap-optimizations.vwo.com`

### Deployment

To deploy such a testapp we have a job on Jenkins. As you may have guessed already, the inputs to this job are:
1. Name of the testapp instance
2. Frontend branch
3. Backend branch
4. Service-1 branch

Once this job runs, it pulls on all the above 3 branches on a remote server, does some configuration changes and creates a virtual host to work on `testappname.vwo.com`.

### More automation

Now even this job would require the developer to open jenkins webapp, go to job page, put in inputs and then run it. But we avoid that too - enter **Ramukaka**!. Ramukaka is our Skype bot ([that we have open-sourced also](https://github.com/wingify/heybot)) that we use for various grunt tasks, such as running a jenkins job!

With Ramukaka in the picture, our testapp deployment looks like so:

![](https://www.dropbox.com/s/rbr1vpr7ambnpy0/Screenshot%202017-08-28%2010.45.14.png)

Note: we have 3 components and only 2 branches are gives. That is because the developer can skip a component if the branch to be deployment is default *master*. Also, the same command just pulls the latest changes in case the testapp instance already exists.

Neat, right?

## Staging

Staging has primarily 2 differences from testapp:
1. There is just 1 staging
2. There is some more build process involved in comparison to a testapp

So its similar to testapp deployment, except that before deploying the developer to build his/her branch like so:

![](https://www.dropbox.com/s/4x3g4gapyz61chw/Screenshot%202017-08-28%2010.53.33.png?dl=0)

Note: While building a branch we also tell the job about the environment to build for (eg. stagingapp above) because right now the code needs to be tweaked a little according to the domain its deployed on.

And once *Ramukaka* confirms a successfull build, the developer deploys the stagingapp with that branch:

![](https://www.dropbox.com/s/06gfn1iyd5523av/Screenshot%202017-08-28%2010.54.50.png?dl=0)

### Some more commands

As I mentioned, we have just one staging (single outlet to production). Therefore, each deployment overwrites the previous deployment. And so it becomes important that developers do not overwrite each other's deployment by mistake. To prevent this, we have an additional command on *Ramukaka* called `currentBranch`. Through this command anyone can check which branch is deployed for a particular component on stagingapp. Eg. if I need to check the frontend branch on stagingapp, I would do so:

![](https://www.dropbox.com/s/ekfge22ie0pvqtv/Screenshot%202017-08-28%2011.01.29.png?dl=0)

Now the developer can take appropriate action based on the deployed branch.

## Production

Production is no different from stagingapp. Once the final round of testing is done by QA team on stagingapp, 3 things need to be done to deploy the app on production:

1. Build the branch
2. Tag master
3. Deploy on server

All the 3 things are handled through a single command on *Ramukaka*:

![](https://www.dropbox.com/s/mduhqnwikd9fmn8/Screenshot%202017-08-28%2011.08.34.png?dl=0)

And the frontend is deployed on production, just like that!

Note: Right now only frontend deployment is automated for production. But we plan to do it for all the components of the app.

## Going Ahead

All this deployment automation saves us a huge amount of time. And we know we can save more. Using similar automation for each and every component of the app is something we plan to do next. Also better reporting and monitoring of these environment is on the list.

How do you manage multiple environments? We would love to hear about your deployment techniques if you want to share in the comments.

Until next time!