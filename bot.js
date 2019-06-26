const Discord = require("discord.js");
const bot = new Discord.Client();
bot.login(process.env.temptoken);
bot.on("ready", () => {
	bot.channels.get("484808742160957442").send("It worked, bitch");
});