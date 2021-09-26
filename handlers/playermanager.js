
const {
  MessageEmbed
} = require("discord.js");
const Discord = require("discord.js")
const emoji = require("../botconfig/emojis.json")
const config = require("../botconfig/config.json")
const ee = require("../botconfig/embed.json")
module.exports = async (client, interaction, args, type) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!interaction.guild) return;
  //just visual for the console

    let {
    channel
  } = interaction.member.voice;
  const permissions = channel.permissionsFor(client.user);

  if (!permissions.has(Discord.Permissions.FLAGS.CONNECT)) {
    const ifk = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} I need permissions to join your channel`)
    return interaction.reply({embeds: [ifk], ephemeral: true})
  }
  if (!permissions.has(Discord.Permissions.FLAGS.SPEAK)) {
    const tt = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} I need permissions to speak in your channel`)
    return interaction.reply({embeds: [tt], ephemeral: true})
  }

  if (method[0] === "song")
    require("./playermanagers/song")(client, interaction, args, type); 
  else if (method[0] === "playlist")
    require("./playermanagers/playlist")(client, interaction, args, type);
  else if (method[0] === "similar")
    require("./playermanagers/similar")(client, interaction, args, type);
  else if (method[0] === "search")
    require("./playermanagers/search")(client, interaction, args, type);
  else if(method[0] === "playtop")
    require("./playermanagers/playtop")(client, interaction, args, type);
  else if (method[0] === "skiptrack")
  require("./playermanagers/skiptrack")(client, interaction, args, type); 
  else {
    const f = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setTitle(`${emoji.msg.ERROR} No valid search Term? ... Please Contact: \`CrazyBotBoy#5694\``)
    return interaction.send({embeds: [f]});
  }
}