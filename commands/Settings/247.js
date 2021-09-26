const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);

module.exports = {
    name: `24/7`,
    aliases: [`247`, `autojoin`],
    perms: [ `SEND_MESSAGES` ],
    botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
    category: `Settings`,
    description: `Enable 24/7 mode in your server`,
    usage: `24/7`,
    memberpermissions: [`ADMINISTRATOR`],
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
                  .setDescription(`${emoji.msg.ERROR} you must vote me [here](https://top.gg/bot/765175524594548737/vote) to use this command\n[**Click Here**](https://top.gg/bot/765175524594548737/vote)`)
                  return message.channel.send({embeds: [vote]});
                }
            } catch {/** */}
        
            const memchannel = message.member.voice.channel;
            if(!memchannel) {
                const eme = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} You are not in voice channel`)
                return message.channel.send({embeds: [eme]})
            }

            guildData.ajenabled = !guildData.ajenabled
            guildData.textChannel = guildData.ajenabled ? message.channel.id : null;
            guildData.voiceChannel = guildData.ajenabled ? memchannel.id : null;
            guildData.save()
             
            const suc = new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${guildData.ajenabled ? emoji.msg.SUCCESS : emoji.msg.ERROR} 24/7 Mode is now **${guildData.ajenabled ? `Enabled` : `Disabled`}**`)
            message.channel.send({embeds: [suc]})
            
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