const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const Discord = require("discord.js");
const WebSocketClient = require("websocket").client;
const bot = new Discord.Client();
const parseXML = require('xml2js').parseString;

module.exports = {

  http: http,
  fs: fs,
  path: path,
  request: request,
  Discord: Discord,
  WebSocketClient: WebSocketClient,
  bot: bot,
  parseXML: parseXML

}
