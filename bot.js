const Discord = require("discord.js");
const Client = new Discord.Client();
const XMLHTTPRequest = require("xmlhttprequest").XMLHttpRequest;

var token = process.env.localtoken;
var request = new XMLHTTPRequest();
request.addEventListener("readystatechange", function() {
    if(request.readyState == request.DONE) {
        token += request.responseText;
        console.lot(token);
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
