## REPL with History

Let's consider a nice little addition to our REPL. All modern shells that are in use today provide a means of accessing the history of commands issued to it by typing the up and down arrow keys. `readline` actually does this natively, but because we are dealing with an external environment here, we have to do a little extra setup.

Let's start this exploration by finally requiring in the `max-api` module. We add two handlers called `history_up` and `history_down` to traverse our history. Let's just initialize them with an empty function for now.

The easiest way to store commands is via a simple JavaScript array that we call `myHistory` - please do find a more creative variable name. We also need a variable to store our current position in the history, and initialize it with `-1`.

## Populating the History

Whenever we enter something into our little shell, we want to add that command to the beginning of our array. That's what the `Array.unshift` method is for - it inserts entries at the beginning whereas `Array.push` would insert entries at the end.

One other thing we need to do here - whenever we enter something new, we want to reset the history position variable, because we usually want to start traversing it from the beginning again.

## Implementing the Handlers

Now in our handlers, we are going to set our `historyPos` to a new value, and output the history entry at that position. But because our history can be of any length, we need to be careful here as to not exceed the boundaries of our array. 

When pushing the up arrow key, we want to increase the position, but only until the maximum length of the array is reached, which is at `myHistory.length - 1`, because array indexes start counting at 0. And that's basically what this ternary expression does: if the current history position is smaller than the array length, increase it by 1, else just clip it at the array length.

When that is done, we hijack the `STDOUT` stream to output the command referenced by the new `historyPos` in the history array. We'll see why we do this in a second.

In the `history_down` handler, we do the opposite: We decrease the `historyPos` counter until it has reached 0. That ternary expression is much easier to write and read.

## Wire It Up in Max

Because we are sending it to the `STDERR` stream we can leave the rest of the logic totally untouched and just need to care for what comes out of this second `[route]` outlet.

And to send the handler messages to the `[node.script]` object, we take the input `[textobject]`'s second outlet and select the `30` and `31` ASCII keycodes, which are the up and down arrows keys, respectively.

Let's take a look. Let's input some commands first. When we push the up and down keys, we see the respective history entries flashing up in that message box. Great!

Let's insert two buttons here to observe when a key is pressed. Now let's turn this symbol into a list with `[fromsymbol]` and append `[route history]`. Afterwards we need to `[prepend set]` and connect back to our `[textobject]`.

So let's give this a spin. Input some commands, and we can retrieve them again by pressing the up and down arrows. This little addition to our REPL will help us out a lot in the future.