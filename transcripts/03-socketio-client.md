## Socket.io Client

A neat fact about `node.script` is that it gives us access to a bunch of Web APIs that are easy to implement using `nodejs`. The official Node4Max examples include one about creating and running a WebSocket server; I'm going to show you the opposite, how to make Max behave like a WebSocket client. 

Of course, for testing we will need a server ourselves, so let's start by creating one. We make up a `server` folder and call `npm init` to create a `package.json` file. We then install `express` as our application server and the `socket.io` package, which provides a simple WebSockets implementation. Let's also add an `npm start` script that runs our `index.js`, which we also need to create.

In it, we start by requiring `express`, the built-in `http` module which we pass the express `app`. We need this to hook up `socket.io`, which we do next. 

To get this running, we need a root route, which we use to just serve an HTML file from our root directory. 

Now I'm going to paste in some HTML rather than typing it all from scratch. It's basically taken from the official [socket.io getting started guide](https://socket.io/get-started/chat/) and modified just a little bit for our purposes.

There's just a big black container in here, with a little form where we can type text. Let's start our server and take a look. Here it is, pretty straightforward.

## Serving Up Sockets

Next we need to actually create our WebSocket connection. This is done simply by implementing the `connection` event listener of the `io` object. For the moment, let's just spit out a log message when a new client connects. 

Of course, on the client we need to perform the mirrored action. We start by including the `socket.io.js` client script. One of the benefits of using this library in connection with an express server is that it automatically provides the client code at this URL. Then, after the DOM has loaded, we create a socket. That's it. Let's restart our server and see what happens. "a user connected" - hooray.

## Implementing a Client in Node4Max

We call `npm init` in our root directory and install `socket.io-client`. In a file we call equally `socketio-client.js`, we require the `maxApi`, as always, and the socket.io client library. We declare a global `socket` variable, because we are going to need it in multiple Max handlers. 

First we add a `connect` handler, which we pass a `url` parameter. We tell `io` to connect to that URL. Next we create a Max patch where we load that script, start it, and call `connect`. And voila, in the server log we see that a second user has connected.

To close the loop, let's add a `disconnect` handler. In it, we simply close the socket on the client side. And furthermore we add a `message` handler to actually send messages to the server. 

On the server, let's first listen for the `disconnect` event. We restart, connect and afterwards disconnect, and here is our message (the first `a user connected` message stems from the browser still running and connecting in the background). 

## Forwarding Messages

Alright, what do we do when a message arrives? Let's do the easiest thing possible and transmit it to all connected clients. Socket.io is capable of much more subtle ways of routing, but that's beyond the scope of this video. 

Now is also the time to focus our attention on the browser client again. When a `message` is received on the socket, we just set the `#message`'s div's `innerText` to that message. Alright, let's send a message from the Max patch, by simply prepending an integer with `message`. Woosh, it works!

## Talking Back

There's one more tweak I'd like to show you. By attaching an event listener to the button, we can send a `talkback` message from the browser. Just don't forget to empty the input box afterwards!

On the server, we need to provide a way of relaying those talkback messages, too. This time, we're calling `socket.broadcast.emit`, which means nothing else than "send to everybody but the sender". That way we can avoid unnecessary traffic. 

Back in the Node4Max javascript file, we just need to register a callback on the socket, like we have done so many times now. Basically we can choose the event string (`talkback`) quite freely, please refer to the documentation! In it we just send the message out the `node.script` object's outlet. 

Accordingly, we create a `[route]` object and look for `talkback` messages. Let's try it out, enter a message in the browser - and here it is!

If you think this through, you can leverage all the awesomeness of WebSockets, e.g. scripting patchers from one to the other, even over the web if you like, etc. Socket.io will even let you transmit binary data, maybe I'll try that out in the future. 