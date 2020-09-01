const { MessageEmbed } = require("discord.js");
const { errorMessage } = require('../messages');

module.exports.run = async (client, message, args, db) => {
  const queue = message.client.queue.get(message.guild.id);

  if (!queue) return message.channel.send(errorMessage).catch(console.error); 
  else if (queue.songs.length === 1) return message.channel.send(errorMessage).catch(console.error);
  else {
    const nextMessage = new MessageEmbed()
      .setColor('#f0a607')
      .setDescription(`🎶 ⏭ Au tour de la prochaine musique !`)

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(nextMessage).catch(console.error);
  }

};

module.exports.help = {
  name: "next",
  category: '🎶 Musique',
  description: "Arrête la musique actuelle pour passer à la suivante",
  usage: "!next"
}