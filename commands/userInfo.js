module.exports.run = async (client, message, args, db) => {

  if (args.length !== 0) {
    message.channel.send('Erreur 🚫')
  } else {
    db.collection('users').doc(message.author.id).set({
      'id': message.author.id,
      'discordName': message.author.username
    }).then(() => {
      message.channel.send(`✨ L'utilisateur ${message.author.username} a bien été enregistré !`)
    })
  }


}

module.exports.help = {
  name: 'user',
  description: "Enregistre l'utilisateur dans la base de données",
}