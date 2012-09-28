/*!
 * replify
 * Copyright(c) 2012 Daniel D. Shaw <dshaw@dshaw.com>
 * MIT Licensed
 */

var fs = require('fs')
  , net = require('net')
  , repl = require('repl')

module.exports = function replify (options, app, ctx) {
  options = (options && options.name) ? options : { name: options }

  var name = options.name
    , repl_dir = (options.path) || '/tmp/repl'
    , repl_path = repl_dir + '/' + name + '.sock'

  if (typeof ctx !== 'object') {
    ctx = {}
  }

  fs.mkdir(repl_dir, function (err) {
    if (err && err.code !== 'EEXIST') {
      return logger.error('error making repl directory', err)
    }

    fs.unlink(repl_path, function () { // intentionally not listening for the error.
      var repl_server = net.createServer(function repl_onrequest(socket) {
        var repl_opt = {
            prompt: name + '> ',
            input: socket,
            output: socket,
            terminal: true,
            useGlobal: false
          },
          r = null

        socket.columns = 132 // Set screen width for autocomplete. You can modify this locally in your repl.

        if (fs.exists) { // if `fs.exists` exists, then it's node v0.8
          r = repl.start(repl_opt)
          r.on('exit', function () {
            socket.end()
          })
          r.on('error', function (err) {
            logger.error('repl error', err)
          })
        } else {
          r = repl.start(repl_opt.prompt, socket)
        }

        r.context.socket = socket
        if (app) {
          r.context.app = app
        }

        Object.keys(ctx).forEach(function (key) {
          // don't pave
          if (!r.context[key]) {
            r.context[key] = ctx[key]
          }
        })
      }).listen(repl_path)

      repl_server.on('error', function (err) {
        logger.error('repl server error', err)
      })
    })
  })

}
