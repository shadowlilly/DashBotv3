const globals = require("./globals.js");

const pg = require('pg').Client;
const database = new pg({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

launchServer();

async function launchServer() {

  await database.connect().then(function() {
    console.log("Database connected");
  }).catch(function(err) {
    console.log("An error occured while connecting to database. " + err);
    console.log("The process cannot safely continue. Exiting...");
    process.exit(1);
  });

  const server = globals.http.createServer(respond404).listen(process.env.PORT);

  console.log("Now listening for HTTP requests");

  const socket = new globals.WebSocketClient();

  console.log("Now attempting to establish a WebSocket connection");

  socket.connect("wss://dashbotauth.herokuapp.com", "dbcp_key-" + process.env.socketkey);

  socket.on("error", function(err) {
    console.log("An error occured with the websocket. " + err);
  })

  socket.on('connectFailed', function(err) {
      console.log("Connection to the websocket failed. " + err);
  });

  socket.on('connect', function(connection) {

    console.log("Successfully connected to WebSocket");
    setInterval(keepAlive, 300000);

    connection.on('error', function(err) {
        console.log("Connection Error: " + err);
    });

    connection.on('close', function() {
        console.log("The server has shut down the connection. Sending shutdown signal to bot");
        database.query("UPDATE keys SET shutdown = true").then(function(res) {
          console.log("Bot has been given the shutdown signal. Shutting down web client...")
          process.exit(0);
        }).catch(function(err) {
          console.log("An error occured signaling shutdown to bot. " + err);
          console.log("Shutting down web client...");
          process.exit(1);
        })
    });

    connection.on('message', function(message) {
        if(message.utf8Data.startsWith("TOKEN IS ")) {
          console.log("The token has been receieved. Sending to bot.");
          database.query("UPDATE keys SET temptoken = " + message.utf8Data.substring(9)).then(function() {
            console.log("The token has been sent to the bot");
          }).catch(function(err) {
            console.log("An error occured when forwarding the token. " + err);
          });
        }
    });

  });

}

function keepAlive() {

  console.log("Sending a Keep-Alive request")

  globals.request('http://dashbotauth.herokuapp.com', function (err, response, body) {
    if(err) {
      console.log("An error occured when attempted to send a keep-alive request. " + err);
    }
    else {
      console.log("Request send successfully.")
    }
  });

}

function respond404(request, response) {

  response.writeHead(404);
  response.end();

}
