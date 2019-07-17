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

webclient.connect("wss://dashbotauth.herokuapp.com", "DBCP");

webclient.on("error", function(error) {
  console.log(error);
})

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
      if(message.utf8Data.startsWith("TOKEN IS ")) {
        client.query("UPDATE keys SET temptoken = " + message.utf8Data.substring(9));
      }
  });
});
