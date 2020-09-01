const ytdl = require('ytdl-core');
const { MessageEmbed, Message } = require("discord.js");

module.exports.run = async (client, message, args, db) => {
  const serverQueue = message.client.queue.get(message.guild.id);

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    const errorVoiceChannel = new MessageEmbed()
      .setColor(`#d12424`)
      .setDescription('🚫 Tu dois te trouver dans un canal pour que tu puisses écouter de la musique, baka !')
    return message.channel.send(errorVoiceChannel);
  }

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    const errorPermission = new MessageEmbed()
      .setColor(`#d12424`)
      .setDescription("🚫 Je n'ai pas les permissions pour être avec toi ou pour te parler, senpaï 🥺")

    return message.channel.send(errorPermission);
  }

  if (args.length === 0 || !args[0].includes('youtube')) {
    const errorLink = new MessageEmbed()
      .setColor(`#d12424`)
      .setDescription("🚫 Il me faut un lien youtube sinon tu ne pourras pas m'entendre susurrer dans tes oreilles...")

    return message.channel.send(errorLink)
  } else {
    try {

      const songInfo = await ytdl.getInfo(args[0]);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        message.client.queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          play(message.guild, queueContruct.songs[0], message);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        const songMessage = new MessageEmbed()
          .setColor('#f0a607')
          .setDescription(`🎶 **${song.title}** a été ajouté à la playlist !`)

        return message.channel.send(songMessage);
      }
    } catch (error) {
      console.log(error);
      return message.channel.send(`🚫 Hmmm. Il semble qu'il y ait un problème.`)
    }
  }
}

function play(guild, song, message) {
  const serverQueue = message.client.queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    message.client.queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0], message);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  const botMessage = new MessageEmbed()
    .setColor('#f0a607')
    .setDescription(`🎶 En cours de lecture : **${song.title}**`)

  serverQueue.textChannel.send(botMessage);
}


module.exports.help = {
  name: 'play',
  category: '🎶 Musique',
  description: "Streame de la musique en vocal",
  usage: "!play + lien youtube"
}