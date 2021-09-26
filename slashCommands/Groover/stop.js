const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json")
const settings = require("../../botconfig/settings.json");

const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: "stop", //the command name for the Slash Command
  description: "Stops the currently playing song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": false, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     if(interaction.member.voice.channel === null){
             const not_connected = new MessageEmbed()
               .setDescription('Connect to a voice channel')
               .setColor('RED')
             return interaction.reply({ embeds:[not_connected], ephemeral: true })
     }
        //if there is no current track error
      if (!player){
        if(interaction.guild.me.voice.channel) {
          const newPlayer = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true,    
          })
          newPlayer.destroy();
          const ddd = new MessageEmbed()
          .setDescription(`${emoji.msg.stop} Stopped and left your Channel`)
          .setColor('#2F3136')
          return interaction.reply({embeds: [ddd]});
        }
        else {
          const no = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
          return interaction.reply({embeds: [no], ephemeral: true})
        }
      } else {
        player.destroy();
        const ddd = new MessageEmbed()
        .setDescription(`${emoji.msg.stop} Stopped and left your Channel`)
        .setColor('#2F3136')
        interaction.reply({embeds: [ddd]});
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