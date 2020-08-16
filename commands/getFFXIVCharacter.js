const axios = require("axios");

module.exports.run = (async function (client, message, args, db) {

  if (args.length < 3) {
    message.channel.send(`Il vous manque une information.`)
  } else {
    try {
      const interval = setTimeout(() => {
        message.channel.send('Veuillez patienter...')
          .catch(err => {
            console.log(error);
            clearTimeout(interval)
          })
      }, 1000)

      let task = interval;


      axios.get(`https://xivapi.com/character/search?name=${args[0]}+${args[1]}&server=${args[2]}`)
        .then(res => {
          axios.get(`https://xivapi.com/character/${res.data.Results[0].ID}`)
            .then(async res => {
              const data = await res.data.Character
              console.log(data)
              const id = data.ID.toString()
              db.collection('users').doc(message.author.id).update({
                'characterId': data.ID
              })

              db.collection('characters').doc(id).set({
                'id': data.ID,
                'name': data.Name,
                'server': data.Server,
                'portrait': data.Portrait,
                'userId': message.author.id,
                'freeCompanyId': data.FreeCompanyId
              }).then(() => {
                axios.get(`https://xivapi.com/freecompany/${data.FreeCompanyId}?data=FCM`)
                  .then(async res => {
                    const fCData = await res.data.FreeCompany;
                    const fCMembersData = await res.data.FreeCompanyMembers;
                    const memberRankFC = fCMembersData.find(member => member.ID === data.ID)

                    db.collection('characters').doc(id).collection(`freeCompany`).doc(data.FreeCompanyId).set({
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
                      message.channel.send(`✨ ${data.Name} a bien été enregistré.e pour ${message.author.username} !`)
                    })

                  })

              })
            })
        })
    } catch (error) {
      if (error) message.channel.send(`🚫 Il y a eu une erreur pendant le processus.`)
    }
  }
})

module.exports.help = {
  name: 'chara',
  description: "Enregistre le personnage donné",
}
