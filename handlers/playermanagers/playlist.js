var {
  MessageEmbed
} = require("discord.js")
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json")
var {
  format
} = require("../functions")
const emoji = require("../../botconfig/emojis.json")
//function for playing playlists
async function playlist(client, interaction, args, type) {
  const song = interaction.options.getString('song_name')
  var search = song
  try {
    var res;
    var player = client.manager.players.get(interaction.guild.id);
    if(!player)
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: config.settings.selfDeaf,
      });
    let state = player.state;
    if (state !== "CONNECTED") { 
      //set the variables
      player.connect();
    }
    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      res = await client.manager.search(search, interaction.member);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "SEARCH_RESULT") {
        require("../../handlers/playermanagers/song")(client, interaction, args, type);
      }
    } catch (e) {
      console.log(String(e.stack).red)
      const fff = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} There was an error while searching`)
      return interaction.reply({embeds: [fff], ephemeral: true});
    }
    if (!res.tracks[0]) {
      const yyy = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return interaction.reply({embeds: [yyy], ephemeral: true})
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //set the variables
      player.connect();
      //add track
      player.queue.add(res.tracks);
      //play track
      if(interaction.member.voice.channel.type === "stage") {
        await interaction.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
      }
      player.play();
      player.pause(false);

      //if its inside a request channel edit the msg
    }
    else if(!player.queue || !player.queue.current){
      //add track
      player.queue.add(res.tracks);
      if(interaction.member.voice.channel.type === "stage") {
        await interaction.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
      }
      //play track
      player.play();
      player.pause(false);
      //if its inside a request channel edit the msg
    }
    else {
      //add the tracks
      player.queue.add(res.tracks);

    }
    //send information
    var playlistembed = new MessageEmbed()
    .setDescription(`${emoji.msg.SUCCESS} [\`${res.playlist.name}\`](${res.playlist.uri})\n\nDuration: \`${format(res.playlist.duration)}\` | Songs: \`${res.tracks.length}\``)
    interaction.followUp({embeds: [playlistembed]})

  } catch (e) {
    console.log(String(e.stack).red)
    const fck = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
    interaction.followUp({embeds: [fck], ephemeral: true})
  }
}

module.exports = playlist;