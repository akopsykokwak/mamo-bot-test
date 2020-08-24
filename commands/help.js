const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, db) => {
  fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
      console.log("No commands to load!");
      return;
    }

    let data = []
    jsfiles.map((f, i) => {
      let props = require(`./${f}`);
      data.push(props)
    })

    function compare(a, b) {
      const x = a.help.name.toUpperCase();
      const y = b.help.name.toUpperCase();
    
      let comparison = 0;
      if (x > y) {
        comparison = 1;
      } else if (x < y) {
        comparison = -1;
      }
      return comparison;
    }    

    let result = new Discord.MessageEmbed()
      .setColor('#50aed4')
      .addFields(data.sort(compare).map(prop => {
        return { name: `!${prop.help.name}`, value: prop.help.description}
      })
      );

    message.channel.send(result)
  });
}

module.exports.help = {
  name: 'help',
  description: "Renvoie une liste des commandes disponibles",
  usage: '!help'
}