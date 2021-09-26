//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const emoji = require(`../../botconfig/emojis.json`)
const { onCoolDown, replacemsg, findOrCreateGuild } = require("../../handlers/functions");
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
module.exports = async(client, interaction) => {
	const CategoryName = interaction.commandName;
	let command = false;
        if(!interaction.inGuild()) return
        if(!interaction.isCommand()) return
        if(interaction.member.bot) return
        const guildData = await findOrCreateGuild(client, { id: interaction.guild.id });
	try{
    	    if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
      		command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
    	    }
  	}catch{
    	    if (client.slashCommands.has("normal" + CategoryName)) {
      		command = client.slashCommands.get("normal" + CategoryName);
   	    }
	}
	if(command) {
         if(!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return;
         if(!interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")){
           const x = await interaction.reply({content: `${emoji.msg.ERROR} I don't have \`EMBED LINKS\` permssion`})
            setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
           return;
        }
        let neededPermissions = [];
          let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "MOVE_MEMBERS" , "READ_MESSAGE_HISTORY"]
          required_perms.forEach(perm => {
            if(!interaction.channel.permissionsFor(interaction.guild.me).has(perm)){
              neededPermissions.push(perm);
            }
          })
          if(neededPermissions.length > 0){
            const MISSING_BOT_PERMS = new MessageEmbed()
            .setDescription(`${emoji.msg.ERROR} I need the following permissions to execute this command: ${neededPermissions.map((p) => `\`${p}\``).join(", ")}`)
            .setColor("RED");
            return interaction.reply({embeds: [MISSING_BOT_PERMS]});
        }
		if (onCoolDown(interaction, command)) {
			  return interaction.reply({ephemeral: true,
				embeds: [new Discord.MessageEmbed()
				  .setColor(ee.wrongcolor)
				  .setFooter(ee.footertext, ee.footericon)
				  .setTitle(replacemsg(settings.messages.cooldown, {
					prefix: prefix,
					command: command,
					timeLeft: onCoolDown(interaction, command)
				  }))]
			  });
			}
		//if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
              .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
                command: command,
                prefix: prefix
              }))]
          });
        }
        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command,
              prefix: prefix
			}))]
          })
        }
        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command,
              prefix: prefix
            }))]
          });
        }
        if(command.parameters) {
          if(command.parameters.type == "music"){
             //get the channel instance
            const { channel } = interaction.member.voice;
            const mechannel = interaction.guild.me.voice.channel;
            //if not in a voice Channel return error
            if (channel === null) {
              not_allowed = true;
              const opop = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
              return interaction.reply({embeds: [opop], ephemeral: true});
            }
            const player = client.manager.players.get(interaction.guild.id);
            //If there is no player, then kick the bot out of the channel, if connected to
            if(!player && mechannel) {
              const newPlayer = client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
                selfDeafen: true,
              })
              newPlayer.destroy();
            }
            //if no player available return error | aka not playing anything
            if(command.parameters.activeplayer){
              if (!player){
                not_allowed = true;
                const udfj = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                return interaction.reply({embeds: [udfj]});
              }
              if (!mechannel){
                if(player) try{ player.destroy() }catch{ }
                not_allowed = true;
                const mmmm = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} I am not connected to a Channel`)
                return interaction.reply({embeds: [mmmm]});
              }
              if(!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
                return interaction.reply({embeds: [no]})
              }
            }
            //if no previoussong
            if(command.parameters.previoussong){
              if (!player.queue.previous || player.queue.previous === null){
                not_allowed = true;
                const ifkf = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} There is no previous song yet!`)
                return interaction.reply({embeds: [ifkf]});
              }
            }
            //if not in the same channel --> return
            if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
              const ikkkk = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
              return interaction.reply({embeds: [ikkkk]});
            }
            //if not in the same channel --> return
            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
              const ikk = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel(\`🔈 ${mechannel.name}\`) to use this command!`)
              return interaction.reply({embeds: [ikk]});
            }
          }
        }
                const player = client.manager.players.get(interaction.guild.id);
                const args = interaction.options
                    let prefix = guildData.prefix;
                    if (prefix === null) prefix = config.prefix;
		command.run(client, interaction, guildData, interaction.member, player, interaction.guild, prefix)
	}
}