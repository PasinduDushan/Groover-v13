const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "djmode",
  category: "Info",
  aliases: ["djonlymode"],
  cooldown: 5,
  usage: "djmode",
  description: "Shows if there is a DJ-Only Mode / not and all Dj Settings..",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      //create the string of all djs and if he is a dj then set it to true

      const djonlycmds = `${guildData.djonlycmds.sort(function(a, b){if(a < b) { return -1; }if(a > b) { return 1; }  return 0;}).join(", ")}`.substr(0, 1024)
      const eme = new MessageEmbed()
      .setColor(ee.color)
      .setTitle("💢 Dj Mode")
      .setDescription("If a Command is listed here, and at least one role exists, then it means that you have to have this Role, in order to be able to use these listed Commands")
      .addField(`⚠️ Dj Only Commands active for:`, `\`\`\`${djonlycmds}\`\`\``)
      .addField("🎧 Dj Roles", `${guildData.djRoles.length > 0 ? guildData.djRoles.map((dj) => `<@&${dj}>`).join(", ") : `No DJ Roles`}`, true)
      .setFooter(ee.footertext, ee.footericon)
      message.channel.send({embeds: [eme]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]})
    }
  }
}