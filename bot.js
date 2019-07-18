const globals = require("./globals.js");

const pg = require('pg').Client;
const database = new pg({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

launchBot();

globals.bot.on("ready", botReady)

async function launchBot() {

  await database.connect().then(function() {
    console.log("Database connected");
  }).catch(function(err) {
    console.log("An error occured while connecting to database. " + err);
    console.log("The process cannot safely continue. Exiting...");
    process.exit(1);
  });

  await login();

}

async function login() {

  console.log("Fetching token");

  var firsttoken = process.env.localtoken;
  var secondtoken = await getToken();

  console.log("Using token to login");

  globals.bot.login(firsttoken + secondtoken).then(function() {
    console.log("Login successful")
  }).catch(function(err){
    console.log("An error occured when logging in. " + err);
    console.log("Now shutting down...");
    process.exit(1);
  });

  console.log("Removing temptoken from database");

  database.query("UPDATE keys SET temptoken = 'PLACEHOLDER'").then(function() {
    console.log("Token removed");
  }).catch(function(err) {
    console.log("An error occured when removing the token from the database. " + err);
  });

  firsttoken = "";
  secondtoken = "";

  setInterval(checkShutdown, 10000);

}

function checkShutdown() {

  database.query("SELECT shutdown FROM keys LIMIT 1").then(function(res) {
    if(res.rows[0].shutdown) {
      console.log("A shutdown was requested. Acknowleding request.")
      database.query("UPDATE keys SET shutdown = false").then(function(res) {
        console.log("Shutdown acknowledged. Shutting down...");
        process.exit(0);
      }).catch(function(err) {
        console.log("An error occured while acknowleding shutdown. " + err);
        console.log("Shutting down...");
        process.exit(1);
      });
    }
  }).catch(function(err) {
    console.log("An error occured while detecting if a shutdown is neccessary. " + err);
  });

}

async function getToken() {

  await sleep(1000);

  var token = await database.query("SELECT temptoken FROM keys LIMIT 1").then(function(res) {
    return res.rows[0].temptoken;
  }).catch(function(err) {
    console.log("An error occured when fetching token from database. " + err);
    console.log("Shutting down...");
    process.exit(1);
  });

  if(token == "PLACEHOLDER") {
    token = await getToken();
  }

  return token;

}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function botReady() {

  console.log("Bot is ready. Setting default presence");

  setBotPresence("default");

}

function setBotPresence(presenceName) {

  globals.fs.readFile(__dirname + "/presence.xml", function(err, result) {
    if(err) {
      console.log("An error occured while reading the presence file. " + err);
    }
    else {
      var selectedPresence = result.presence[precenseName];
      if(selectedPresence == null) {
        console.log("Presence " + presenceName + " could not be found. Switching to default");
      }
      else {
        bot.user.setPresence({ game: { selectedPresence.text }, status: presenceName.status).then(function() {
          console.log("Presence set to " + presenceName);
        }).catch(function(err) {
          console.log("An error occured while setting presence. " + err);
        });
        return;
      }
      selectedPresence = result.presence.default;
      if(selectedPresence == null) {
        console.log("Default presence could not be found. Presence not set");
      }
      else {
        bot.user.setPresence({ game: { selectedPresence.text }, status: presenceName.status).then(function() {
          console.log("Presence set to " + presenceName);
        }).catch(function(err) {
          console.log("An error occured while setting presence. " + err);
        });
      }
    }
  })

}
