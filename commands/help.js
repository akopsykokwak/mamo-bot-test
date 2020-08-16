const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(client, message, args, db) => {
  fs.readdir("./commands/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }
    let result = jsfiles.forEach((f, i) => {
        let props = require(`./${f}`);
        const embedMessage = new Discord.MessageEmbed()
        .setColor('#50aed4')
        .setTitle(`!${props.help.name}`)
        .setDescription(props.help.description)

        message.channel.send(embedMessage)
    });
});
}

module.exports.help = {
  name: 'help',
  description: "Renvoie une liste des commandes disponibles"
}