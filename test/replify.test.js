var fs = require('fs')
  , http = require('http')
  , replify = require('../')
  , tap = require('tap')
  , test = tap.test

/**
 * Cleanup
 */

tap.on('end', function () {
  // cleanup
  try {
    fs.unlinkSync('/tmp/repl/net-test.sock')
  } catch (err) {}

  process.exit()
})

/**
 * Tests
 */

test('replify', function (t) {

  var app = http.createServer()

  app.listen(9999, function onListening () {
    // need to give it a couple ticks to setup
    setTimeout(function () {
      t.ok(fs.statSync('/tmp/repl/net-test.sock'), 'repl file exists')
      t.end()
    }, 250)
  })

  replify('net-test', app)

})
