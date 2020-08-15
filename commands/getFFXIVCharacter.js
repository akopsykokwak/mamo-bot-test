const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const image = new MessageEmbed();

module.exports.run = (client, message, args, db) => {
    axios.get(`https://xivapi.com/character/search?name=${args[0]}+${args[1]}&server=${args[2]}`)
    .then(res => {
      const charaId = res.data.Results[0].ID;
      axios.get(`https://xivapi.com/character/${charaId}`)
      .then(res => {
        message.channel.send(`${res.data.Character.Name} :`, 
        {files: [res.data.Character.Portrait]}
        )
      })
    })
  }

module.exports.help = {
  name: 'chara',
  description: "Renvoie les infos du personnage donné",
}
