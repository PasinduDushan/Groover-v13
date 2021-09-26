const Discord = require("discord.js"); 
const { Intents, Collection } = require("discord.js");
const colors = require("colors"); 
const fs = require("fs"); 
const settings = require(`./botconfig/settings.json`);
require('discord-reply'); 
const config = require("./botconfig/config.json");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { findOrCreateGuild } = require("./handlers/functions");

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  presence: {
    status: "online",
    activities: [{
      name: "gr!play",
      type: "LISTENING"
    }]
  },
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

require('events').EventEmitter.defaultMaxListeners = 100;
process.setMaxListeners(100);

//Each Database gets a own file and folder which is pretty handy!
client.databaseCache = {};
client.guildsData = require("./models/Guild"); // Guild mongoose model
client.databaseCache.guilds = new Discord.Collection();
client.slashCommands = new Collection();

//Loading files, with the client variable like Command Handler, Event Handler, ...
["clientvariables", "command", "events", "erelahandler", "slashCommands"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

//login into the bot
mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
  }).then(() => {
  try{
    const stringlength = 69;
    console.log("\n")
    console.log(`[DATABASE] => [CONNECTED] SUCCESSFULLY CONNECTED TO MONGODB!`.bold.cyan)
  }catch{ /* */ }
  //login to the bot
  client.login(config.token)
})

process.on('unhandledRejection', (error) => {
  //web.send(`\`\`\`${error.stack}\`\`\``)
  console.log(error);
});
process.on("uncaughtException", (err, origin) => {
  //web.send(`\`\`\`${err.stack}\`\`\``)
  console.log(err);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  //web.send(`\`\`\`${err.stack}\`\`\``)
  console.log(err);
});
process.on('beforeExit', (code) => {
  //web.send(`\`\`\`${code}\`\`\``)
  console.log('ignore that log'.grey);
});
process.on('exit', (code) => {
  //web.send(`\`\`\`${code}\`\`\``)
  console.log('ignore that log'.grey);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log('ignore that log'.grey);
});

client.on('guildCreate', async (guild) => {
  try {
    // const owner = client.users.cache.get(guild.ownerID)
    const embed = new Discord.MessageEmbed()
    .setTitle("Joined A New Server")
    .setColor("GREEN")
    .setThumbnail(guild.iconURL())
    .setDescription("Hey <@726481895961002065> Look! I've Joined A New Server")
    .addField("**Server Name**", guild.name, true)
    .addField("**Server ID**", guild.id, true)
    // .addField("**Owner**", `Tag - ${owner.tag}\nID - ${owner.id}`, true)
    .addField("**Members**", `${guild.memberCount}`, true)
    try { embed.addField("**Region**", guild.region, true) } catch {/** */}
    client.channels.cache.get("785328291438788639").send({embeds: [embed]})
  } catch (e) { console.log(e) }
});
client.on('guildCreate', async (guild) => {
  try {
    const guildData = await findOrCreateGuild(client, { id: guild.id });
    let prefix = guildData.prefix;
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    guildData.announce = true;
    guildData.save();
  
    let schannel = guild.channels.cache.find(
      channel =>
      channel.type === "text" &&
      channel.permissionsFor(guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)
    );
    const texts = "If you need help, feel free to join our support server at https://discord.gg/4x4MHGHUXC"
    const guildembed = new Discord.MessageEmbed()
    .setTitle("Thank you for adding me in your server! ❤️")
    .setColor("GREEN")
    .setDescription(`\`\`\`fix\nMy prefix here is ${prefix}\nYou can see a list of commands by typing ${prefix}help or ${prefix}commands\nYou can change my prefix using ${prefix}prefix <New Prefix>\`\`\``);
    schannel.send({content: texts, embeds: [guildembed]});
  } catch {/** */}
});
client.on('guildDelete', async (guild) => {
  try {
    if(guild.name === undefined) return;
    // const owner = client.users.cache.get(guild.ownerID)
    const embed = new Discord.MessageEmbed()
    .setTitle("Leaved A Server")
    .setColor("RED")
    .setThumbnail(guild.iconURL())
    .setDescription("Hey  <@726481895961002065> Look! Someone kicked me from their server")
    .addField("**Server Name**", guild.name, true)
    // .addField("**Owner**", `Tag - ${owner.tag}\nID - ${owner.id}`, true)
    .addField("**Members**", `${guild.memberCount}`, true)
    try { embed.addField("**Region**", guild.region, true) } catch {/** */}
  
    client.channels.cache.get("785328291438788639").send({embeds: [embed]})  
  } catch (e) { console.log(e) }
});

/*
const express = require("express");
const Topgg = require("@top-gg/sdk");

const app = express();

const webhook = new Topgg.Webhook('grooveraccess2021');

app.post("/dblwebhook", webhook.middleware(), async (req, res) => {

let senddmtime = 43200000;

//https://ptb.discord.com/api/webhooks/829366633545859152/eDG5fBirnnZzd9yn3QwhlxO2bjJkDTJ-F9ociz11C-1LYm_rmwr_0uqX8yJ0bwDCNIBw
const hook = new Discord.WebhookClient({ id: "829366633545859152", token: "eDG5fBirnnZzd9yn3QwhlxO2bjJkDTJ-F9ociz11C-1LYm_rmwr_0uqX8yJ0bwDCNIBw"})
 
const user = await client.users.fetch(req.vote.user);
if(!user) throw "DID NOT FIND USER"
    
const avatar = client.user.displayAvatarURL();
const guild = client.guilds.cache.get("764744186951761952");
const bot = "Groover#2176";
   
    const embed = new Discord.MessageEmbed()
      .setColor(guild.me.displayHexColor)
      .setThumbnail(user.displayAvatarURL())
      .setAuthor("Top.gg | Discord Bot List", "https://cdn.discordapp.com/emojis/828204283341570069.png?v=1", `https://top.gg/bot/${client.user.id}/invite/`)
      .setFooter(`Thanks for choosing  Groover!`, avatar)
      .setTimestamp()
      .setDescription(`\`${user.tag} (${user.id})\` [voted](https://top.gg/bot/${client.user.id}/vote) <@${client.user.id}>`)
      hook.send({content: `<@${user.id}> just voted me.`, embeds: [embed]})
      const dm = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTitle(`✅ Vote Confirmed!`)
      .setDescription(`Your vote for \`${bot}\` has been confirmed!\n\nYou can vote on top.gg [here](${config.links.opmusicvote}) every 12 hours!`)
      .setFooter(`Thank you for your support!`, avatar);
      try { user.send({embeds: [dm]}) } catch {/** *///}
//});

//app.listen(3000); /*