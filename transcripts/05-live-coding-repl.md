## Simple Live Coding REPL

Lately I've been really impressed by Timo Hoogland's live coding patch which he put on [Gumroad](https://gumroad.com/tmhglnd), and while I'm still leaning on him to assemble a nice video tutorial for it, it sparked an exploration of how an efficient live coding shell could be set up with node4max. NodeJS already has a lot of the requirements covered, so we're going to take a deeper look at this.

First, a definition: I'm going to talk about a so-called REPL, that's short for **R**ead, **E**valuate, **P**rint, **L**oop, and is nothing else than a sort of built-in shell for a programming runtime. PHP has one, Ruby has one, Elixir has one, and of course, Node does so too. Let's take a look. We open a terminal and type

	$ node
	
after which we are greeted by a prompt:

	> 
	
We can now **read** in any valid JavaScript expression

	> 1 + 1
	> new Date()
	> Math.random()
	> [1, 2, 3].map(elem => Math.pow(elem, 3))

which it will **evaluate** and then **print**. When it is finished, it will **loop** over and present you a prompt again (hence the name).

Now the thing is, Node will actually let you _extend_ its built-in REPL if you like (you can find the relevant docs [here](https://nodejs.org/api/repl.html)), but we will actually take a step back and do a more low-level implementation using [readline](https://nodejs.org/api/readline.html). The reasons for this choice will become clear in the next episode.

## Building the REPL in Pure Node

Before we even consider opening Max, let's just build this pseudo-shell from scratch. We start with an empty `npm` project by typing 

	$ npm init -y
	
(the `-y` flag skips all questions asked in the init process).

We create a file called `repl-server.js` and first of all require the `readline` module. We then create an interface with `readline.createInterface` and define the `STDIN` and `STDOUT` streams as input and output. If you're not familiar with this terms, let's simplify things by saying `STDIN` is your keyboard, and `STDOUT` is your screen. Afterwards we `prompt` for input.

Let's give this a go:

	$ node repl-server.js
	
So here's the prompt, we can input things but nothing happens. Unsurprisingly, because we haven't yet coded any logic. 

Next we need to listen for an event that's called by the runtime on the readline interface whenever the user presses `<Enter>`. This is the `line` event, and here we get the actual input passed in as a parameter.

We will look at this in a second, let's just also chain the `close` event on this and issue a friendly goodbye message when the user closes the REPL.

In the `line` event, we just echo the input back. So that works, after the first prompt we just don't get a second opportunity to input something. So after echoing the input, we issue another `rl.prompt()`. 

Here's the first prompt, and there is the second - great.

## Using `node.script` with STDIN and STDOUT

When we start our Max patch with a `[node.script]` object that references our `repl-server.js`, keep in mind that we haven't even yet included the Max API in our JavaScript! Instead, if we prepend our messages to the node object with `stdin`, it will simply be passed to the STDIN of the underlying JavaScript code.

I find this a really neat move of the developers of `[node.script]`, because it ultimately helps loosen the coupling between Max and the JavaScript code, meaning you can take any project that accepts input at STDIN and outputs at STDOUT/STDERR and plug it into Max.

The way we obtain the output is via the right outlet of `[node.script]`, where it says "Dump out: stdout and stderr". So if we patch a `[route]` object in sequence, we get the REPLs output here. Fine!

## Piping the Output into a `[textedit]`

Now let's take this a step further and make it more "shell-like". We can append the output to a `[textedit]` object, by formatting the output as `"append %s"` with a `[sprintf]` object. If we connect that to the `[textedit]`, we can already see the output coming in, only that there is no newline appended.

To fix this, I'm going to manually trigger a newline by sending a `13` into a `[itoa]` object. I wasn't able to do it with the `[sprintf]` - if you know of a way, please reach out to me.

## Using a `[textedit]` for STDIN

Now we're going to duplicate this `[textedit]` and use it as the actual command line. If you configure it to output its text on `<Enter>` (which I did earlier in the inspector), you will get its contents prepended by "text" on the left outlet. So, `[route text]`, and on into the STDIN.

There's one more little tweak we have to make here: In order to clear its contents and reset the cursor after you've hit `<Enter>` we have to trigger a `clear` and `select` message afterwards. All right, seems to work!

## A true JS REPL

Finally, let's make the output a little more useful. We are going to exchange the simple echoing logic by a JavaScript evaluator. 

For that, we are going to write a `try/catch` block, because when a user inputs some garbage, we don't want the entire script to crash. So, on input, we call the `eval()` function, which is usually considered dangerous because it will readily execute ANY JavaScript you pass it. In our sandboxed environment here, though, it will be ok. 

When an error occurs, we'll just output that in our `catch` block, but the script will keep running. Because we haven't up till now required the `max-api`, we can just test this in the terminal! `1 + 1 = 2`, this is today's date, and here is a random float number. If we input some garbage, it tells us so but still waits for input. Great!

Back in the Max patch, we confirm that it's working there, too. I'll leave you here with your own imagination of where this can lead, what applications it might have. We'll look at another usability tweak in the next episode.

## Max Compressed Representation

```
----------begin_max5_patcher----------
1086.3oc0XssihiCD84vWgkk12XPwNW.lmVoUZ9IlYUKCwP6tCIQ1F5t2Qy+
9ZW1gNzMgjLDPZdAiq33pN0kiKmeNI.up7UtBi9J56nffeNIH.DYED3mGf2w
dccNSAKCWveob0S3otGo4upAwZjhmyWqQqy4LY8iK2qy4Z8aUbmJvtEgmhvt
0g9W+JEYv1X15uPipe8h86DElM.zLwKrhoW+nnX6CR6NAa6x4yBmhhRWXGlm
Z+kRmEdbyM6iyRfMhZE9qISr+L85PszrsbDLsMDaw54gI8rvj1NLooyRlhHN
.lr7F.SKR3YhKiFQAD.aGXg3iXPx1w0b4C7B1pbXSB8OaSYgVI9OPFIdVs3m
4usqLi2LfaWYgYe.E7Mgjg9G6JpiErU0uP3.Sab9yXvcFSR.+YRq9y3wKsoR
xq3EYHVkcncm847tjkCs5fPCADFGYGV1U4AY7voPWxZEc1znyBvEmEfQcCPH
MBEGd+.nFQhPpKBw1pRHyGZbjRH.M2RnxOZwMn9eGWoXa4eBmWlT+73Kcnza
wN9a3mnj6WPTUIMApMnefc0in+R8C7.Aa7fClT.gwQPLkPhtA3cTXyIQ+gvl
6Se7z4gPKAj4z6AetqM.kNyLZG3R4k6GnUmc3P4974Q9deHgcwtGM9mhY.rn
XX0KCl6yEUoK.F9EjaPwxJPq7iAtCB9KGDJwJQtP+VSyqbyFE2aWvYMgMLj7
x0Oyyxjrsp0xx77lYxqyEqeV+nIaY6iMk6Jmd7yuf6AG97CVs8iUIqJklztl
RZ3tSGr6dtuaHhqXxejZXqd7iEq0U1Ew6lsqrvzAfblwOazAdDOOx3QDU1Rs
xpgk3kL3dti.hD5RvSjdKno6DjLodXnLZnnjjbBJiueG9VXxim4QpgOI+KJt
7.WN6IE5uewZnHxvuZE42idIhBcVQ5rE4ZOohcfm8fQilM5AlVKEqLGDn7dA
uaH.y1qKcQw2qTBvY7MmTvF.9B.C3iRp1cp.vkbLD3hA0QBvXw4hhOdgd.vV
4mFdTk6kqq8kdVYz6PNiqzhBlVTVzXMD2ZNaBPe0SxcROQ2I8P6ihr2Jtwh1
IxpJM8d4CU1CtSr81CDLDpqQ+FShchRq++XXxjqyjMjg2USl1Cu77KYwNSgN
GNMKIwZ8vjq0vB6S3mNBIZ1692cFczEiZFNN6G8XNP3Gm.wqOLiVKKYTBb1K
z2sUubL7O8hAawXootper2J750T5.h4Wmlhu5rKZTr6SpkzLe5zYic1Uup95
iUWSdsHpIUlelqyuZZZ6ri61wNuI2df7gL72a5+5TcORlSurGjB9kD2WfK0w
7exLp+h4K.eMLaz8f8olLraGnqQJVUkoQTk+0AkZ5n8oRX4KlBSEEku2BGVx
sWXzsd3J6Xlzzoo1zc3doqytWSceoHr89axh8BOpMvch8BhltksWgRUwbHCZ
pdxul7+.z2t8P
-----------end_max5_patcher-----------
```