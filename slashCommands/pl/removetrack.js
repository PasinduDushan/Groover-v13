const {
  MessageEmbed 
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");

module.exports = {
  name: "removetrack", //the command name for the Slash Command
  description: "Remove a track from the playlist", //the command description for Slash Command Overview
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
		{"String": { name: "playlist_name", description: "Playlist name you want to delete a track.", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, guildData, player, prefix) => {
    try{
      const Name = interaction.options.getString('playlist_name')

      if (Name.length > 10) {
        const sidc = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your playlist name is too long!\nMaximum Length is \`10\``)
        return interaction.reply({embeds: [sidc], ephemeral: true});
      }
      let fetchList = await playlistSchema.findOne({
        userID: interaction.user.id,
        playlistName: Name
      });
      
      if (!fetchList) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
        return interaction.reply({embeds: [nopl], ephemeral: true});  
      }

      const Options = args[1];
      if (!Options || isNaN(Options)) {
        const ddsde = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You didn't entered track number (the Track you want to remove (ID OF IT))\nSee all your Tracks: \`${prefix}pl-info ${Name}\`Usage: \`${prefix}pl-removetrack ${Name} <Song number>\``)
        return interaction.reply({embeds: [ddsde], ephemeral: true})
      }

      let tracks = fetchList.playlistArray;
      if (Number(Options) >= tracks.length || Number(Options) < 0) {
        const dfre = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your provided track number is out of Range (\`0\` - \`${tracks.length-1}\`)\nSee all your Tracks: \`/pl info showdetails ${Name}\`Usage: \`/pl removetrack ${Name} <Song number>\``)
        return interaction.reply({embeds: [dfre], ephemeral: true})
      }

      await playlistSchema.updateOne({
        userID: interaction.user.id,
        playlistName: Name
      },
      {
        $pull: {
          playlistArray: fetchList.playlistArray[Options]
        }
      });

      //return susccess message
      const isdfk  = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} Removed **${tracks[Options].title}** from \`${Name}\``)
      .setColor(ee.color)
      return interaction.reply({embeds: [isdfk]})
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