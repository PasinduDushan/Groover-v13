const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "invite",
  category: "Info",
  aliases: ["add", "inv"],
  cooldown: 5,
  usage: "invite",
  description: "Gives you an Invite link for Groover Bot",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      const emee = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .addField(`**__Invite Me With Admin Perms__**`, `[**Click Here**](${config.links.opmusicinv})`)
      .addField(`**__Invite Me With Normal Perms__**`, `[**Click Here**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36990048&scope=bot)\n`)
      .setTitle("SUPPORT SERVER")
      .setURL(config.links.server)
      .setTimestamp()
      .setFooter(ee.footertext, ee.footericon)
      message.channel.send({embeds: [emee]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
}