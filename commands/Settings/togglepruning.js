const {
  MessageEmbed
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "togglepruning",
  aliases: ["toggleprunning", "pruning", "prunning"],
  category: "Settings",
  description: "Toggles pruning. If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
  usage: "togglepruning",
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //set the new prefix
      guildData.pruning = !guildData.pruning
      guildData.save()

      //return success embed
      const opopo = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(`${guildData.pruning ? emoji.msg.SUCCESS : emoji.msg.ERROR} Pruning **${guildData.pruning ? `Enabled` : `Disabled`}**`)
      return message.channel.send({embeds: [opopo]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]});
    }
  }
};