const axios = require("axios");
const XIVAPI = require('xivapi-js');
const { findFrJob } = require('../ffxivJobs');

const xiv = new XIVAPI({
  private_key: process.env.XIV_KEY,
  language: 'fr'
})

module.exports.run = (async function (client, message, args, db) {

  if (args.length < 3) {
    message.channel.send(`Il vous manque une information.`)
  } else {
    try {
    const interval = setTimeout(() => {
      message.channel.send('Veuillez patienter...')
        .catch(error => {
          console.log(error);
          clearTimeout(interval)
        })
    }, 1000)

    let task = interval;

    const searchCharacterId = async () => {
      try {
        let charaSearchId = await xiv.character.search(`${args[0]} ${args[1]}`, { server: [args[2]] });
        const charaArray = charaSearchId.Results;
        const charaData = charaArray.find(character => character.Server.includes(args[2]));

        db.collection('users').doc(message.author.id).update({
          'characterId': charaData.ID
        });

        searchCharacter(charaData.ID);
      } catch (error) {
        console.log(error)
        message.send.channel(`🚫 Aucun personnage n'a été trouvé avec ces informations.`)
      }
    }

    const searchCharacter = async id => {
      try {
        let charaSearchData = await xiv.character.get(id, {data: 'CJ'});
        const charaData = charaSearchData.Character;
        const jobsData = charaData.ClassJobs;

        db.collection('characters').doc(id.toString()).set({
          'id': charaData.ID,
          'name': charaData.Name,
          'server': charaData.Server,
          'dataCenter': charaData.DC,
          'avatar': charaData.Avatar,
          'portrait': charaData.Portrait,
          'userId': message.author.id,
          'grandCompany': charaData.GrandCompany,
          'freeCompanyId': charaData.FreeCompanyId
        });

        jobsData.map( data => {
            db.collection('characters').doc(id.toString()).collection('classJobs').doc(data.UnlockedState.Name).set(data);
        })

        searchCollection(id)
        searchFreeCompany(charaData.FreeCompanyId, id);
      } catch (error) {
        console.log(error)
        message.send.channel(`🚫 Aucun personnage n'a été trouvé avec ces informations.`)
      }
    }

    const searchCollection = async charaId => {
      try {
        axios.get(`https://ffxivcollect.com/api/characters/${charaId}`).then(res => {

          db.collection('characters').doc(charaId.toString()).update({
            mounts: res.data.mounts ? res.data.mounts : null,
            minions: res.data.minions ? res.data.minions : null,
          });

        })
      } catch (error) {
        console.log(error)
        message.send.channel(`🚫 Aucun personnage n'a été trouvé avec ces informations.`)
      }
    }

    const searchFreeCompany = async (fCId, charaId) => {
      try {
        let fCSearchData = await xiv.freecompany.get(fCId, { data: 'FCM' });
        const fCData = fCSearchData.FreeCompany;
        const memberRankFC = fCSearchData.FreeCompanyMembers.find(member => member.ID === charaId)

        db.collection('characters').doc(charaId.toString()).collection(`freeCompany`).doc(fCId).set({
          id: fCData.ID,
          estate: fCData.Estate,
          grandCompany: fCData.GrandCompany,
          name: fCData.Name,
          tag: fCData.Tag,
          rank: fCData.Rank,
          slogan: fCData.Slogan,
          memberRank: memberRankFC.Rank,
          memberRankIcon: memberRankFC.RankIcon
        }).then(() => {
          clearTimeout(task)
          message.channel.send(`✨ ${args[0]} ${args[1]} a bien été enregistré.e pour ${message.author.username} !`)
        })

      } catch (error) {
        console.log(error)
        message.send.channel(`🚫 Aucun personnage n'a été trouvé avec ces informations.`)
      }
    }

    searchCharacterId()

    } catch (error) {
      console.log(error);
      message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`);
    }
  }
})

module.exports.help = {
  name: 'chara',
  category: '🎮 FFXIV',
  description: "Enregistre le personnage donné",
  usage: "!chara + Prénom + Nom + Serveur (avec les majuscules à chaque mot)"
}
