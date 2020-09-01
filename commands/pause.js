const { MessageEmbed } = require("discord.js");
const { errorMessage } = require('../messages');

module.exports.run = async (client, message, args, db) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(errorMessage).catch(console.error);

  const pauseMessage = new MessageEmbed()
  .setColor('#f0a607')
  .setDescription(`🎶 ⏸ La musique est en pause ?! 😱`)

  if (queue.playing) {
    queue.playing = false;
    queue.connection.dispatcher.pause(true);
    return queue.textChannel.send(pauseMessage).catch(console.error);
  }
};

module.exports.help = {
  name: "pause",
  category: '🎶 Musique',
  description: "Met en pause la musique actuelle",
  usage: "!pause"
}