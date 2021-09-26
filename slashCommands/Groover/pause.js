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
  name: "pause", //the command name for the Slash Command
  description: "Pause currently playing song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     //if the player is paused return error
      if (!player.playing) {
        const fff = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} The song is already paused!\n\nYou can resume it with: \`/groover resume\``)
        return interaction.reply({embeds: [fff], ephemeral: true})
      }
      //pause the player
      player.pause(true);
      //return success message
      const idkd = new MessageEmbed()
      .setTitle(`${player.playing ? `${emoji.msg.resume} Resumed` : `${emoji.msg.pause} Paused`} the Player.`)
      .setColor(interaction.guild.me.displayHexColor)
      .addField(`${emoji.msg.time} Progress: `, createBar(player))
      return interaction.reply({embeds: [idkd]});
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