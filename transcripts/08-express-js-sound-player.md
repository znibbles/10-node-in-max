## Express JS Sound Player

Let's consider a scenario where you get a bunch of audio files along with a CSV file containing metadata, for example from an automated analysis. Let's furthermore assume we want to expose a web API to start multi-track playback of these files via standard HTTP GET requests.

### A Simple Playback Server

We are going to set up our Max patch as follows: To demonstrate multi-track playback, let's just add three `[buffer~]`s with three `[wave~]` objects, along with a `[phasor~]` to trigger playback. Of course we will also need a `[node.script]` object for this.

We initialize a node project and add two dependencies: `express` itself, and `csv-parse` for parsing of CSV files.

    $ npm i -S express csv-parse

Let's create a `server.js` file and open it. First we need to set up our express server, which we do by requiring the module and instantiating an `app`. We then define an ExpressJS `route` like this:

```javascript
app.get("/sound/:id", (req, res) => {
});
```

The `":id"` part of the route denotes a _dynamic segment_, and will be replaced by whatever `id` you specify in your GET request. We'll get to that later.

### Parsing CSV Data

Now here's the trickiest part of the JavaScript part: parsing the supplied CSV file and returning the relevant row. For that we are going to use an npm package called [`csv-parse`](https://www.npmjs.com/package/csv-parse). It's used as follows: We are going to require the `parse` method and instantiate a `parser`. It receives an empty options object and a callback containing the parsed `data` as a function argument. Let's leave the function body empty for a second and `pipe` the CSV file's contents into the `parser` using `fs.createReadStream`.

What are the contents of that file, anyway? To demonstrate this, I've just listed the sound files' names in it.

Within the function body, first we make sure that we return an `OK` HTTP response to the request. We do not need to return more than that, since all we want to do is issue a command to `Max`, which we will do next. At the `[node.script]`'s outlet we are going to provide a JSON object containing the track number, which we pass to the request as a query parameter, as a key, and the row corresponding to the specified sound id. In this case this simply matches the row number, so we can call `data[req.params.id]`.

```javascript
const parser = parse({}, (_err, data) => {
  Max.outlet({ [req.query.track]: data[req.params.id] });

  res.sendStatus(200);
});

fs.createReadStream(__dirname + "/data/sounds.csv").pipe(parser);
```

Below we'll start the server and have it listen on port `5000`.

### A Little `[dict]` Exercise

In the Max patch, the created JSON object is represented as a `[dict]`. Let's just connect that and make sure things work so far. Ok, great. Now we need to come up with some custom `[dict]` logic here. With every call to our Express server, we'd like to _merge_ this `[dict]` into the already existing `[dict]`, so as to not stop playback but simply start another track. There is actually a quite simple way to do this with `[dict.join]`, but we need to add a timing tweak. If we take a look at the `[dict.join]` help patch, it says

> if two dictionaries are joined, and both contain the same key, the key in the dictionary being joined (right inlet) overrides the key for the dictionary input (left inlet)

Now this is exactly our situation: When a new sound should be played back for a certain track, we need to _override_ the key, i.e. pass the new `[dict]` in on the right hand side, and create a new `[dict]` to store the current contents of the merged `[dict]`s. That object's outlet goes into the _left (hot)_ inlet of `[dict.join]`. Now our patch is set up to _replace_ old keys with new ones while retaining the rest of the `[dict]`s contents. All we need to do now is _trigger_ the update process of `[dict.join]` with a bang to the "storage" `[dict]`, and we are going to do this with a `[t b l]`, that way we can ensure that first the new JSON object from the `[node.script]` is passed to `[dict.join]`, and only afterwards is the merge triggered. We can even delete this intermediary `[dict]` now since it is only passed as a `list`.

### Sounding Out

Okay, last but not least, we'd like to pass the sound file names to the `[buffer~]`s, and we're going to use `[dict.iter]` to iterate over the contents of our `[dict]`. Using `[route "0" "1" "2"]` (the quotes are necessary in this case), we send them to the appropriate paths in our patcher (of course, you could also use a `[poly~]` object here). I've prepared a little subpatch returning the absolute path of the soundfile, then `[prepend replace]`, and off we go. Let's open a browser and see if we get some sound output.

### Conclusion

So using some basic backend JavaScript and `[dict]` magic, we've created a versatile sound player. The obvious reason why you'd like to do something like that is that you can plug any frontend that speaks HTTP to this, be it a HTML website, a command line tool, another web service, or whatever.

### Max Representation

```
----------begin_max5_patcher----------
2392.3oc6bszjiSCD9bleEtLWCAK42vE3NPUTbbWpTJwJIZwwxksRlYgB9si
dX6Xm3GJLZxrE3CiSrjsZ80pU+Rcl+7oE1anufKss9VqOXsXwe9zhExlDMrn
59E1GQurMEUJeL6L7yzMexdopKF9ElrYl0Fqz5VyNcjdhkhYxWAV0ppI1myw
J5YuAks2dokss0uU8HjD4fwIvWCBpGsbDa6AR190E3sL0q5GuxYoEvGH9.Fu
xmeEtxoYb3S.RVM8Ah19qmdRbY4qCkoTThZV2GPAiBz9.o2HXLH.JQmii3C+
H4MOBPlag1TRSOwvqKomxRVymbGtSD2+RJXD35F5JPnmq7Cf5iQva6QBWTgx
JXtvdGIEeFWTRnYsd5E1n77VMun0qH3MehJGnnkMMQxTMAZZp.elb8vxG2BN
dXbvbpPxBreIndsULLzDbQ1IRyBkbUpZJIWOxPGwk4nspWVrrU2cKABkTuGH
T7QfmTtvKx4BKhufuOkt82wRdtScizbbFIKu.WhyXHV0juo6D7NzoT15czLV
I4OjSAfP1qm92UME6sSAHjy+enffRaPv9BRBMSLI5rTHZtlbefuWVsitMXjO
QFJumWlKNw4KCzYIGjmJ2fJDqTaRwsTBwEyozztc07do3crptyIYYWwEYz7g
6rfr+vHu6FJuyiiM1xdJWeJS06ZtPAacI5bWtMCklVsqs6v+BJibDwvLhZIf
q0ntSbFhCzCkaKnoocvqpmy8zSBWHeK9YRBeiufPsEF3ONIuVHxtYUNgrGWx
51FCsuraKkrOqX5sZ5zlpMwqY3i4obTz8A5Xhp8N11525z9X545pqqvph1sz
wMrdtIz0ci1cu1iXelwjagAJM7gwWqw6VsdN0sK0zWoGw7bksziaHY317Fqu
IAwPeikzhfP6p02y3B864JSsfCy3fix3VNByyMPOlG2Pgv5eHXZtm6ig6Ua8
7sPjx0UOtRnTcZX3zLEfAYJxQ036hlRP.FH8MRYOzs45H6hZ0AWT+H2pXGMN
xIPVB9ESyeTfdXFjy.bfPsVzg9g5xA.uVNvEizobEECncVNSE82OqgqJoXa8
xe8JsU2YM2bCij03yxGtnavBZ8aZszb2yBu6YV37FMKb0lW39VNKb0bVHDQG
XVT0XsCu1BmZRVqbfaMhwshrgqrr7ZO3uKGM3d8tAkVYtpwMzd7C4oKStuzC
VxYjfkfff4fklCVZNXo4fklCVZNXo4fklCVZNXo4fklCVZNXoujCV5YNZ9ak
UQ3cFiTIYeF2M49hTJHdrSJTc5f9gR0dQAiGnj6aBVAFDqQSeDZugXcWJkOF
0SgNw.4V61qHNPxQ9Swa8qgPGemK8fdotmtcz+AFuiVvcSWzRPKJ1afS86uT
2ycMGUveUF20Yku7sLhzw.h+XAd6I4vddBgpHkGCtOhyj8.pjV72Sv46W95N
XZiI4ENMaQI3EDONaA9ufsjRNiWsGQxZXAmQWzccauc4D9Sf2ks+l3OtbNWv
aoXjEZOGSBplKKhAc6ADOdzzs7M8r1RWzBR6jI.5g65Oc1dBfR+Tg.Iy1KbP
9aGaGMFMFw7wYT5ILc2sY44BfOxIfbGc3k3aa2OWwv9gWOtZnPxk5fdGnxCz
BlliT8JYeiyoLBqI.ZumZan8ekIM7ejf1Nf7UOZQBb0XAMVUxC90WM29koMJ
4XPiRfow5i2.bdANGmkXw+HUjHNCjS1.mQs9BEFE7TAWG6+3pWGyCT+XMR97
+I.ZzjUY1iGmaNsaGtXbGkGrn5ZLcMXQm4GNsTruiDtQwuOfFXdPGngNp2WP
6XdP6Ooz8iGyuYmXlmF6kmOvr4CLa9.ylOvr4CLa9.ylOvr4CLa9.ylOvr4C
La9.y9B8.yJ6wAhoy8n2X4dLDn1AKO1.qHf4i6iGqQIZO91.+LTbdvXM9Uy4
J0Z6BGGdFL0prCjx5vEuu33G7m.ILPCfpNyufP8Bns1meNY+peVP3NSaK6uS
b4q9EwUbVhpE0VLyvkJ3nGa8QamOZyuBjWgezteNl2nbrkiv4hmLS.tJGhim
P92ybPOgrkshGEegQ1CLM.AQ0GSzCJwNB.dmKjhWgqBFU74IWRgSmKKnLuBB
+UF82CL79LUfOt4p3oG4fj6bNWn77ltMtog2Xt8X+xjAJWA+eG6d0mnjr6b2
aKdduU4+zajgApTwEadSYCYoV4ajUIilaBkUicdC.tBJ+Z+PB7LOF2bkQ4yD
7yxzyQRIrO2AL61UhqlVRVdqfbrUI9Lof6qWSBspc8ZaJY6uyNvsss+P61uI
2Xc637scrYuHYtcZgVjnR.83E4QiaoYdGWcjlQXzhUbFQNhYe2+aIXzyJwEb
wwQOUxkfPmGgCjMhknBlIjKcmbu2amX4.pYx3K+qpwIt3LtX0mJMk+jfo+Op
ATBX.vWe2I0PmN5DipV0tJ49cjrWHQ+5MjL0QB0IHqr7iCzyyBvLfRe4ruaR
DTKNWGpZ0RzMgnF2NB0ghNM5Rzo2HEbODBNAgD++yvHDBLEgbL.gB0f0YB.E
nyZjn9pZ8PMJUAOHRCtkzNuNRG89g5n2OTqiP0UqJGII4b+1XUZ.TYzOnx20
pBwpyc9UkQqabycuO3HRab3p7Qr6cU3vMRUQG8iCvC.G.swAzAzBGU2UgCHz
eDb.ec3vWGb3ZBsU9Zn+URIvqkRf2OMDf2OMDNZPZ+PCrR5qixe+.SPIcT35
6a.J4oEkLg+NdZsiyDqSdZPHXrAHj6CxgGnNBdPSH3IGjoTV4YB0hPcDGDIK
oOMFuNkUPOcI8qFjZPnQ8cIHRXAzUkr+V27JmW.cVlglP+BHPGQWOSPIntTB
LN2FpJ7WfmJI.ctCDoJmv3nl6Ls8L8vwzBMvH+KBMxaL89HfVF8MQjk.srwa
BU5.cbVyPzYRUP2RHU5MtppSEz3ppM8pJM81pLc3JL85pKUdP6pBs6pTpbo9
LOkPn+prJIW+S3rSpL0TWKmc4Da1uijltklRuoHaqynksp2lBZs9YEIoEF6A
.QhL05BbCgAxuw+hueq0sp2AT+Rd9dwNPwi5E.C87keKB5561IkuUuF7Bsb.
wJJ3DG43o9FuI.mVseMT19ppBs0uUJ67BZNsno7XW4FurU1w1WfRHU0IS27X
srRPpf26002n8QNCkT+NsE7ZVLXn7w3+sKrVtb1OhXTqeTTsoMm568Pek73.
kb7S+0S+CMzCvkB
-----------end_max5_patcher-----------
```
