## Live Coded Patcher Scripting

A while ago, I drafted a little [command-line tool called `maxy-gen`](https://github.com/julianrubisch/maxy-gen) to allow the creation of simple Max patches from the command line. It's written as a RubyGem, so you'll need the Ruby interpreter installed on your machine (if by any chance you're working on a Mac, that should automatically be the case).

Let's first install this gem with `gem install maxy-gen`. If you have already installed it, please update it to the latest version, 0.4.1, because I have made significant changes to make the examples in this screencast work. If you'd like to know more about how to use it, please refer to the [README on GitHub](https://github.com/julianrubisch/maxy-gen).

After installing it, we call `maxy-gen install`, which will ask for the location of your Max installation's refpages, since it will construct the objects list from there. Eventually, we need to find out where our `maxy-gen` executable is located for later use. Please note that this will be in a different location in your environment.

### Preparing for Patch Generation

Now let's open our REPL server file. What I intend to do in this tutorial, is make parts of our actual patcher live-scriptable by exchanging the contents of a `[bpatcher]`. 

Let's first sketch how we want to achieve this. We are going to input commands to our repl that first tell it which bpatcher to use, e.g. `cutoffs`, and then the maxy-gen representation of a patch. 

So we are going to split the input into two strings and destructure them into a JavaScript array, `[patcherName patch]`.

Next we need to prepare the `PATH` used in the script, because chances are your `maxy-gen` executable cannot be found when running it in the context of a Max patch. So we add the path we discovered earlier to our PATH like so. Of course, we also need to require the `path` object from the NodeJS standard library.

Let's actually move these statements into the `try...catch` block.

Now, let's sketch a function we want to invoke to actually create our patch with `maxy-gen`. Let's call it `makePatcher`, and it will take the `patcherName` and the `patch` from our input.

### Create a Patch from Inside NodeJS

Let's add three more imports, the `util`‌, `childProcess`, and `fs` modules.

We are going to use the `promisify` method from `util` to wrap the calls to `childProcess.exec` and `fs.writeFile` in Promises, otherwise we would need to use callbacks, which are ugly to read and debug. Just bear with me please :)

Alright, now on to the heart of this episode, the `makePatcher` function. Basically, we're using `exec` to make our Node script invoke the `maxy-gen` executable with the arguments given to it from our REPL (connected to an outlet by default). This will return a JSON representation of our Max patch, so let's capture it in the `output` variable. Since we wrapped it in a Promise, we need to `await` its output.

The second step is to actually write it to the file specified by `patcherName`, which is also called asynchronously and must be awaited. As the whole method thus is executed asynchronously, we must flag it as `async`. If you're not familiar with this new way of handling Promises, there are a million blogposts and tutorials out there explaining it in detail.

### Preparing the Main Patch for Scripting

Let's return to our main patch for a second. We need to create a bpatcher and give it a name, `cutoffs` in this case.

And there's another thing we need to do. When we're done creating the new bpatcher internals in the Node script, we need to exchange its contents, and this is done by sending a message to `[thispatcher]`. (Actually I made a mistake here in the video, it needs to be connected to the `[node.script]`'s first outlet, but since it's being echoed back through the textinput, it worked nonetheless. Sorry for the confusion 🙃.)

### Scripting the Patcher from Inside Node

Alright, now we need to return to the place where we actually invoke that `makePatcher` function. Since it returns a Promise, we call `then` so when it's resolved, we can send a `script sendbox` message to the `[thispatcher]` object telling it to replace the context of the patcher named `patcherName` with the newly overwritten file. You can see now why I promisified this, because it ensures that the sending of the message is done only **after** the executable is done writing!

### Live Coding

Okay, let's give it a spin. We'll first preload our bpatcher with a `cutoffs` file. Now we specify different contents of the bpatcher and you can instantly hear the changes.

Let's make a second one for resonances, called `res`, and create it from our REPL, load it into the bpatcher and connect it.

Last but not least we do something similar for the amplitude modulation, and call the bpatcher `amps`.

So here we are, live-coding parts of our actual Max environment from a REPL. Thanks to [Darwin Grosse](https://twitter.com/darwingrosse) for helping me out with the replacing of the bpatcher contents via `thispatcher` 👍.

### Improvements TODO

Our REPL is still crashing on invalid inputs, which isn't any good in a live coding environment, so we need to make it more resilient, but we'll deal with that in a later episode.
