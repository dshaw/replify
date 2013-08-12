var replify = require('../')
  , app = require('http').createServer()

replify('realtime-101', app)

app.on('request', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('Hello, replify!\n')
})

app.listen(8080)
