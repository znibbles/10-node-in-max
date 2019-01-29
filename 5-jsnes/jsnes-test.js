const fs = require('fs');
const jsnes = require('jsnes');
const maxApi = require('max-api');

const SCREEN_WIDTH = 128;
const SCREEN_HEIGHT = 120;
const FRAMEBUFFER_SIZE = SCREEN_WIDTH*SCREEN_HEIGHT;

let framebuffer_red = new Uint8ClampedArray(FRAMEBUFFER_SIZE);
let framebuffer_green = new Uint8ClampedArray(FRAMEBUFFER_SIZE);
let framebuffer_blue = new Uint8ClampedArray(FRAMEBUFFER_SIZE);
let nes;

const main = () => {
  nes = new jsnes.NES({
    onFrame: function(framebuffer_24) {
      for(let i = 0; i < FRAMEBUFFER_SIZE; i++) {
        framebuffer_red[i] = 0xFF0000 & framebuffer_24[i];
        framebuffer_green[i] = 0x00FF00 & framebuffer_24[i];
        framebuffer_blue[i] = 0x0000FF & framebuffer_24[i];
      }

      //maxApi.outlet('matrix', framebuffer_out);
      maxApi.outlet('red', [...framebuffer_red]);
      maxApi.outlet('green', [...framebuffer_green]);
      maxApi.outlet('blue', [...framebuffer_blue]);
    },
    onAudioSample: function(left, right) {
      // ... play audio sample
    }
  });

  const romData = fs.readFileSync('./pong.nes', {encoding: 'binary'});
  nes.loadROM(romData);
  maxApi.post('successfully loaded ROM data');
};

main();

maxApi.addHandler('bang', () => {
  nes.frame();
});

