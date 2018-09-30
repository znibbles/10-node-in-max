## Connecting to the Outside World

When I first heard that Max is getting a NodeJS integration, I thought to myself, what endless possibilities. I'm not the greatest supporter of the JavaScript language and the environment it lives in, but hey, the premise of re-using other software I had written in Max was just too tempting.

That said, when it finally came out I was a little stunned not to find a more detailed introduction in how to set up a project with NPM, install modules etc. Maybe I didn't search intensely enough, but at least there wasn't something screaming at me: "TRY THIS". 

So well, while everybody else is freaking out about MC, here's my first take on Node in Max, a little script that allows you to play arbitrary YouTube videos in a `[jit.movie]`. When I asked on Twitter what could be a nice starter project, the answer I got was ["People will go nuts if NodeJS lets you open youtube tutos"](https://twitter.com/bl4ck_br41n_/status/1044741462682980354). So I just did it.

## Node Starter Kit

First things first, there is a chance that many of you have been writing some Javascript code in Max but never had the need to install NodeJS. You can obtain it from the [website](https://nodejs.org/en/download/). I'd recommend installing the long term support (LTS) version, on this machine I'm using `node v8.11.2` and `npm v6.3.0`. You can check your installed versions like so.

## Defining the Interface

Next, we're going to sketch how we'd like our Max patch to work, define how we'd like to interface with NodeJS. We'd like to send an `[open(` message with a URL, and if it's a valid YouTube URL obtain the actual `download_url` of the video, which we can then use to `read` in a `[jit.movie]` object, which supports opening files as well as remote URLs.

## Bootstrapping a Node Project

So how can we go about this? First, let's check [npmjs.com](https://www.npmjs.com/) if there is some node package that supports downloading YouTube videos. The first hit, `ytdl-core`, is already a bullseye. Let us initialize a node project with `npm init` here... You can basically call this project what you like and leave most of the other fields blank. I'd just advise you to call the `main` script, which we'll have to create afterwards, in a sensible and rememberable manner. 

Next we say

```
$ npm install --save ytdl-core
```

This does two things:

1. it installs the module into the project's `node_modules` folder.
2. it writes the dependency info into the newly created `package.json` file so anybody coming to this project later on can simply issue `npm install` and get the appropriate modules installed from the package definition file.

## Hooking Up Node in Max

Now on to the heart of the patch: the node script. We generate a JavaScript file and name it `watch-youtube.js`. Over in Max we load that into a `[node.script]` object which we set to `autostart` and `watch`, causing the Max object to reload the script whenever we make a change. Let's also fire up a `[node.debug]` object here.

We require in the max Api and add an `open` handler. Let's confirm that this works by writing to a Max `outlet`. So there we get our URL back. 

## Promises Kept

Now let's take a step back and think through what is going to happen. The remote API we are calling is in fact returning a JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and this will be the case in almost every web request you make via node. This can be a little bit confusing to everyone who is used to synchronous programming, so let me elaborate.

Actually, we are dealing with asynchronous code here, and we can mock what is going on under the hood by initializing a `Promise` object and setting the **resolve callback** to be triggered after a certain amount of time, 2000 milliseconds in this case.

We then call the `then` method of the promise, which actually is the **event handler** of the resolve callback, so to speak. That means, it is going to be called when the promise resolves, be it in our case because the timeout is over, or because the remote server answers our request. To test this, we again just post what we get to a Max `outlet`.

So back in Max we clean up our message here and click on the `open` message again. One, two, ... bang. Here it is. We now know our code is working asynchronous, promise-driven so to speak.

## YouTube Inquiry

Now let's remove that and continue with what we actually want to accomplish. We ask the `ytdl` library for info on the url we are passing in. This will return a promise. So next we call `then` and say we want to choose a format. That's because YouTube, as you probably know, offers multiple resolutions etc. per video, the empty object I'm passing here merely tells `ytdl` to fetch the default one. Last we send the `format`'s url prefixed by `download_url` to the Max outlet. 

Because this is relying on an Internet connection, one thousand different things could go wrong, so let's prepare for that case with a `catch` handler, too. In this case we're just posting to the Max console that something went wrong.

## Playing from the Web

So let's look at that here. Oh, as it seems I forgot to require the `ytdl` library, which will of course not work. This kind of thing happens when you don't use a linter, but that's another story. 

Back in Max we click on `[open https://youtu.be/foobar(` which logs an error to the console, as expected. Now we replace that with a valid URL and voila, we get a download URL from our `Promise`. So there we got our YouTube video running - with audio of course, which is muted here. Take it and transform it, pipe it into Vizzie or apply it to a GL texture, whatever you like.