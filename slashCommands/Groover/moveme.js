const {
  MessageEmbed
} = require(`discord.js`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "moveme", //the command name for the Slash Command
  description: "Moves you to the BOT, if playing something", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false, "notsamechannel": true},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     let channel = interaction.member.voice.channel;
      let botchannel = interaction.guild.me.voice.channel;
      if(!botchannel) {
        const ifkf = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} I am connected nowhere`)
        return interaction.reply({embeds: [ifkf], ephemeral: true})
      }
      if(!channel) {
        const dd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Please Connect first`)
        return interaction.reply({embeds: [dd], ephemeral: true})
      }
      if(botchannel.userLimit >= botchannel.members.length) {
        const idkd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Channel is full, I can't move you`)
        return interaction.reply({embeds: [idkd], ephemeral: true})
      }
      if(botchannel.id == channel.id) {
        const tt = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You are already in my channel `)
        return interaction.reply({embeds: [tt], ephemeral: true})
      }
      interaction.member.voice.setChannel(botchannel);
      const ioop = new MessageEmbed()
      .setColor(interaction.guild.me.displayHexColor)
      .setDescription(`${emoji.msg.SUCCESS} moved you to: \`${botchannel.name}\``)
      return interaction.reply({embeds: [ioop], ephemeral: true});
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