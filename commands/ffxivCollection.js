const axios = require("axios");
const firebase = require('firebase');
const { MessageEmbed } = require("discord.js");

const rate = (userInt, totalInt) => {
  let result = `${Math.ceil((userInt * 100) / totalInt)}%`;
  return result;
}

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
      .setTitle(`✨ Collection de ${charaData.name}`)
      .addFields(
        charaData.mounts ? {name: `Montures`, value: `${charaData.mounts.count} sur ${charaData.mounts.total} (${rate(charaData.mounts.count, charaData.mounts.total)})`, inline: true} : {name: 'Oups', value: "Il semblerait qu'il n'y ait rien ici."},
        charaData.minions ? {name: `Mascottes`, value: `${charaData.minions.count} sur ${charaData.minions.total} (${rate(charaData.minions.count, charaData.minions.total)})`, inline: true} : {name: 'Oups', value: "Il semblerait qu'il n'y ait rien ici."},
        )
      .setThumbnail(charaData.avatar)

      message.channel.send(image)

    } catch (error) {
      if(error) message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)
    }
  }
}

module.exports.help = {
  name: 'collection',
  category: '🎮 FFXIV',
  description: "Donne un aperçu de toutes les collections du personnage",
  usage: "!collection"
}
