const {
    MessageEmbed, MessageActionRow
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  const ee = require("../../botconfig/embed.json");
  const DBL = require("@top-gg/sdk")
  const { MessageButton } = require("discord.js");
  const emoji = require(`../../botconfig/emojis.json`);
  module.exports = {
    name: "vote",
    category: "Info",
    aliases: [  ],
    cooldown: 2,
    usage: "vote",
    description: "Gives you vote link of Groover music",
    run: async (client, message, args, guildData, player, prefix) => {
        try {
        
            let opmusic = new MessageActionRow()
              .addComponents(
                  new MessageButton()
                    .setLabel('Vote Now')
                    .setURL('https://top.gg/bot/765175524594548737/vote')
                    .setStyle('LINK')
              );

            const embed = new MessageEmbed()
            .setColor(ee.color)
            .setTitle("SUPPORT SERVER")
            .addField("**Vote Me On top.gg**", "[**Click Here**](https://top.gg/bot/765175524594548737/vote)")
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setURL("https://discord.gg/4x4MHGHUXC")
            .setTimestamp()
            .setFooter(`Requested By ${message.author.tag}`);
            message.channel.send({components: [opmusic], embeds: [embed]});
        } catch (e) {
            console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
        }
    }
}