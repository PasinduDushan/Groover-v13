const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { swap_pages2 } = require("../../handlers/functions")
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "help",
  category: "Info",
  aliases: ["h", "commandinfo", "commands"],
  cooldown: 3,
  usage: "help [Command]",
  description: "Returns all Commmands, or one specific command",
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      if (args[0]) {
        const embed = new MessageEmbed()
        .setColor("#2F3136");
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          embed.setColor("RED");
          embed.setDescription(`Nothing found for **${args[0].toLowerCase()}**`)
          return message.channel.send({embeds: [embed]});
        } else if (!cmd && cat) {
          var category = cat;

          const catcommands = client.commands.filter(x => x.category === category).map(x => '`' + x.name + '`').join(", ")

          const embed = new MessageEmbed()
          .setColor("#2F3136")
          .setDescription(`● To get help on a specific command type \`${prefix}help <command>\`!`)
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
          .addField(`${emoji.categories[category.toLowerCase()]} **${category} - (${client.commands.filter((cmd) => cmd.category === category).size})**`, catcommands)
          .setFooter(ee.footertext, client.user.displayAvatarURL());
        
          return message.channel.send({embeds: [embed]})
        }
        if (cmd.name) embed.addField("**Command name**", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Detailed Information about:\`${cmd.name}\``);
        if (cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);
        if (cmd.aliases) try {
          embed.addField("Aliases", cmd.aliases.length > 0 ? cmd.aliases.map(a => "`" + a + "`").join("\n") : "No Aliases")
        } catch {}
        if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown} Seconds\``);
        else embed.addField("**Cooldown**", `\`3 Seconds\``);
        if (cmd.usage) {
          embed.addField("**Usage**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        if (cmd.useage) {
          embed.addField("**Useage**", `\`${prefix}${cmd.useage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        embed.setColor(ee.color)
        return message.channel.send({embeds: [embed]});
      } else {
        
        let owner = config.ownerIDS.includes(message.author.id);

        const categories = [];
        const commands = client.commands;
    
        commands.forEach((command) => {
          if(!categories.includes(command.category)){
            if(command.category === "Owner" && !owner){
              return;
            }
            categories.push(command.category);
          }
        });

        let embeds = [];

        const tembed = new MessageEmbed();

        categories.sort().forEach((cat) => {
          const tCommands = commands.filter((cmd) => cmd.category === cat);
          tembed.addField(emoji.categories[cat.toLowerCase()]+" "+cat+" - ("+tCommands.size+")", tCommands.map((cmd) => "`"+cmd.name+"`").join(", "));
        });

        tembed.setColor("#2F3136")
        .setFooter(ee.footertext)
        .setAuthor(`Groover Help Section`, client.user.displayAvatarURL(), config.links.opmusicinv)
        .addField("\u200B", `[Invite](${config.links.opmusicinv}) ● [Support Server](${config.links.server}) ● [Vote Us](${config.links.opmusicvote})`)
        embeds.push(tembed)

        categories.sort().forEach((cat) => {
          const xcatcommands = client.commands.filter(x => x.category === cat).map(x => '`' + x.name + '`').join(", ")
          const embed = new MessageEmbed()
          .setColor("#2F3136")
          .setDescription(`● To get help on a specific command type \`${prefix}help <command>\`!`)
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
          .addField(`${emoji.categories[cat.toLowerCase()]} **${cat} - (${client.commands.filter((cmd) => cmd.category === cat).size})**`, xcatcommands)
          .addField("\u200B", `[Invite](${config.links.opmusicinv}) ● [Support Server](${config.links.server}) ● [Vote Us](${config.links.opmusicvote})`)
          .setFooter(ee.footertext, client.user.displayAvatarURL());
          embeds.push(embed);
        });

        swap_pages2(client, message, embeds)
      
      }
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