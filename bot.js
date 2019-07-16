const http = require('http');
const fs = require('fs');
const path = require('path');
const Discord = require("discord.js");
const Client = new Discord.Client();
const XMLHTTPRequest = require("xmlhttprequest").XMLHttpRequest;

http.createServer(function (request, response) {

   console.log('request starting for ');
   console.log(request);

   var filePath = '.' + request.url;
   if (filePath == './')
       filePath = './index.html';

   console.log(filePath);
   var extname = path.extname(filePath);
   var contentType = 'text/html';
   switch (extname) {
       case '.js':
           contentType = 'text/javascript';
           break;
       case '.css':
           contentType = 'text/css';
           break;
   }

   path.exists(filePath, function(exists) {

       if (exists) {
           fs.readFile(filePath, function(error, content) {
               if (error) {
                   response.writeHead(500);
                   response.end();
               }
               else {
                   response.writeHead(200, { 'Content-Type': contentType });
                   response.end(content, 'utf-8');
               }
           });
       }
       else {
           response.writeHead(404);
           response.end();
       }
   });

}).listen(process.env.PORT);

var token = process.env.localtoken;
var request = new XMLHTTPRequest();
request.addEventListener("readystatechange", function() {
    if(request.readyState == request.DONE) {
        token += request.responseText;
        Client.login(token).then(function() {
            token = "FECK OFF";
            request = null;
        });
    }
});
request.open("GET", "https://dashbotauth.herokuapp.com");
request.send();

Client.on("ready", function() {
    console.log("Success");
});
