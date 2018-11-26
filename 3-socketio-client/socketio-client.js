const maxApi = require('max-api');
const io = require('socket.io-client');

let socket;

maxApi.addHandler('connect', (url) => {
  socket = io(url);

  socket.on('talkback', (msg) => {
    maxApi.outlet("talkback", msg);
  });
});

maxApi.addHandler('disconnect', () => {
  socket.close();
});

maxApi.addHandler('message', (msg) => {
  console.log(msg)
  socket.emit('message', msg);
});