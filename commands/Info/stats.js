const {
  MessageEmbed
} = require("discord.js");
const Discord  = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const {
  getRandomInt
} = require("../../handlers/functions")
module.exports = {
  name: "stats",
  category: "Info",
  aliases: ["musicstats"],
  cooldown: 10,
  usage: "stats",
  description: "Shows  Stats, like amount of Commands and played Songs etc.",
  run: async (client, message, args, guildData, player, prefix) => {
    
    try {
      let totalSeconds = message.client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
      
      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

      
      const promises = [
	client.shard.fetchClientValues('guilds.cache.size'),
	client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
      ];

      Promise.all(promises)
	.then(results => {
		const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
		const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
  
      const statsEmbed = new Discord.MessageEmbed()
      .setColor('#2F3136')
      .setAuthor(client.user.tag, client.user.displayAvatarURL())
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`**Stats:**`)
      .addField(`• **Servers**`, `\`\`\`Total: ${totalGuilds} servers\`\`\``, true)
      .addField(`• **Users**`, `\`\`\`Total: ${totalMembers}\`\`\``, true)
      .addField(`• **Node Version**`, `\`\`\`v${process.versions.node}\`\`\``, true)
      .addField(`• **Discord.js**`, `\`\`\`v13.1.0\`\`\``, true)
      .addField(`• **Uptime**`, `\`\`\`${uptime}\`\`\``, true)
      .addField(`• **Ping**`, `\`\`\`${client.ws.ping}ms\`\`\``, true)
      .addField(`• **Shard Count**`, `\`\`\`4\`\`\``)
      .addField("\u200B", `[Invite](${config.links.opmusicinv}) ● [Support Server](${config.links.server}) ● [Vote Us](${config.links.opmusicvote})`);
    
      message.channel.send({embeds: [statsEmbed]});
  })
	.catch(console.error);

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