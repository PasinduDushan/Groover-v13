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
  name: "forward", //the command name for the Slash Command
  description: "Seeks a specific amount of time in song forward", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     //get the seektime variable of the user input
      let seektime = Number(player.position) + 10000;
      //if the userinput is smaller then 0, then set the seektime to just the player.position
      if (10000 <= 0) seektime = Number(player.position);
      //if the seektime is too big, then set it 1 sec earlier
      if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
      //seek to the new Seek position
      player.seek(Number(seektime));
      //Send Success Message
      const ttt = new MessageEmbed()
      .setDescription(`${emoji.msg.forward} Forwarded the Song\n\nForwarded for \`10000 Seconds\` to: ${format(Number(player.position))}`)
      .addField(`${emoji.msg.time} Progress: `, createBar(player))
      .setColor(interaction.guild.me.displayHexColor)
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