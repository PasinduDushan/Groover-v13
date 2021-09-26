const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
  
module.exports = {
	name: `servers-list`,
	category: `Owner`,
	aliases: [`slist`],
	description: `Shows servers list`,
	usage: `servers-list`,
	run: async (client, message, args, guildData, player, prefix) => {
	  
		if (!config.ownerIDS.includes(message.author.id)) {
			const nop = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setDescription(`${emoji.msg.ERROR} You are not allowed to run this command! Only the Owner is allowed to run this command`)
			return message.channel.send({embeds: [nop]})
		}
		 
		try {

			let servers = []
			client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r).forEach(element => {
				servers.push(element)
			});

			let serverslist = [];
			for (let i = 0; i < servers.length; i += 15) {
			  let xservers = servers.slice(i, i + 15);
			  serverslist.push(xservers.map((r, index) => `**${i + ++index}** - ${r.name} | ${r.memberCount} Members\nID: ${r.id}`).join(`\n`))
			}
			let limit = Math.round(servers.length / 15)
			let embeds = []
			for (let i = 0; i < limit; i++) {
			  let desc = String(serverslist[i]).substr(0, 2048)
			  await embeds.push(new MessageEmbed()
				.setFooter(ee.footertext, ee.footericon)
				.setColor(message.guild.me.displayHexColor)
				.setDescription(desc));
			}	  
	        return swap_pages1(client, message, embeds, 60)

		} catch (e) {
			console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
		}
	},
};

async function swap_pages1(client, message, embeds, minutes) {
	let currentPage = 0;
	const { MessageButton, MessageActionRow } = require("discord-buttons");
	let button1 = new MessageButton()
	.setStyle('green')
	.setLabel('First')
	.setID('first');
	let button2 = new MessageButton()
	.setStyle('blurple')
	.setLabel('Back')
	.setID('back');
	let button3 = new MessageButton()
	.setStyle('red')
	.setLabel('Delete')
	.setID('home');
	let button4 = new MessageButton()
	.setStyle('blurple')
	.setLabel('Next')
	.setID('next');
	let button5 = new MessageButton()
	.setStyle('green')
	.setLabel('Last')
	.setID('last');
  
	let buttonrow = new MessageActionRow()
	.addComponent(button1)
	.addComponent(button2)
	.addComponent(button3)
	.addComponent(button4)
	.addComponent(button5)
  
	if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
	const queueEmbed = await message.channel.send(
	  {
		content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
		component: buttonrow,
		embeds: [embeds[currentPage]]
	  }
	);
  
	const collector = queueEmbed.createButtonCollector((button)=> button.clicker.user.id === message.author.id, {time: minutes * 1000 * 60})
  
	collector.on("collect", async (b) => {
		try {
			b.defer();
			if (b.id == "next") {
				if (currentPage < embeds.length - 1) {
					currentPage++;
					queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
				} else {
					currentPage = 0
					queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
				}
			} else if (b.id == "back") {
				if (currentPage !== 0) {
					--currentPage;
					queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
				} else {
					currentPage = embeds.length - 1
					queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
				}
			} else if(b.id == "first") {
				currentPage = 0;
				queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
			} else if(b.id == "last") {
				currentPage = embeds.length - 1;
				queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
			}
			else {
				queueEmbed.delete()
			}
		} catch {}
	});
}