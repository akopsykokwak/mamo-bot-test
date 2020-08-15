const fs = require('fs');
const { twitterConf } = require('./conf')
require('dotenv/config');

//import settings;
let prefix;
const owner = process.env.OWNER;
const token = process.env.TOKEN;

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


const { Client, Collection } = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.on('guildCreate', async guildData => {
  await db.collection('servers').doc(guildData.id).set({
    'id': guildData.id,
    'name': guildData.name,
    'owner': guildData.owner.user.username,
    'ownerId': guildData.owner.id,
    'prefix': '!'
  });
});

fs.readdir('./commands', (err,files) => {
  if (err) {
      console.log(err);
  }

  let commandFiles = files.filter(f => f.split(".").pop() === "js");

  if (commandFiles.length === 0){
      console.log("No files found");
      return;
  }

  commandFiles.forEach((f,i) => {
      let props = require(`./commands/${f}`);
      console.log(`${i+1}: ${f} loaded`);
      client.commands.set(props.help.name, props);
  })
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  db.collection('servers').doc(msg.guild.id).get().then((q) => {
    if(q.exists) {
      prefix = q.data().prefix;
    }
  }).then (() => {
    if (msg.channel.type === "dm") return;
    if (msg.author.bot) return;
  
    let msg_array = msg.content.split(" ");
    let command = msg_array[0];
    let args = msg_array.slice(1);
  
    if (!command.startsWith(prefix)) return;
  
    if (client.commands.get(command.slice(prefix.length))) {
      let cmd = client.commands.get(command.slice(prefix.length));
      if (cmd) {
        cmd.run(client, msg, args, db);
      }
    }
  })

});


  //bot login
  client.login(token)