const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json")
const settings = require("../../botconfig/settings.json");

const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: "autoplay", //the command name for the Slash Command
  description: "Enable or disable autoplay", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      player.set(`autoplay`, !player.get(`autoplay`))
      //Send Success Message
      const embed = new MessageEmbed()
      .setDescription(`${player.get(`autoplay`) ? `${emoji.msg.enabled} Enabled` : `${emoji.msg.disabled} Disabled`} Autoplay\n\nTo ${player.get(`autoplay`) ? `disable` : `enable` } it type: \`/groover autoplay\``)
      .setColor(interaction.guild.me.displayHexColor)
      return interaction.reply({embeds: [embed]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return interaction.reply({embeds: [emesdf]});
    }
  }
}