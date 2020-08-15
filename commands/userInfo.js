module.exports.run = async (client, message, args, db) => {
    message.channel.send(`Je suis l'utilisateur ${message.author.id}: ${message.author.username} (${message.author.tag})`);
}

module.exports.help = {
  name: 'user',
  description: "Renvoie les infos d'un utilisateur",
}