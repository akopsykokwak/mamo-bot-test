const { MessageEmbed } = require("discord.js");
const { findFrJob } = require('../ffxivJobs')

module.exports.run = async (client, message, args, db) => {

  if (args.length !== 0) {
    message.channel.send(`🚫 Erreur dans votre commande. Utilisez la commande !help pour connaître celles disponibles.`)
  } else {
    try {
      const userRef = db.collection('users').doc(message.author.id);
      const userRefDoc = await userRef.get();
      let characterId;
      if (!userRefDoc.exists) {
        message.channel.send("🚫 Aucun utilisateur trouvé. N'oubliez pas de vous enregistrer avec la commande !user.")
      } else {
        characterId = userRefDoc.data().characterId.toString()
      }

      const charaRef = db.collection('characters').doc(characterId);
      const charaRefDoc = await charaRef.get();
      let charaData;
      if (!charaRefDoc.exists) {
        message.channel.send("🚫 Aucun personnage trouvé pour cet utilisateur. N'oubliez pas de l'enregistrer avec la commande !chara.")
      } else {
        charaData = charaRefDoc.data()
      }

      let jobsData = [];
      const jobsRef = db.collection('characters').doc(characterId).collection('classJobs');
      const jobsDoc = await jobsRef.get();
      jobsDoc.forEach(doc => {
        jobsData.push(doc.data())
      })

      let crafters = [];
      let dps = [];
      let mages = [];
      let gatherers = [];

      const filterCategory = (category, array) => (jobsData
        .filter(job => job.Category === category)
        .map(data => array.push(data)));

      filterCategory('combattants', dps);
      filterCategory('mages', mages);
      filterCategory('récolteurs', gatherers);
      filterCategory('artisans', crafters);

      let embed = new MessageEmbed()
        .setColor('#50aed4')
        .setTitle(`✨ Jobs de ${charaData.name}`)
        .addField(`Combattants`, `${dps.map(data => `${findFrJob(data.data.UnlockedState.Name)} (*${(data.data.Level)}*)`).join('\n')}`)
        .addField(`Mages`, `${mages.map(data => `${findFrJob(data.data.UnlockedState.Name)} (*${(data.data.Level)}*)`).join('\n')}`, true)
        .addField(`Artisans`, `${crafters.map(data => `${findFrJob(data.data.UnlockedState.Name)} (*${(data.data.Level)}*)`).join('\n')}`)
        .addField(`Récolteurs`, `${gatherers.map(data => `${findFrJob(data.data.UnlockedState.Name)} (*${(data.data.Level)}*)`).join('\n')}`, true)
        .setThumbnail(charaData.avatar)

      message.channel.send(embed)

    } catch (error) {
      console.log(error)
      if (error) message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)
    }
  }
}

module.exports.help = {
  name: 'jobs',
  category: '🎮 FFXIV',
  description: "Retourne la liste des jobs du personnage",
  usage: "!jobs"
}
