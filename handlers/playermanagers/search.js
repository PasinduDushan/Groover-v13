var {
  MessageEmbed
} = require("discord.js")
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json");
var emoji = require("../../botconfig/emojis.json");
var { format } = require("../functions")

//function for searching songs
async function search(client, interaction, args, type) {
  const song = interaction.options.getString('song _name')
  var search = song;
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
      if(interaction.member.voice.channel.type === "stage") {
        try {
          setTimeout(async () => {
              await interaction.guild.me.voice.setSuppressed(false)
          }, 3000);
        } catch {/* */}
      }
    }
    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      res = await client.manager.search({
        query: search,
        source: type.split(":")[1]
      }, interaction.member);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") {
        require("../../handlers/playermanagers/playlist")(client, interaction, args, type);
      } 
    } catch (e) {
      console.log(String(e.stack).red)
      const errrr = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} There was an error while searching`)
      return interaction.reply({embeds: [errrr], ephemeral: true});
    }


    var max = 10,
    collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
    if (res.tracks.length < max) max = res.tracks.length;
    track = res.tracks[0]

    var results = res.tracks
    .slice(0, max)
    .map((track, index) => `**${++index})** [\`${String(track.title).substr(0, 60).split("[").join("{").split("]").join("}")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
    .join('\n');

    const ssss = new MessageEmbed()
    .setColor(ee.color)
    .setDescription(results)
    interaction.reply({embeds: [ssss]})

    const yyy = new MessageEmbed()
    .setColor(ee.color)
    .setDescription("Select your song with it's `number`")
    await interaction.reply({embeds: [yyy]})
    try {
      collected = await interaction.channel.awaitMessages(filter, {
        max: 1,
        time: 30e3,
        errors: ['time']
      });
    } catch (e) {
      if (!player.queue.current) player.destroy();
      const op = new MessageEmbed()
      .setDescription(`${emoji.msg.ERROR} You didn't provide a selection`)
      .setColor(ee.wrongcolor)
      return interaction.reply({embeds: [op]});
    }
    var first = collected.first().content;
    if (first.toLowerCase() === 'end') {
      if (!player.queue.current) player.destroy();
      const tt = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Search Canceled.`)
      return interaction.reply({embeds: [tt], ephemeral: true});
    }
    var index = Number(first) - 1;
    if (index < 0 || index > max - 1) {
      const yyy = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Please provide a valid number between (1-${max}).`)
      return interaction.reply({embeds: [yyy], ephemeral: true})
    }
    track = res.tracks[index];
    if (!res.tracks[0]) {
      const fff = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return interaction.reply({embeds: [fff]})
    }
    if (player.state !== "CONNECTED") {
      //set the variables
      player.connect();
      //add track
      player.queue.add(track);
      //set the variables
      if(interaction.member.voice.channel.type === "stage") {
        try { await interaction.guild.me.voice.setSuppressed(false) } catch {/** */}
      }
      //play track
      player.play();
      player.pause(false);

    } 
    else if(!player.queue || !player.queue.current){
      //add track
      player.queue.add(track);
      if(interaction.member.voice.channel.type === "stage") {
        try { await interaction.guild.me.voice.setSuppressed(false) } catch {/** */}
      }
      //play track
      player.play();
      player.pause(false);
    }
    else {
      player.queue.add(track);

      var embed3 = new MessageEmbed()
      .setDescription(`${emoji.msg.SUCCESS} [\`${track.title}\`](${track.uri})\n\nDuration: \`❯ ${track.isStream ? `LIVE STREAM` : format(track.duration)}\` | Position In Queue: ${player.queue.length}`)
      .setColor(ee.color)
      await interaction.reply({embeds: [embed3]}).then(msg => {
        setTimeout(() => {
            try { msg.deleteReply() } catch {/** */}
        }, 3000);
      })
      return;
    }

  } catch (e) {
    console.log(String(e.stack).red)
    const fff = new MessageEmbed()
    .setColor(ee.wrongcolor)
    .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
    interaction.reply({embeds: [fff]})
  }
}

module.exports = search;
