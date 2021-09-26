const {
    MessageEmbed
  } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const wait = require('util').promisify(setTimeout);
const {
    format,
    arrayMove
  } = require(`../../handlers/functions`);
module.exports = {
  name: "movebot", //the command name for the Slash Command
  description: "Moves you to the BOT, if playing something", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false, "notsamechannel": true},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     const channel = interaction.member.voice.channel;
            if(channel.id === interaction.guild.me.voice.channel.id) {
                const ttt = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} I am already in your channel`)
                return interaction.reply({embeds: [ttt], ephemeral: true})
            }

            const opop = new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${emoji.msg.SUCCESS} Joining your channel`)
            await interaction.reply({embeds: [opop], ephemeral: true})
                const tne = new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`Trying to continue the player!`)
                await wait(2000)
                await interaction.editReply({embeds: [tne]})
                await interaction.guild.me.voice.setChannel(interaction.member.voice.channel, "Resume queue in new channel");
                if(channel.type === "stage") {
                     await interaction.guild.me.voice.setSuppressed(false)
                }
                player.voiceChannel = interaction.member.voice.channel.id;
                   const rrr = new MessageEmbed()
                     .setColor(ee.color)
                     .setDescription(`${emoji.msg.SUCCESS} Successfully continued queue!`)
                 await wait(2000)
                 await interaction.editReply({embeds: [rrr]})
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