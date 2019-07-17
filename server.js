const http = require('http');
const fs = require('fs');
const path = require('path');
const webClient = require("websocket").client;

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

http.createServer(function (request, response) {

  response.writeHead(404);
  response.end();

}).listen(process.env.PORT);

var webclient = new webClient();

webclient.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

webclient.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
      console.log('DBCP Connection Closed');
  });
  connection.on('message', function(message) {
      console.log("Test");
      if(message.utf8Data.startsWith("TOKEN IS ")) {
        client.query("UPDATE keys SET temptoken = " + message.utf8Data.substring(9), function(err, res){});
      }
  });
});

webclient.connect("https://dashbotauth.herokuapp.com/server.js", "");
