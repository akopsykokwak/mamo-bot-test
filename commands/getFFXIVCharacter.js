const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const image = new MessageEmbed();

module.exports.run = (async function (client, message, args, db) {

  if (args.length < 3) {
    message.channel.send(`Il vous manque une information.`)
  } else {
    axios.get(`https://xivapi.com/character/search?name=${args[0]}+${args[1]}&server=${args[2]}`)
      .then(res => {
        axios.get(`https://xivapi.com/character/${res.data.Results[0].ID}`)
          .then(async res => {
            const data = await res.data.Character
            const id = data.ID.toString()
            db.collection('users').doc(message.author.id).update({
              'characters': [data.Name]
            })

            db.collection('characters').doc(id).set({
              'id': data.ID,
              'name': data.Name,
              'server': data.Server,
              'portrait': data.Portrait,
              'freeCompanyId': data.FreeCompanyId,
              'userId': message.author.id
            }).then(() => {
              message.channel.send(`✨ ${data.Name} a bien été enregistré.e pour ${message.author.username} !`)
            })
          })
      })
  }
})

module.exports.help = {
  name: 'chara',
  description: "Enregistre le personnage donné",
}
