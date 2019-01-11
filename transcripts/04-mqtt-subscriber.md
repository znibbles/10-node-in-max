## MQTT Subscriber

If you've never heard of MQTT, I don't blame you. It's been only a year since I was first confronted with it. But here's the clue: you probably already know most of how it works if you've ever worked with OSC. But let's take this step by step.

MQTT is short for _Message Queueing Telemetry Transport_, and is a machine-to-machine communication protocol for the transmission in environments of high latencies and flaky networks. Why is that interesting? Because MQTT is the standard protocol for IoT applications, the Internet of Things' heartbeat so to speak.

Chances are, if you have any smart home or sensor devices at home, they already transmit or offer MQTT at some endpoint, so here is an opportunity for a wide range of sensor and actor integrations which can be a great source for various artworks.

So this is how MQTT works on a basic level - it's a publication/subscription system. Client A _subscribes_ to a certain _topic_, and Client B _publishes_ that topic. Between them, a _broker_ is responsible for handling the passing of messages from publishers to subscribers. As you can already see, the message syntax is very similar to OSC.

## Using Node 4 Max to Handle MQTT

With Node4Max we have a powerful tool at hand to actually deal with such protocols and integrate them into installations or performances. Let's first `npm init` a project. Next we'll install the [`mqtt`](https://github.com/mqttjs/MQTT.js) npm module. We'll make two separate javascript files here, one named `mqtt-subscriber.js`, and one named `mqtt-publisher.js` respectively.

In the Max patch, let's load them into `[node.script]` modules and ponder how we'd like to communicate with them. First of all, we'll need to connect to a broker, which will be running on our localhost machine for testing purposes, so we'll send a `connect` message to the object. Next, let us simulate a sensor transmitting data (pool temperature) with a `[metro]` and a `[drunk]` object. So here's the thing: We're not actually setting up a sensor, we're using our Max patch to emulate one. 

As for the subscriber, we'll also need to connect it to that same broker, and then _subscribe_ to that `temperature/pool` topic.

## Starting a Broker

How do we get a broker running? Well, the easiest way is to use Docker for that purpose. From the Docker hub you can download and run the [eclipse mosquitto](https://hub.docker.com/_/eclipse-mosquitto) image like so. If you'd like to learn more about how you can leverage Docker for your projects, I've got a full course covering it over at [www.dockerforcreators.com](https://www.dockerforcreators.com). Suffice it to say here, that we're exposing port 1883 here, which is the standard MQTT port. This Docker container will then be responsible for handling subscriptions and relaying published messages to the subscribers.

## Implementing the Publisher

Now, let's start fleshing out that publisher. We import the `maxApi` as always, plus `mqtt`. We add a `connect` handler and use it to instantiate a `client`. On it, we register a listener for the `connect` event, and just for testing purposes we'll post a message to the outlet. Let's see if that works - it does, and the broker also logs out this new connection. 

Next, we add a `publish` handler for our `[node.script]` object. In it we'll just `console.log` the `topic` and `value` for now.

Ok, we have 'undefined' arriving here. Let's see. It turns out, I've misused the `$1` notation here, when what I actually need is a `[prepend]` object. Now this looks better. 

## Implementing the Subscriber

In the other file, we add a `subscript` handler and subscribe to the incoming `topic`. When a `message` arrives, we output this via the Max object's outlet.

And here's the point where I finally realize that I've done it all backwards. Of course I need to put the subscriber's code into `mqtt-subscriber.js`, and the publisher's code into `mqtt-publisher.js`.

Okay, now that that's sorted out, I need to actually cast the published message to a `string`, and do the same for the incoming message, otherwise the console will try to print the raw binary data. Now this looks correct.

Imagine we had just connected a bunch of sensors to our Max patch and can now start making interactive visuals, sonifications, or what have you. How cool is that!

## MQTT Topic Wildcards

There's just another small feature of MQTT I'd like point out. Let's say, we're actually sending the temperature of the _first_ pool, by appending a `/1` to the topic. Subscribing to our old topic now won't yield any messages, obviously. Let's verify that everything still works by using that same topic. 

MQTT allows for two types of wildcards, basically. A `#` at the end of a topic recursively subscribes to all sub-topics of that topic. A `+` in the middle of a topic will act as a wildcard for _that_ subtopic level, in our case `pool`. This subscription would also listen to `temperature/roof/1`, for example.