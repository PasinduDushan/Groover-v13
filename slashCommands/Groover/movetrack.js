const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  format,
  arrayMove
} = require(`../../handlers/functions`);
module.exports = {
  name: "movetrack", //the command name for the Slash Command
  description: "Shows the Queue", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
        {"Integer": { name: "from", description: "Song number", required: true}},
        {"Integer": { name: "to", description: "New song number", required: true}},
  ],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      const from = interaction.options.getInteger('from')
      const to = interaction.options.getInteger('to')
      //if its not a number or too big / too small return error
      if (isNaN(from) || from <= 1 || from > player.queue.length) {
        const eoer = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your Input must be a Number greater then \`1\` and smaller then \`${player.queue.length}\``)
        return interaction.reply({embeds: [eoer], ephemeral: true})
      }
      //get the new Song
      let song = player.queue[player.queue.length - 1];
      //move the Song to the first position using my selfmade Function and save it on an array
      let QueueArray = arrayMove(player.queue, player.queue.length - 1, 0);
      //clear teh Queue
      player.queue.clear();
      //now add every old song again
      for (const track of QueueArray)
        player.queue.add(track);
      //send informational message
      const ifkf = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setDescription(`${emoji.msg.SUCCESS} Moved the Song in the Queue from Position \`${from}\` to Position: \`${to}\`\n\n[${song.title}](${song.uri}) - \`${format(song.duration)}\` - moved by **${interaction.user.tag}**`)
      return interaction.reply({embeds: [ifkf]});
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