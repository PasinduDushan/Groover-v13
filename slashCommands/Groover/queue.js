const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  format,
  swap_pages2
} = require(`../../handlers/functions`);
module.exports = {
  name: "queue", //the command name for the Slash Command
  description: "Shows the Queue", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
      //get the right tracks of the current tracks
      const tracks = player.queue;
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return interaction.reply({embeds: [no], ephemeral: true})
      }
      //if there are no other tracks, information
      if (!tracks.length) {
        const iii = new MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setAuthor(`${interaction.guild.name}'s Queue (${player.queue.length} Songs)`, interaction.guild.iconURL({
          dynamic: true
        }))
        .setFooter(ee.footertext, ee.footericon)
        .addField(`\`0.\` **Current Playing**`, `[${player.queue.current.title.substr(0, 60)}...](${player.queue.current.uri}) 〢 \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}`)
        .setDescription(`${emoji.msg.ERROR} No tracks in the queue`)
        return interaction.reply({embeds: [iii]})
      }
      //if not too big send queue in channel
      if (tracks.length < 10) {
        const ttt = new MessageEmbed()
        .setAuthor(`${interaction.guild.name}'s Queue (${player.queue.length} Songs)`, interaction.guild.iconURL({
          dynamic: true
        }))
        .setFooter(ee.footertext, ee.footericon)
        .addField(`\`0.\` **Current Playing**`, `[${player.queue.current.title.substr(0, 60)}...](${player.queue.current.uri}) 〢 \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}`)
        .setColor(ee.color)
        .setDescription(tracks.map((track, i) => `\`${++i}.\` [${track.title.substr(0, 60)}...](${track.uri}) 〢 \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\``).join(`\n\n`))
        return interaction.reply({embeds: [ttt]})
      }
      //get an array of quelist where 15 tracks is one index in the array
      let quelist = [];
      for (let i = 0; i < tracks.length; i += 10) {
        let songs = tracks.slice(i, i + 10);
        quelist.push(songs.map((track, index) => `\`${i + ++index}.\` [${track.title.substr(0, 60)}...](${track.uri}) 〢 \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}`).join(`\n\n`))
      }
      let limit = Math.round(quelist.length)
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`${interaction.guild.name}'s Queue (${player.queue.length} Songs)`, interaction.guild.iconURL({
            dynamic: true
          }))
          .setFooter(ee.footertext, ee.footericon)
          .setColor(interaction.guild.me.displayHexColor)
          .addField(`\`0.\` **Current Playing**`, `[${player.queue.current.title.substr(0, 60)}...](${player.queue.current.uri}) 〢 \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}`)
          .setDescription(desc));
      }
      //return susccess message
      return swap_pages2(client, interaction, embeds)
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