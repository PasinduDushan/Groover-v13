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
  name: "grab", //the command name for the Slash Command
  description: "Saves the current playing song to your Direct Messages", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     const emem  = new MessageEmbed()
    .setAuthor(`Saved Song`)
    .setURL(player.queue.current.uri)
    .setColor(interaction.guild.me.displayHexColor)
    .setFooter(ee.footertext, ee.footericon)
    .setTitle(`${player.playing ? `${emoji.msg.resume}` : `${emoji.msg.pause}`} **${player.queue.current.title}**`)
    .addField(`${emoji.msg.time} Duration: `, `\`${format(player.queue.current.duration)}\``, true)
    .addField(`${emoji.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
    .addField(`${emoji.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
    .addField(`${emoji.msg.playing} Play it:`, `\`/groover play ${player.queue.current.uri}\``)
    .addField(`${emoji.msg.search} Saved in:`, `<#${interaction.channel.id}>`)
    .setFooter(`Requested by: ${interaction.user.tag} | in: ${interaction.guild.name}`)

    const success = new MessageEmbed()
      .setDescription('Song sent to your DMs')
      .setColor('GREEN')
    interaction.reply({ embeds:[success] })
    client.users.cache.get(interaction.member.id).send({ embeds: [emem] }).catch(e => {
            const ememe = new MessageEmbed()
             .setColor(ee.wrongcolor)
             .setDescription(`**${emoji.msg.ERROR} Your Dm's are disabled**`)
           interaction.reply({ embeds:[ememe], ephemeral: true })
    })
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