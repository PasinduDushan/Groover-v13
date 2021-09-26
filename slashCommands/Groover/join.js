const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "join", //the command name for the Slash Command
  description: "Joins the Bot in your Channel", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [],
  parameters: {"type":"radio", "activeplayer": false, "previoussong": false},
  run: async (client, interaction, args, guildData, player, prefix) => {
    try{
     var { channel } = interaction.member.voice;
      if(!channel) {
        const tot = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You are not connected to a Voice Channel`)
        return interaction.reply({embeds: [tot], ephemeral: true})
      }
      //if no args return error
      var player = client.manager.players.get(interaction.guild.id);
      if(player) {
        const mm = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} I am already connected somewhere`)
        return interaction.reply({embeds: [mm], ephemeral: true});
      }
      //create the player
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
      //join the chanel
      if (player.state !== "CONNECTED") { 
        try {
          interaction.reply({ content: "Connected!" })
        } catch {/* */}
        // join the channel
        player.connect();
        if(interaction.member.voice.channel.type === "stage") {
          setTimeout(async () => {
            try{ await interaction.guild.me.voice.setSuppressed(false) } catch {/* */}
          }, client.ws.ping);
        }
      }
      else {
        const oop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} I am already connected somewhere`)
        return interaction.reply({embeds: [oop], ephemeral: true});
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return interaction.reply({embeds: [emesdf]});
    }
  }
}