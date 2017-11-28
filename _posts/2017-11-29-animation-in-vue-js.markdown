---
layout: post
title: Animation in VueJS
excerpt: Vue JS
authorslug: ashish_bardhan
author: Ashish Bardhan
---

This article is inspired from Animation in [Vue JS by Sarah Drasner](http://slides.com/sdrasner/animating-vue-keynote) at [JS Channel 2017](http://2017.jschannel.com/).

### Problem Statement - Why Animation?
**Website UI Development** is not about making things beautiful. It’s all about website performance and customer experience. According to studies from **Amazon** and **Walmart**, they discovered a drop of conversion rate/revenue on increasing the user interaction time as the user feels interrupted during the interaction. Another study discovered that a customised animated loader made a higher wait time and lower abandon rate compared to generic one as the user felt more interactive with the former loader.

In a nutshell, the animation of your application should be more interactive and engaging with user, kind of like **a cinema booking application** and **a form inside a location tag** for example.

### What is VueJS?
For those who are familiar with **Angular** and **ReactJS**, **VueJS** is a progressive Javascript framework that supports some features:

- A virtual DOM
- Declarative Rendering
- Computed properties
- Reactive components
- Conditional rendering … to name a few

Some of these features are similar to what **Angular** and **ReactJS** already provide. However, you can check [comparison oj VueJS with other frameworks](https://vuejs.org/v2/guide/comparison.html).

### ToDo List Example
Let’s take a simple example of **ToDo List**, containing a list of tasks and functionality of adding/removing a task to/from the list.

This will be our view in **HTML** file, assuming that you’ve included **VueJS** in a `script` tag already.

{% highlight html %}
<div id="app">
    <input type="text" v-model="task"/>
    <input type="button" value="Add" v-on:click="addTaskToList"/>
    <ul>
        <li v-for="(todo, index) in todoList">
            {% raw %}{{ todo }}{% endraw %}
            <input type="button" value="Remove" v-on:click="removeTaskFromList(index)"/>  
        </li>
    </ul>
</div>
{% endhighlight %}

Meanwhile, our **JS** file looks like this.

{% highlight js %}
var app = new Vue({
    el: '#app',
    data: {
        task: 'my first task',
        todoList : []
    },
    methods : {
        addTaskToList : function(){
            this.todoList.push(this.task);
        },
        removeTaskFromList : function(index){
            this.todoList.splice(index, 1);
        }
    }
});
{% endhighlight %}

The code itself is self-explanatory. It simply adds a `task` inside the `todoList` using `addTaskToList` method and removes from the list using `removeTaskFromList`.

The event binding and loops syntax in the HTML looks similar to what you see in **AngularJS**. However, the syntax of variables and methods is different in JS, which reminds you of private variables and public methods you used to code in **C++**. You can view the demo here.

Let’s add more interaction in this. A confirmation popup should come up with `OK` and `Cancel` options, where the particular task if only you press the former option. Regardless of the option chosen, the popup should be closed later on.

In **HTML**, Let’s modify the list element

{% highlight html %}
<li v-for="(todo, index) in todoList">
    {% raw %}{{ todo }}{% endraw %}
    <input type="button" value="Remove" v-on:click="onRemoveTask(index)"/>
</li>
{% endhighlight %}

And add a new popup element

{% highlight html %}
<div v-show="isPopupOpen">
    Are you sure you want to remove this from ToDo List?<br/>
    <input type="button" value="OK" v-on:click="confirmRemove()"/>
    <input type="button" value="Cancel" v-on:click="cancelRemove()"/>
</div>
{% endhighlight %}

Meanwhile in **JS**, initialize new data variables inside

{% highlight js %}
data: {
    isPopupOpen : false,
    currentIndex: -1
}
{% endhighlight %}

And also, add some methods

{% highlight js %}
methods : {
    onRemoveTask : function(index) {
        this.isPopupOpen = true;
        this.currentIndex = index;
    },
    confirmRemove : function() {
        this.removeTaskFromList(this.currentIndex);
        this.isPopupOpen = false;
    },
    cancelRemove : function() {
        this.isPopupOpen = false;
    }
}
{% endhighlight %}

Let’s add some animation into it.

For the fading-in/out the popup, you need to wrap our popup inside `transition` tag.

{% highlight html %}
<transition name="fade">
    <div v-show="isPopupOpen">
        … Popup element content
    </div>
</transition>
{% endhighlight %}

This element takes care of the transition logic. You don’t need to bother when to start or stop transition. All you’ve to mention is what kind of transition you want to see and for how long. This can be done using some CSS classes provided by VueJS.

{% highlight css %}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
{% endhighlight %}

**Note:** The `fade` prefix used in this class should match the `name` attribute of the `transition` component.

For blurring the form and the list elements once the popup appears, they should be wrapped inside a contained conditionally bounded using `v-bind` attribute.

{% highlight html %}
<div v-bind:class="[isPopupOpen ? 'disabled' : '', ‘container’]">
    … Form and ToDo List element content
</div>
{% endhighlight %}

And add the required **CSS**

{% highlight css %}
.container {
    transition: all 0.05s ease-out;
}

.disabled {
    filter: blur(2px);
    opacity: 0.4;
    pointer-events: none;  // This makes sure that nothing else is clicked other than popup options
}
{% endhighlight %}

You can check the complete code and view demo here.

### Advantages
- Clean 
- Semantic
- Maintainable

This is how you can create applications and make animations in more simpler and semantic way. However, you must have intermediate knowledge of **HTML**, **CSS** and **JavaScript**. If you think **VueJS** is promising go ahead and try it out. There is much more that you will love to learn about. Check out the [official documentation](https://vuejs.org/v2/guide/).