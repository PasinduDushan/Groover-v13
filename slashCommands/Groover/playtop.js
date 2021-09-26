const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: "playtop", //the command name for the Slash Command
  description: "Adds a song with the given name/url on the top of the queue", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
        {"String": { name: "song_name", description: "What is the song you want to be played first?", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      if (!player.queue.current) {
        const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} use \`/play\` command instead of \`/playtop\` command`)
        return interaction.reply({embeds: [opop], ephemeral: true});
      }

      const song = interaction.options.getString('song_name');

      const cxxx = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setDescription(`**Searching** ${emoji.msg.search} \`${song}\``)
         await interaction.reply({embeds: [cxxx]})
      setTimeout(() => interaction.deleteReply().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)

      //play the SONG from YOUTUBE
      playermanager(client, interaction, args, `playtop:youtube`);
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