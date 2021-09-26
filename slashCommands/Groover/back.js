const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: "back", //the command name for the Slash Command
  description: "Go back to a song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": true},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try {
        const success = new MessageEmbed()
          .setDescription('Success')
          .setColor('GREEN')

        interaction.reply({ embeds: [success], ephemeral: true })
      let type = `skiptrack:youtube`;
        //if the previous was from soundcloud, then use type soundcloud
        if (player.queue.previous.uri.includes(`soundcloud`)) type = `skiptrack:soundcloud`
        //plays it
        console.log(player)
        playermanager(client, interaction, Array(player.queue.previous.uri), type);
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