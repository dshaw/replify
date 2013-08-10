var replpad;

try {
  replpad = require('replpad');
} catch (e) {
  console.error('For this example you need to `npm install replpad` first.')
  process.exit(1)
}

var replify = require('../')
  , app = require('http').createServer()

replify({ name: 'replpad-101', startRepl: replpad }, app)
