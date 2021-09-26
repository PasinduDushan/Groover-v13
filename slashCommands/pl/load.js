const {
    MessageEmbed 
} = require(`discord.js`);
const wait = require('util').promisify(setTimeout);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
const playPlaylist = require("../../models/Playlists");
const playermanager = require(`../../handlers/playermanagers/custom-playlist`);
module.exports = {
  name: "load", //the command name for the Slash Command
  description: "Play the saved playlist", //the command description for Slash Command Overview
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
		{"String": { name: "playlist_name", description: "Playlist name you want to load", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
      const { channel } = interaction.member.voice;

      //if the member is not in a channel, return
      if (!channel) {
        const novc = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to join a voice channel.`)
        return interaction.reply({embeds: [novc], ephemeral: true});
      }

      const mechannel = interaction.guild.me.voice.channel;
      var player = client.manager.players.get(interaction.guild.id);

      if (player && channel.id !== player.voiceChannel) {
        const same = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`${message.guild.channels.cache.get(player.voiceChannel).name}\``)
        return interaction.reply({embeds: [same], ephemeral: true});  
      }

      if(!player && mechannel) {
        const newPlayer = client.manager.create({
          guild: interaction.guild.id,
          voiceChannel: interaction.member.voice.channel.id,
          textChannel: interaction.channel.id,
          selfDeafen: true,    
        })
        newPlayer.destroy();
      }

      if (mechannel && channel.id !== mechannel.id) {
        const need = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} You need to be in my voice channel to use this command!\nChannelname: \`🔈 ${mechannel.name}\``)
        return interaction.reply({embeds: [need], ephemeral: true});
      }

      let fetchList = await playPlaylist.findOne({
        userID: interaction.user.id,
        playlistName: Name
      });
      
      if (!fetchList) {
        const nopl = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${emoji.msg.ERROR} Playlist not found. Please enter the correct playlist name`)
        return interaction.reply({embeds: [nopl], ephemeral: true});  
      }

      const isdk = new MessageEmbed()
      .setColor(ee.color)
      .setDescription(`Attempting to Load ${fetchList.playlistArray.length} Tracks`)
      let tempmsg = await interaction.reply({embeds: [isdk]})

      playermanager(client, interaction, fetchList.playlistArray)

      const newembed = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} Loaded ${fetchList.playlistArray.length} Tracks onto the current Queue`)
      .setColor(ee.color)
      await interaction.editReply({ embeds:[newembed] })
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