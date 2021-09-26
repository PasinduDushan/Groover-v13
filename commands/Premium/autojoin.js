const { MessageEmbed, Permissions } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');  
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
    name: `autojoin`,
    aliases: [`aj`],
    category: `Premium`,
    description: `bot joins saved voice channel automatically`,
    usage: `autojoin <text channel>`,
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
                    .setDescription(`${emoji.msg.ERROR} you must vote me [here](https://top.gg/bot/${client.user.id}/vote) to use this command\n [**Click Here**](https://top.gg/bot/${client.user.id}/vote)`)
                    return message.channel.send({embeds: [vote]});
                }
            } catch {/** */}

            if(!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                return message.channel.send({content: `${emoji.msg.ERROR} You Need Manage \`Server Permission\` To Use This Command`})
            }

            if(args[0] === "off") {
                guildData.voiceChannel = null;
                guildData.textChannel = null;
                guildData.song = null;
                guildData.save();
                return message.channel.send({content: `${emoji.msg.SUCCESS} Auto Join Is Now Disabled For This Guild !`})
            }

            const vc = message.member.voice.channel;
            if(!vc) {
                const oppppppppp = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} You have to join a voice channel first`)
                return message.channel.send({embeds: [oppppppppp]})
            }
            let vcneededperms = [];
            let vcperms = [ "CONNECT", "SPEAK" ];
            vcperms.forEach(perm => {
                if(!message.channel.permissionsFor(message.guild.me).has(perm)){
                    vcneededperms.push(perm);
                }
            })
            if(vcneededperms.length > 0){
                const MISSING_BOT_PERMS = new MessageEmbed()
                .setDescription(`${emoji.msg.ERROR} I need the following permissions in \`${vc.name}\` to execute this command: ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`)
                .setColor("RED");
                return message.channel.send({embeds: [MISSING_BOT_PERMS]});
            }

            const tc = message.mentions.channels.first();

            if(!tc || !tc.type === "text") {
                const oppppppppp = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} Please add a valid text Channel via ping!\n\nExample: \`${prefix}autojoin #groover-music\``)
                return message.channel.send({embeds: [oppppppppp]})
            }

            let tcneededperms = []
            let tcperms = [ "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS" ];
            tcperms.forEach(perm => {
                if(!message.channel.permissionsFor(message.guild.me).has(perm)){
                    tcneededperms.push(perm);
                }
            })
            if(tcneededperms.length > 0){
                const MISSING_BOT_PERMS = new MessageEmbed()
                .setDescription(`${emoji.msg.ERROR} I need the following permissions in \`${tc.name}\` to execute this command: ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`)
                .setColor("RED");
                return message.channel.send({embeds: [MISSING_BOT_PERMS]});
            }
    
            guildData.voiceChannel = vc.id;
            guildData.textChannel = tc.id;
            guildData.save()

            const embed = new MessageEmbed()
            .setDescription("Auto Join Has Been Successfully Enabled")
            .addField("VoiceChannel", `${vc}`, true)
            .addField("TextChannel", `${tc.id}`, true)
            message.channel.send({embeds: [embed]})
  
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