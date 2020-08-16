const axios = require("axios");
const firebase = require('firebase');
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, db) => {

  if (args.length !== 0) {
    message.channel.send(`🚫 Erreur dans votre commande. Utilisez la commande !help pour connaître celles disponibles.`)
  } else {
    try {
      const userRef = db.collection('users').doc(message.author.id);
      const userRefDoc = await userRef.get();
      let characterId;
      if(!userRefDoc.exists) {
        message.channel.send("🚫 Aucun utilisateur trouvé. N'oubliez pas de vous enregistrer avec la commande !user.")
      } else {
        characterId = userRefDoc.data().characterId.toString()
      }
      
      const charaRef = db.collection('characters').doc(characterId);
      const charaRefDoc = await charaRef.get();
      let charaData;
      if(!charaRefDoc.exists) {
        message.channel.send("🚫 Aucun personnage trouvé pour cet utilisateur. N'oubliez pas de l'enregistrer avec la commande !chara.")
      } else {
        charaData = charaRefDoc.data()
      }
      
      const fCRef = db.collection('characters').doc(characterId).collection('freeCompany').doc(charaData.freeCompanyId);
      const fCRefDoc = await fCRef.get();
      let fCData = fCRefDoc.data();

      const image = new MessageEmbed()
      .setColor('#50aed4')
      .setTitle(`✨ ${charaData.name}`)
      .setDescription(charaData.server)
      .addField(`♦️ ${fCData.name} (${fCData.tag})`, fCData.memberRank)
      .setImage(charaData.portrait)

      message.channel.send(image)

    } catch (error) {
      if(error) message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)
    }
  }
}

module.exports.help = {
  name: 'whoAmI',
  description: "Donne un portrait du personnage enregistré.",
}
