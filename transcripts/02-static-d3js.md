# Static D3JS

I love [d3js](https://d3js.org/) for data visualizations, I mean, who doesn't? Sometimes, though, it'd be nice to obtain an SVG without having to embed the relevant code in a website, run it in a browser and copy-paste the result. With an npm package called [`d3-node`](https://www.npmjs.com/package/d3-node), this is possible, with a few limitations.

For example, you cannot have interactive or animated graphics that way, and there are some other constraints pertaining to browser APIs that are absent in the `nodejs` environment, but we'll get to that later.

We'll wrap this in a `node.script` and use it to render PNG files to be used in a Max patch.

## Rendering Static SVG or PNGs

Let's quickly glance over the `nodejs` source code. We will make use of build-time copying of files and installing of npm modules (the `index.js` and `package.json` files), and we will use a bind mount on the `data` folder to inject a JS file that renders a graphic along with style information and the data to render.

In the `package.json` file we specify three dependencies: 

- `d3-node`, responsible for wrapping the `d3` library
- `minimist`, a minimal command line argument parser, and
- `svg2png` for converting the vector format SVG to a rasterized PNG version

Our `index.js` is really minimalistic, but already provides some extension points, so let's go over it step by step.

First we read CSS styles from a file in our mounted `data` folder. By default, it should be called `style.css`, but the `args.s` parameter denotes that we can specify a `-s` argument containing the name of such a file when invoking the command. This `args` object is provided by the `minimist` package here.

This `styles` text is then passed to the `D3Node` constructor. Next we provide margin, width and height parameters, which we'll use to create an `svg` root node here. We then pass the `d3` object, the created `svg`, and an object containing options (`width`, `height`, and `margin`) to the main graphics generating script, which can also be specified at runtime using the `-i` option.

Last we determine if the user requested an SVG, HTML or PNG output by parsing the extension of the `-o` argument. If none matches, we print the SVG string to the console.

## Differences to Browser-Rendered D3

Let's look at the D3 rendering script for a moment. I basically copy-pasted this from Mike Bostock's [Grouped Bar Chart](https://bl.ocks.org/mbostock/3887051) example. There is one significant difference though, which shall not be dismissed here.

The client-side implementation uses `d3.csv`, which employs the browser's `fetch` API to fetch and provide the data in the CSV file. Since `nodejs` has no implementation of that API, we cannot use that here. You could try to polyfill that, but since the polyfills only support absolute URLs, that, too, was not an option.

But what, in contrast to a browser, you _can_ do is ask the filesystem to simply provide that CSV string, with a call to `readFileSync`, and afterwards `d3.csvParse`. For the rest of the script, please refer to the D3 documentation.


## Demo

Let's give it a spin.

	$ docker build -t static-d3 .  
	
As mentioned, the `npm install` takes a little while. 

Now let's try out all the options. For the sake of completeness, I have included a sample `style.css` here, which is not needed by this example of a `d3` script.

	$ docker run --rm -v $PWD/data:/usr/src/app/data static-d3 -o groupchart.svg -i groupchart.js

There is our SVG!

	$ docker run --rm -v $PWD/data:/usr/src/app/data static-d3 -o groupchart.html -i groupchart.js

There is our SVG, rendered in an HTML file.

	$ docker run --rm -v $PWD/data:/usr/src/app/data static-d3 -o groupchart.png -i groupchart.js

And last but not least, here is our graphic, rendered as a rasterized PNG version.