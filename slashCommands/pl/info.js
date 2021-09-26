const {
    MessageEmbed 
} = require(`discord.js`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playlistSchema = require("../../models/Playlists");
const { swap_pages2, format } = require("../../handlers/functions")
module.exports = {
  name: "info", //the command name for the Slash Command
  description: "Gives you information of your saved playlist", //the command description for Slash Command Overview
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
		{"String": { name: "playlist_name", description: "Name of the playlist you want to get information.", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
        const nopsd = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} Your Playlist is not existing!\nCreate it with: \`${prefix}pl-create ${Name}\``)
        return interaction.reply({embeds: [nopsd], ephemeral: true});
      }

      let quelist = [];
      for (let i = 0; i < fetchList.playlistArray.length; i += 15) {
        let songs = fetchList.playlistArray.slice(i, i + 15);
        quelist.push(songs.map((track, index) => `**${i + ++index})** **${track.title.substr(0, 60)}** - \`${format(track.duration)}\``).join(`\n`))
      }
      let limit = quelist.length <= 5 ? quelist.length : 5
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`${fetchList.playlistName}  -  (${fetchList.playlistArray.length})`, interaction.guild.iconURL({
            dynamic: true
          }))
          .setFooter(ee.footertext, ee.footericon)
          .setColor(interaction.guild.me.displayHexColor)
          .setDescription(desc));
      }
      return swap_pages2(client, interaction, embeds)
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