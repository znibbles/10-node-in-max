const express = require("express");
const fs = require("fs");
const parse = require("csv-parse");
const Max = require("max-api");

const app = express();

app.get("/sound/:id", (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );

  const parser = parse({}, (_err, data) => {
    if (Max) Max.outlet({ [req.query.track]: data[req.params.id] });

    res.sendStatus(200);
  });

  fs.createReadStream(__dirname + "/data/sounds.csv").pipe(parser);
});

app.listen(5000);
