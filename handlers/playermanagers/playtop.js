var {
  MessageEmbed
} = require("discord.js");
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json")
var {
  format
} = require("../functions")
const emoji = require("../../botconfig/emojis.json")
//function for playing playlists
async function playtop(client, interaction, args, type) {

 const song = interaction.options.getString('song_name')

  const search = song;
  let res;
      
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, interaction.member);

  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") throw res.exception;
  else if (res.loadType === "PLAYLIST_LOADED") {
      return require("../../handlers/playermanagers/playlist")(client, interaction, args, type);
  } else {
      song_()
  }
  async function song_() {
    //if no tracks found return info msg
    if (!res.tracks[0]){
      const op = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return interaction.reply({embeds: [op], ephemeral: true});
    }

    //create a player if not created
    let player;
    player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: false
    });
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //connect to the channel
      player.connect()
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      if(interaction.member.voice.channel.type === "stage") {
        try { interaction.guild.me.voice.setSuppressed(false) } catch {/** */}
      }
      player.play();
    } else {
      //save old tracks on an var
      let oldQueue =[]

      for(const track of player.queue)
      oldQueue.push(track);

      //clear queue
      player.queue.clear();

      //add new tracks
      player.queue.add(res.tracks[0]);

      //now add every old song again
      for (const track of oldQueue)
      player.queue.add(track);
      var playembed = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} [\`${res.tracks[0].title}\`](${res.tracks[0].uri})\n\nDuration: \`❯ ${res.tracks[0].isStream ? `LIVE STREAM` : format(res.tracks[0].duration)}\` | Position In Queue: \`1\``)
      .setColor(ee.color)
      await interaction.followUp({embeds: [playembed]}).then(msg => {
        setTimeout(() => {
            try { msg.deleteReply() } catch {/** */}
        }, 3000);
      })
      return;
    }
  }
}

module.exports = playtop;