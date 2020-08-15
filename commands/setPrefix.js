module.exports.run = async(client, message, args, db) => {

  if(args.length === 0) {
    message.channel.send('Missing prefix');
  } else if (args.length === 1) {
    let nPrefix = args[0];

    db.collection('servers').doc(message.guild.id).update({
      'prefix': nPrefix
    }).then(() => {
      message.channel.send(`[prefix updated]: new prefix ${nPrefix}`);
    })
  }
}

module.exports.help = {
  name: 'setPrefix'
}