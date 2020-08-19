const axios = require("axios");

module.exports.run = async (client, message, args, db) => {
  axios.get(`http://horoscope-api.herokuapp.com/horoscope/today/${args[0]}`)
    .then(function (res) {
      message.channel.send(res.data.horoscope)
    })
}


module.exports.help = {
  name: 'horoscope',
  description: "Renvoie l'horoscope d'un signe donné (en anglais)",
  usage: "!horoscope + signe astrologique (en anglais)"
}