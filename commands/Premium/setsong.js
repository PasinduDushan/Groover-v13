const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');  
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `setsong`,
  aliases: [`ss`],
  perms: [ `SEND_MESSAGES` ],
  botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
  category: `Premium`,
  description: `Saves song link in database, so whenever bot restarts, bot will automatically join saved vc and play this song!`,
  usage: `setvc`,
  run: async (client, message, args, guildData, player, prefix) => {
      

    try {

      try {
        const dbl = new DBL.Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NTE3NTUyNDU5NDU0ODczNyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjEzNjk2NjgyfQ.LBYzhDF-hpKQtHiSv4Fj_66dryDXEB8yQcuxuFYH3o0", client);    
        let voted = await dbl.hasVoted(message.author.id);
        if(!voted) {
          const vote = new MessageEmbed()
          .setTitle("Error!")
          .setFooter(ee.footertext, ee.footericon)
          .setColor("RED")
          .setTimestamp()
          .setDescription(`${emoji.msg.ERROR} you must vote me [here](https://top.gg/bot/${client.user.id}/vote) to use this command\n<a:arrow:828100153650315274> [**Click Here**](https://top.gg/bot/${client.user.id}/vote)`)
          return message.channel.send({embeds: [vote]});
        }
      } catch {/** */}
      if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        return message.channel.send({content: `${emoji.msg.ERROR} You Need Manage \`Server Permission\` To Use This Command`})
      }

      if(args[0] === "off") {
        guildData.song = null;
        guildData.save()
        return message.channel.send({content: `${emoji.msg.SUCCESS} Auto Play After Restart Is Now Disabled!`})
      }

      if (!player) {
        const tt = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return message.channel.send({embeds: [tt]});
      }

      if (!player.queue.current) {
        const op = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return message.channel.send({embeds: [op]});
      }

      const tc = guildData.textChannel
      if(!tc) {
        return message.channel.send({content: `${emoji.msg.ERROR} In order to set song first set voice channel with \`${prefix}autojoin\` command`})
      }
      
      guildData.song = player.queue.current.uri
      guildData.save()

      message.channel.send({content: `${emoji.msg.SUCCESS} \`${player.queue.current.title}\` has been successfully saved in my database!`})

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