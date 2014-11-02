var http    = require('http'),
    api_url = 'http://js.realtime.com',
    port    = process.argv[2];

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');

}).listen(port, '127.0.0.1');

console.log('Server running at', api_url);