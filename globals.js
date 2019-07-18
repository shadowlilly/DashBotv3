const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const Discord = require("discord.js");
const WebSocketClient = require("websocket").client;
const bot = new Discord.Client();

module.exports = {

  http: http,
  fs: fs,
  path: path,
  request: request,
  Discord: Discord,
  WebSocketClient: WebSocketClient,
  bot: bot

}
