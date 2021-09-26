const {
  MessageEmbed
} = require(`discord.js`);
const DBL = require('@top-gg/sdk');
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "loop", //the command name for the Slash Command
  description: "Repeats the current song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
        {"StringChoices": { name: "loop_type", description: "Loop queue or the song", required: true, choices: [["Song", "bot_song"], ["Queue", "bot_queue"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      //if no args send error
      const option = interaction.options
      //if arg is somehow song / track
      if (option.getString('loop_type') === `bot_song`) {
        //Create the Embed
        let embed = new MessageEmbed()
        .setDescription(`${emoji.msg.repeat_mode} Track loop ${player.trackRepeat ? `Disabled` : `Enabled`}`)
        .setColor(interaction.guild.me.displayHexColor)
        //If Queue loop is enabled add embed info + disable it
        if (player.queueRepeat) {
          player.setQueueRepeat(false);
        }
        //toggle track repeat to the reverse old mode
        player.setTrackRepeat(!player.trackRepeat);
        //Send Success Message
        return interaction.reply({embeds: [embed]})
      }
      //if input is queue
      else if (option.getString('loop_type') === 'bot_queue') {
        //Create the Embed
        let embed = new MessageEmbed()
          .setDescription(`${emoji.msg.repeat_mode} Queue loop ${player.queueRepeat ? `Disabled` : `Enabled`}`)
          .setColor(interaction.guild.me.displayHexColor)
        //If Track loop is enabled add embed info + disable it
        if (player.trackRepeat) {
          player.setTrackRepeat(false);
        }
        //toggle queue repeat to the reverse old mode
        player.setQueueRepeat(!player.queueRepeat);
        //Send Success Message
        return interaction.reply({embeds: [embed]});
      }
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