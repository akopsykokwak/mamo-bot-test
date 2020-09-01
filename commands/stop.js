const { MessageEmbed } = require("discord.js");
const { errorMessage } = require("../messages");

module.exports.run = async (client, message, args, db) => {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.channel.send(errorMessage).catch(console.error);
    // if (!canModifyQueue(message.member)) return;

    const stopMessage = new MessageEmbed()
    .setColor('#f0a607')
    .setDescription(`🎶 Bye bye !`)  

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(stopMessage).catch(console.error);
};

module.exports.help = {
  name: "stop",
  category: '🎶 Musique',
  description: "Arrête la musique en cours",
  usage: "!stop"
}
