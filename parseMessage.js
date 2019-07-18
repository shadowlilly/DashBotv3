function parseMessage(message) {

  if(!message.author.bot && message.channel.id == "591741482831183892") {

    message.channel.send(message.content);

  }

}

module.exports = parseMessage;
