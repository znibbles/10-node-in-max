# Static D3JS

I love [d3js](https://d3js.org/) for data visualizations, I mean, who doesn't? Sometimes, though, it'd be nice to obtain an SVG without having to embed the relevant code in a website, run it in a browser and copy-paste the result. With an npm package called [`d3-node`](https://www.npmjs.com/package/d3-node), this is possible, with a few limitations.

For example, you cannot have interactive or animated graphics that way, and there are some other constraints pertaining to browser APIs that are absent in the `nodejs` environment, but we'll get to that later.

We'll wrap this in a `node.script` and use it to render PNG files to be used in a Max patch.

## Rendering Static SVG or PNGs

Let's quickly glance over the `nodejs` source code. In the `package.json` file we specify two dependencies: 

- `d3-node`, responsible for wrapping the `d3` library, and
- `svg2png` for converting the vector format SVG to a rasterized PNG version

Our `static-d3.js` is really minimalistic, but already provides some extension points, so let's go over it step by step.

First we read CSS styles from a file in our mounted `data` folder. By default, it should be called `style.css`, but you can change this by calling the `style` handler up here from the Max patch.

This `styles` text is then passed to the `D3Node` constructor. Next we provide margin, width and height parameters, which we'll use to create an `svg` root node here. We then pass the `d3` object, the created `svg`, and an object containing options (`width`, `height`, and `margin`) to the main graphics generating script, which also has to be specified at runtime as the handler's parameter.

Last we render a PNG file of the specified dimensions, and send the absolute path as a message to the Max object's outlet.

## Differences to Browser-Rendered D3

Let's look at the D3 rendering script for a moment. I basically copy-pasted this from Mike Bostock's [Grouped Bar Chart](https://bl.ocks.org/mbostock/3887051) example. There is one significant difference though, which shall not be dismissed here.

The client-side implementation uses `d3.csv`, which employs the browser's `fetch` API to fetch and provide the data in the CSV file. Since `nodejs` has no implementation of that API, we cannot use that here. You could try to polyfill that, but since the polyfills only support absolute URLs, that, too, was not an option.

But what, in contrast to a browser, you _can_ do is ask the filesystem to simply provide that CSV string, with a call to `readFileSync`, and afterwards `d3.csvParse`. For the rest of the script, please refer to the D3 documentation.


## Demo

To get started, we first need to call `script npm install` to install the dependencies. Our NPM status shows green, so that should have worked. It may take some time the first time to do this, because the `svg2png` package compiles some native code. 

Next we send the `script start` message. In the debug tool, we see that the process was indeed started.

We click on `d3 groupchart.js`, thus specifying the filename of the input script. It takes some time to render the PNG image from the actual SVG output, but here it is, painted to a video plane. I've set the `erase_color` attribute of the scene to white, because the PNG actually contains an alpha channel rendering the background transparent, so if we left the background gray, we wouldn't be able to see that much.

Anyways, a convenient way to generate beautiful infographics and use them in your installation/performance or whatever on the fly. With a few tweaks, we could even go on and supply some "real time" data.