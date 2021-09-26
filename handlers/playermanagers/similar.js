var {
    MessageEmbed
  } = require("discord.js")
  var ee = require("../../botconfig/embed.json")
  var config = require("../../botconfig/config.json")
  var {
    format
  } = require("../functions")

  var emoji = require("../../botconfig/emojis.json")
//function for playling song
async function similar(client, interaction, args, type) {
    try {
      //get a playlist out of it
      var mixURL = args.join(" ");
      //get the player instance
      var player = client.manager.players.get(interaction.guild.id);
      //search for similar tracks
      var res = await client.manager.search(mixURL, interaction.member);
      //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
      if (!res || res.loadType === 'LOAD_FAILED' || res.loadType !== 'PLAYLIST_LOADED') {
        const yooy = new MessageEmbed()
        .setDescription(`${emoji.msg.ERROR} Found nothing related for the latest Song`)
        .setColor(ee.wrongcolor)
        return client.channels.cache.get(player.textChannel).send({embeds: [yooy]});
      }
      //if its just adding do this
      if (type.split(":")[1] === "add") {
        //send information message
        var embed2 = new MessageEmbed()
        .setDescription(`${emoji.msg.SUCCESS} [\`${res.tracks[0].title}\`](${res.tracks[0].uri})\n\nAdded By: ${res.tracks[0].requester.toString()} | Duration: \`❯ ${res.tracks[0].isStream ? `LIVE STREAM` : format(res.tracks[0].duration)}\` | Position In Queue: ${player.queue.length}`)
        .setColor(ee.color)  
        await interaction.reply({embeds: [embed2]}).then(msg => {
          setTimeout(() => {
              try { msg.deleteReply() } catch {/** */}
          }, 3000);
        })
        return;
      }
      //if its seach similar
      if (type.split(":")[1] === "search") {
        var max = 15,
          collected, filter = (m) => m.author.id === interaction.author.id && /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;
        track = res.tracks[0]
  
        var results = res.tracks
          .slice(0, max)
          .map((track, index) => `**${++index})** [\`${String(track.title).substr(0, 60).split("[").join("{").split("]").join("}")}\`](${track.uri}) - \`${format(track.duration).split(" | ")[0]}\``)
          .join('\n');
        var searchembed = new MessageEmbed()
          .setTitle(`Search result for: 🔎 **\`${player.queue.current.title}`.substr(0, 256 - 3) + "`**")
          .setColor(ee.color)
          .setDescription(results)
        interaction.reply({embeds: [searchembed]})
        const op = new MessageEmbed()
        .setColor(ee.color)
        .setDescription("👍 Pick your Song with the `Number`")
        await interaction.followUp({embeds: [op], ephemeral: true})
        try {
          collected = await interaction.channel.awaitMessages(filter, {
            max: 1,
            time: 30e3,
            errors: ['time']
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          const yop = new MessageEmbed()
          .setDescription(`${emoji.msg.ERROR} You didn't provide a selection`)
          .setColor(ee.wrongcolor)
          return interaction.reply({embeds: [yop]});
        }
        var first = collected.first().content;
        if (first.toLowerCase() === 'end') {
          if (!player.queue.current) player.destroy();
          const opop = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} Cancelled selection.`)
          return interaction.reply({embeds: [opop]});
        }
        var index = Number(first) - 1;
        if (index < 0 || index > max - 1) {
          const opoppo = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} The number you provided too small or too big (1-${max}).`)
          return interaction.reply({embeds: [opoppo]});
        }

        track = res.tracks[index];
        if (!res.tracks[0]) {
          const fffff = new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setDescription(`${emoji.msg.ERROR} Found nothing for: **${player.queue.current.title.substr(0, 256 - 3)}**`)
          return interaction.reply({embeds: [fffff]})
        }
        if (player.state !== "CONNECTED") {
          //set the variables
          // Connect to the voice channel and add the track to the queue
  
          player.connect();
          player.queue.add(track);
          if(interaction.member.voice.channel.type === "stage") {
            await interaction.guild.me.voice.setSuppressed(false).catch(e => console.log("can not become auto moderator in stage channels".grey))
          }
          player.play();
          player.pause(false);
        } else {
          player.queue.add(track);
          var embed = new MessageEmbed()
          .setDescription(`${emoji.msg.SUCCESS} [\`${track.title}\`](${track.uri})\n\nDuration: \`❯ ${track.isStream ? `LIVE STREAM` : format(track.duration)}\` | Position In Queue: ${player.queue.length}`)
          .setColor(ee.color)
          await interaction.reply({embeds: [embed]}).then(msg => {
            setTimeout(() => {
                try { msg.deleteReply() } catch {/** */}
            }, 3000);
          })
        }
      }
    } catch (e) {
      console.log(String(e.stack).red)
      const dodo = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${player.queue.current.title.substr(0, 256 - 3)}**`)
      return interaction.reply({embeds: [dodo], ephemeral: true})
    }
}

module.exports = similar;