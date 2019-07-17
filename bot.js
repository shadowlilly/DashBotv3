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
  client.query("UPDATE keys SET temptoken = PLACEHOLDER");
  firsttoken = "";
  secondtoken = "";

}

async function getToken() {

  await sleep(1000);

  var value = await client.query("SELECT temptoken FROM keys LIMIT 1").then(function(res) {
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
