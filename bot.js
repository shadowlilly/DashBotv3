const Discord = require("discord.js");
const bot = new Discord.Client();

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

var firsttoken = process.env.localtoken;
var secondtoken = getToken();

console.log(secondtoken);

bot.login(firsttoken + secondtoken);

function getToken() {

  client.query("SELECT temptoken FROM keys LIMIT 1", (err, res) => {
    if(err) throw err;
    if(JSON.parse(res.rows[0].temptoken) != "PLACEHOLDER") {
      return JSON.parse(res.rows[0]).temptoken;
    }
    else {
      return getToken();
    }
  });

}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
