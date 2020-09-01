const { MessageEmbed } = require("discord.js");
const { errorMessage } = require('../messages');

module.exports.run = async (client, message, args, db) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(errorMessage).catch(console.error);
    // if (!canModifyQueue(message.member)) return;

    const resumeMessage = new MessageEmbed()
    .setColor('#f0a607')
    .setDescription(`🎶 ▶ Ouf ! La chansona repris. `)  

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(resumeMessage).catch(console.error);
    }
    const noResumeMessage = new MessageEmbed()
    .setColor('#d12424')
    .setDescription(`🚫 Il n'y a aucune chanson en pause.`)  

    return message.channel.send(noResumeMessage).catch(console.error);
};

module.exports.help = {
  name: "resume",
  category: '🎶 Musique',
  description: "Reprend la musique en cours",
  usage: "!resume"
}