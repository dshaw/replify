var fs = require('fs')
  , http = require('http')
  , net = require('net')
  , replify = require('../')
  , tap = require('tap')
  , test = tap.test

/**
 * Support
 */


function connect(name) {
  return net.connect({ path: '/tmp/repl/' + name + '.sock' })  
}

function sendMsg(socket, msg, cb) {
  var data = ''
  socket.on('data', function (buf) { data += buf.toString() })
  socket.on('end', function () { cb(data) })

  socket.write(msg);
  socket.end();
}


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
  t.on('end', app.close.bind(app))

  app.listen(9999, function onListening () {
    // need to give it a couple ticks to setup
    setTimeout(function () {
      t.ok(fs.statSync('/tmp/repl/net-test.sock'), 'repl file exists')
      t.end()
    }, 250)
  })

  replify('net-test', app)

})

test('replify has app in context', function (t) {
  
  var app = http.createServer()
  t.on('end', app.close.bind(app))

  app.listen(9999, function onListening () {
    setTimeout(function () {
      var socket = connect('net-test')
      socket.on('connect', function () {
        sendMsg(socket, 'app.getConnections\n', function (res) {
          t.similar(res, /app.getConnections\r\n\[Function\]/, 'can access app.domain properties')
          t.end()
        })
      })
    }, 250)
  })
  replify({ name: 'net-test', useColors: false }, app)
})

test('replify accepts custom context as last param', function (t) {
  
  var app = http.createServer()
  t.on('end', app.close.bind(app))

  app.listen(9999, function onlistening () {
    setTimeout(function () {
      var socket = connect('net-test')
      socket.on('connect', function () {
        sendMsg(socket, 'node\n', function (res) {
          t.ok(/up/.test(res), 'can access properties in custom context')
          t.end()
        })
      })
    }, 250)
  })
  replify({ name: 'net-test', usecolors: false }, app, { node: 'up' })
})

test('replify accepts custom context as options property', function (t) {
  
  var app = http.createServer()
  t.on('end', app.close.bind(app))

  app.listen(9999, function onlistening () {
    setTimeout(function () {
      var socket = connect('net-test')
      socket.on('connect', function () {
        sendMsg(socket, 'node\n', function (res) {
          t.ok(/up/.test(res), 'can access properties in custom context')
          t.end()
        })
      })
    }, 250)
  })
  replify({ name: 'net-test', usecolors: false, contexts: { node: 'up' } }, app)
})
