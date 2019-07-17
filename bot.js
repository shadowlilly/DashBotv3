const Discord = require("discord.js");
const bot = new Discord.Client();

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

var firsttoken = process.env.localtoken;
var secondtoken = "PLACEHOLDER";
(async () => {
    secondtoken = await getToken();
})();

async function getToken() {
  await sleep(1000);
  client.connect();

  client.query("SELECT temptoken FROM keys LIMIT 1", (err, res) => {
    if(err) throw err;
    console.log(res.rows[0]);
  });

}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
