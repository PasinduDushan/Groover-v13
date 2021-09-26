const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json")
const settings = require("../../botconfig/settings.json");
const wait = require('util').promisify(setTimeout);

const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const DBL = require('@top-gg/sdk');
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: "play", //the command name for the Slash Command
  description: "Play a song from youtube", //the command description for Slash Command Overview
  cooldown: 1,
  parameters: {"type":"music", "activeplayer": false, "previoussong": false},
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
		{"String": { name: "song_name", description: "What is the song you want?", required: true}}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, guildData, player, prefix) => {
    try{

//    const not_connected = new MessageEmbed()
//      .setDescription('Connect to a voice channel first')
//      .setColor('RED')

//      if(interaction.member.voice === null){
//         await interaction.reply({ embeds:[not_connected], ephermal: true })
//         return
//      }
 

     const embed = new MessageEmbed()
      .setTitle('✅ Song Added to the queue')
      .setColor('#2F3136')
      .setDescription(`Song requested by ${interaction.user.username}`)
     await interaction.deferReply({ ephemeral: true })
     await wait(2000);
     await interaction.editReply({ embeds:[embed], ephemeral: true })

      const args = interaction.options.getString('song_name')
  
      //play the SONG from YOUTUBE
      playermanager(client, interaction, args, `song:youtube`);

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