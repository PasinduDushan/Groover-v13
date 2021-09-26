const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "remove", //the command name for the Slash Command
  description: "Removes a track from the Queue", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
	{"Integer": { name: "song_number", description: "Song number you want to remove from the queue", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      const number = interaction.options.getInteger('song_number')
      //if the Number is not a valid Number return error
      if (isNaN(number)) {
        const tttt = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} It has to be a valid Queue Number!\n\nExample: \`/groover remove ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\``)
        return interaction.reply({embeds: [tttt], ephemeral: true})
      }
      console.log(player)
      //if the Number is too big return error
      if (Number(number) > player.queue.size) {
        const yyy = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your Song must be in the Queue!\n\nExample: \`/groover remove ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2 }\``)
        return interaction.reply({embeds: [yyy], ephemeral: true})
      }
      //remove the Song from the QUEUE
      player.queue.remove(Number(number) - 1);
      //Send Success Message
      const ppp = new MessageEmbed()
      .setDescription(`${emoji.msg.cleared} I removed the track at position: \`${Number(number)}\``)
      .setColor(interaction.guild.me.displayHexColor)
      return interaction.reply({embeds: [ppp], ephemeral: true});
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