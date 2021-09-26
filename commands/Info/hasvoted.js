const {
	MessageEmbed
} = require("discord.js")
const config = require("../../botconfig/config.json")
const ee = require("../../botconfig/embed.json")
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');

module.exports = {
	name: "hasvoted",
	category: "Info",
	aliases: ["hv"],
	description: "Shows did you voted Groover music or not",
	useage: "hasvoted",
	run: async (client, message, args, guildData, player, prefix) => {
		try {
            const dbl = new DBL.Api("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NTE3NTUyNDU5NDU0ODczNyIsImJvdCI6dHJ1ZSwiaWF0IjoxNjEzNjk2NjgyfQ.LBYzhDF-hpKQtHiSv4Fj_66dryDXEB8yQcuxuFYH3o0", client);

            const user = await message.mentions.members.first();
            const voter = user || message.author
            let voted = await dbl.hasVoted(voter.id);
            if(!voted) {
                const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`${emoji.msg.ERROR} <@${voter.id}> has not voted me! 🙁\nPlease vote me [**here**](https://top.gg/bot/765175524594548737/vote)`);
                return message.channel.send({embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${emoji.msg.SUCCESS} <@${voter.id}> has voted me! 😃`);
                return message.channel.send({embeds: [embed]});
            }
            } catch (e) {
			console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]})
		}
	}
}