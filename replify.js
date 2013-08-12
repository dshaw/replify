/*!
 * replify
 * Copyright(c) 2012-2013 Daniel D. Shaw, http://dshaw.com
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var fs = require('fs')
  , net = require('net')
  , repl = require('repl')

/**
 * Exports - replify
 */

module.exports = function replify (options, app, contexts) {
  options = (options && options.name) ? options : { name: options }

  options.app       || (options.app = app)
  options.columns   || (options.columns = 132)
  options.contexts  || (options.contexts = (typeof contexts === 'object') ? contexts : {})
  options.extension || (options.extension = '.sock')
  options.logger    || (options.logger = console)
  options.name      || (options.name = 'replify')
  options.path      || (options.path = '/tmp/repl')
  options.start     || (options.start = repl.start)

  options.replPath = options.path + '/' + options.name + options.extension

  var logger = options.logger


  fs.mkdir(options.path, function (err) {
    if (err && err.code !== 'EEXIST') {
      return logger.error('error making repl directory: ' + replDir, err)
    }

    fs.unlink(replPath, function () {
      // NOTE: Intentionally not listening for any errors.

      var replServer = net.createServer()

      replServer.on('connection', function onRequest(socket) {
        var rep = null
          , replOptions = {
                prompt: options.name + '> '
              , input: socket
              , output: socket
              , terminal: true
              , useGlobal: false
            }

        // Set screen width. Especially useful for autocomplete.
        // Since we expose the socket context, we can view
        // You can modify this locally in your repl with `socket.columns`.
        socket.columns = options.columns

        // start the repl instance
        if (typeof fs.exists === 'undefined') { // We're in node v0.6. Start legacy repl.

          logger.warn('starting legacy repl')
          rep = repl.start(replOptions.prompt, socket)

        } else {

          rep = options.start(replOptions)
          rep.on('exit', socket.end)
          rep.on('error', function (err) {
            logger.error('repl error', err)
          })

        }

        // expose the socket itself to the repl
        rep.context.replify = options

        // expose the socket itself to the repl
        rep.context.socket = socket

        if (options.app) {
          rep.context.app = options.app
        }

        Object.keys(options.contexts).forEach(function (key) {
          if (rep.context[key]) {
            // don't pave over existing contexts
            logger.warn('unable to register context: ' + key)
          } else {
            rep.context[key] = ctx[key]
          }
        })
      })

      replServer.on('error', function (err) {
        logger.error('repl server error', err)
      })

      replServer.listen(replPath)
    })
  })
}
