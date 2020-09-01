const { MessageEmbed } = require("discord.js");

module.exports.errorMessage = new MessageEmbed()
.setColor(`#d12424`)
.setDescription("🚫 Il n'y a aucune musique dans la playlist. Ajoutes-en enfin !!")