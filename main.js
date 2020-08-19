const fs = require('fs');
require('dotenv/config');

//import settings;
let prefix;
const owner = process.env.OWNER;
const token = process.env.TOKEN;

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  }), databaseURL: "https://mamo-test.firebaseio.com"
});

let db = admin.firestore();


const { Client, Collection } = require('discord.js');
const Twitter = require('twit');

const client = new Client();
client.commands = new Collection();

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const destChannelTweets = '727218105562169478';

const twitterId = 161223454;
const stream = twitterClient.stream('statuses/filter', {
  follow: '161223454',
});

stream.on('tweet', tweet => {
  console.log(tweet)
  if (tweet.user.id === twitterId && tweet.in_reply_to_user_id === null) {
    const twitterMessage = `${tweet.text}: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
    client.channels.cache.get(destChannelTweets).send(twitterMessage);
  } else return;
});


client.on('guildCreate', async guildData => {
  await db.collection('servers').doc(guildData.id).set({
    'id': guildData.id,
    'name': guildData.name,
    'owner': guildData.owner.user.username,
    'ownerId': guildData.owner.id,
    'prefix': '!'
  });
});

fs.readdir('./commands', (err, files) => {
  if (err) {
    console.log(err);
  }

  let commandFiles = files.filter(f => f.split(".").pop() === "js");

  if (commandFiles.length === 0) {
    console.log("No files found");
    return;
  }

  commandFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded`);
    client.commands.set(props.help.name, props);
  })
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  db.collection('servers').doc(msg.guild.id).get().then((q) => {
    if (q.exists) {
      prefix = q.data().prefix;
    }
  }).then(() => {
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