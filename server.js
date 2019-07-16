const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {

  response.writeHead(404);
  response.end();

}).listen(process.env.PORT);
