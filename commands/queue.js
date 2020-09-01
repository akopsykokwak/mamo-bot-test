const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { errorMessage } = require('../messages');

module.exports.run = async (client, message, args, db) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue) return message.channel.send(errorMessage).catch(console.error);

  const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

  let queueEmbed = new MessageEmbed()
    .setTitle("🎶 Playlist")
    .setDescription(description)
    .setColor("#F8AA2A");

  const splitDescription = splitMessage(description, {
    maxLength: 2048,
    char: "\n",
    prepend: "",
    append: ""
  });

  splitDescription.forEach(async (m) => {
    queueEmbed.setDescription(m);
    message.channel.send(queueEmbed);
  });
};

module.exports.help = {
  name: "queue",
  category: '🎶 Musique',
  description: "Montre la playlist enregistré par Mamo",
  usage: "!queue"
}