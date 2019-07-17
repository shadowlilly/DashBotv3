const Discord = require("discord.js");
const bot = new Discord.Client();

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

login();

async function login() {

  var firsttoken = process.env.localtoken;
  var secondtoken = await getToken();

  console.log(secondtoken);
  bot.login(firsttoken + secondtoken);

}

async function getToken() {

  var value = await client.query("SELECT temptoken FROM keys LIMIT 1").then(function(err, res) {
    if(err) throw err;
    return res.rows[0].temptoken;
  });

  if(value == "PLACEHOLDER") {

    value = await getToken();

  }

  return value;

}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
