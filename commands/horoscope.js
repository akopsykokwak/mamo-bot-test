const axios = require("axios");

module.exports.run = {
  execute(message, args){
    axios.get(`http://horoscope-api.herokuapp.com/horoscope/today/${args}`)
    .then(function (res) {
      message.channel.send(res.data.horoscope)
    })
  }
}

module.exports.help = {
  name: 'horoscope',
  description: "Renvoie l'horoscope d'un signe donné (en anglais)",
}