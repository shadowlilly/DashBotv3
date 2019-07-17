const Discord = require("discord.js");
const bot = new Discord.Client();

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

var firsttoken = process.env.localtoken;
var secondtoken = "PLACEHOLDER";
(async () => {
    secondtoken = await getToken();
})();

console.log(secondtoken);

bot.login(firsttoken + secondtoken);

async function getToken() {
  await sleep(1000);

  client.query("SELECT temptoken FROM keys LIMIT 1", (err, res) => {
    if(err) throw err;
    if(res.rows[0].temptoken != "PLACEHOLDER") {
      return res.rows[0].temptoken;
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
