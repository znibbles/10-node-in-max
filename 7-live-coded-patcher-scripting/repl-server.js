const readline = require('readline');
const path = require('path');
const childProcess = require('child_process');
const Max = require('max-api');
const util = require('util');
const fs = require('fs');

const exec = util.promisify(childProcess.exec);
const writeFile = util.promisify(fs.writeFile);

const myHistory = [];
let historyPos = -1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const makePatcher = async (patcherName, patch) => {
  const output = await exec(`maxy-gen g '${patch}-outlet'`);
  return await writeFile(`${patcherName}.maxpat`, output.stdout);
};

rl.prompt();

rl.on('line', (line) => {
  myHistory.unshift(line);

  try {
    [patcherName, patch] = line.trim().split(' ');
    Max.post(patch);
    process.env["PATH"] += `${path.delimiter}/Users/jrubisch/.rbenv/shims`;
    makePatcher(patcherName, patch).then(() => { Max.outlet(`script sendbox ${patcherName} replace ${patcherName}.maxpat`); });
    console.log(`reloaded ${patcherName}`);

  } catch(e) {
    console.log(e);
  }

  historyPos = -1;
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

Max.addHandler('history_up', () => {
  historyPos = historyPos < myHistory.length - 1 ? historyPos + 1 : myHistory.length - 1;
  console.error(`history ${myHistory[historyPos]}`);
});

Max.addHandler('history_down', () => {
  historyPos = historyPos > 0 ? historyPos - 1 : 0;
  console.error(`history ${myHistory[historyPos]}`);
});
