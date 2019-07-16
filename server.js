const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {

  if(response.url == "connect.php") {
    response.writeHead(200, { 'Content-Type': 'text/html'});
    var html =
      "<!DOCTYPE HTML>"
    + "<html>"
    + "<head>"
    + "<title>Test</title>"
    + "</head>"
    + "</html>"
    response.end(html, 'utf-8');
  }
  else {
    response.writeHead(404);
    response.end();
  }

}).listen(process.env.PORT);
