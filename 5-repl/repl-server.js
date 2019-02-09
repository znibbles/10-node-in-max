const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.prompt();

rl.on('line', (line) => {
  try {
    console.log(eval(line.trim()));
  } catch(e) {
    console.log(e);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
