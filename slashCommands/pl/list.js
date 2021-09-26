const {
    MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const loadPlaylist  = require("../../models/Playlists");
module.exports = {
  name: "list", //the command name for the Slash Command
  description: "Shows your all saved playlists", //the command description for Slash Command Overview
  cooldown: 1,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
	//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		{"User": { name: "user", description: "Input the username", required: false}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, guildData, player, prefix) => {
    try{
      let member = interaction.options.getUser('user');

      let fetchList;
      fetchList = await loadPlaylist.find({
        userID: member.id
      });
      if (!fetchList.length) {
        const idk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`Can not find any playlist that is saved by ${member.toString()}`)
        return interaction.reply({embeds: [idk], ephemeral: true});
      }

      if (!member) {
        const embeds2 = generateListEmbed(interaction, fetchList);
        return await interaction.reply({embeds: [embeds2]});
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

function generateListEmbed(interaction, list) {
      const info = list.map((pl) => pl);
      //const info = current.map((pl) => `**${++j}** - \`${pl.playlistName}\` (${pl.playlistArray.length})`).join("\n");
      const ascii = require("ascii-table");
      let table = new ascii("Saved Playlists");
      table.setHeading("Playlists", "Tracks");
      
      info.forEach(x => table.addRow(x.playlistName, x.playlistArray.length))
      const embed = new MessageEmbed()
      .setAuthor(`${interaction.user.username}'s Playlists\n`, interaction.user.displayAvatarURL())
      .setDescription(`\`\`\`.--------------------.\n${table}\`\`\``)
      .setFooter(`Playlist (${list.length} / 10)`)
      .setTimestamp();
    return embed;
}