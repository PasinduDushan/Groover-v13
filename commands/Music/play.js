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
  name: `play`,
  category: `Music`,
  aliases: [`p`,`bja`,`baja`],
  description: `Plays a song from youtube`,
  usage: `play <Song / URL>`,
  parameters: {"type":"music", "activeplayer": false, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
        
      try {
        if(/(open.spotify.com\/(track|playlist)\/+)/i.test(message.content)) {
          const dbl = new DBL.Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NTE3NTUyNDU5NDU0ODczNyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjEzNjk2NjgyfQ.LBYzhDF-hpKQtHiSv4Fj_66dryDXEB8yQcuxuFYH3o0", client);
          let voted = await dbl.hasVoted(message.author.id);
    
          // if(!voted) {
          //   const vote = new MessageEmbed()
          //   .setTitle("Error!")
          //   .setFooter(ee.footertext, ee.footericon)
          //   .setColor("RED")
          //   .setTimestamp()
          //   .setDescription(`${emoji.msg.ERROR} you must vote me [here](https://top.gg/bot/774642458889814066/vote) to play spotify songs\n<a:arrow:828100153650315274> [**Click Here**](https://top.gg/bot/774642458889814066/vote)`)
          //   return message.channel.send({embeds: [vote]});
          // }
        }
      } catch {/** */}


      //if no args return error
      if (!args[0]) {
        const ppp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to give me a URL or a Search term.`)
        return message.channel.send({embeds: [ppp]});
      }

      try {
        message.react(emoji.msg.SUCCESS).catch((_) => { })
        message.channel.send({ embeds:[new Discord.MessageEmbed().setTitle('✅ Song started').setColor('GREEN').setDescription(`Song requested by ${message.author.username}`)] })
      } catch {/* */}
  
      //play the SONG from YOUTUBE
      playermanager(client, message, args, `song:youtube`);

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