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