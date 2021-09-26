const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: "nowplaying", //the command name for the Slash Command
  description: "Shows information about the current Song", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     //if no current song return error
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return interaction.reply({embeds: [no], ephemeral: true})
      }
      //Send Now playing Message
      const np = new MessageEmbed()
      .setAuthor(`Now Playing:`, interaction.user.displayAvatarURL({dynamic: true}), config.links.opmusicvote)
      .setURL(player.queue.current.uri)
      .setColor(interaction.guild.me.displayHexColor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`${player.playing ? `${emoji.msg.playing}` : `${emoji.msg.pause}`} **${player.queue.current.title}**`)
      .addField(`${emoji.msg.time} Duration: `, `\`${!player.queue.current.isStream ? `${new Date(player.queue.current.duration).toISOString().slice(11, 19)}` : '◉ LIVE'}\``, true)
      .addField(`${emoji.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
      .addField(`${emoji.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
      try { np.addField(`⌛ Progress: `, createBar(player), true) } catch {/** */}
      np.setFooter(`Command Requested by: ${interaction.user.tag}`, interaction.user.displayAvatarURL({
        dynamic: true
      }))
      return interaction.reply({embeds: [np]});
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