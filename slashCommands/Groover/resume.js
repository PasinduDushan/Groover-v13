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
  name: "resume", //the command name for the Slash Command
  description: "Resume currently paused song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
        //if its playing then return error
      if (player.playing) {
        const ppp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} The song is already resumed!\n\nYou can pause it with: \`${prefix}pause\``)
        return interaction.reply({embeds: [ppp], ephemeral: true})
      }
      //pause the player
      player.pause(false);
      //send success message
      const ttt = new MessageEmbed()
      .setTitle(`${player.playing ? `${emoji.msg.playing} Resumed` : `${emoji.msg.pause} Paused`} the Player.`)
      .setColor(ee.color)
      try { ttt.addField(`${emoji.msg.time} Progress: `, createBar(player)) } catch {/** */}
      return interaction.reply({embeds: [ttt]});
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