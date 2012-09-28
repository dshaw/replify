# Replify

Easily add a REPL to your Node.js app.


## Status

![Travis Build Status](https://secure.travis-ci.org/dshaw/replify.png)

## Install

	npm install replify
	
## Usage

    var replify = require('replify')
      , app = require('http').createServer()

    replify('realtime-101', app)

Advanced options.    

    replify({ name: 'realtime-101', path: '/dshaw/repl' }, app, { 'other_context': io })

## Options

`name` [String] - Name for the REPL domain socket. The REPL will be exposed as `/tmp/repl/{name}.sock`

`path` [String] - Default: **/tmp/repl**. The REPL will be located at `{path}/{name}.sock`

`logger` [Object] - Default: **console**.

## License

(The MIT License)

Copyright (c) 2012 Daniel D. Shaw, http://dshaw.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.