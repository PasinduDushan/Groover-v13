var {
  MessageEmbed
} = require("discord.js"),

config = require("../../botconfig/config.json"),
emoji = require("../../botconfig/emojis.json"),
ee = require("../../botconfig/embed.json"),

{
  format,
  autoplay,
  findOrCreateGuild
} = require("../../handlers/functions"),

hasmap = new Map();
var mi;
module.exports = (client, interaction) => {
  client.manager
    .on("playerCreate", async (player) => {
      try{
        console.log("\n")
        console.log(`[CLIENT] => [JOINED] JOINED ${client.channels.cache.get(player.voiceChannel).name} IN ${client.channels.cache.get(player.voiceChannel).guild.name}`.yellow)
      } catch{ /* */ }
    })
    .on("playerMove", async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        try {
          player.destroy();
          var embed = new MessageEmbed()
          .setColor(ee.wrongcolor);
          embed.setDescription(`${emoji.msg.ERROR} I left the Channel: \`🔈 ${client.channels.cache.get(player.voiceChannel).name}\``)
          client.channels.cache.get(player.textChannel).send({embeds: [embed]});  
        } catch {/* */}
      } else {
        player.voiceChannel = newChannel;
        if (player.paused) return;
        const checkstage = client.channels.cache.get(newChannel)
        if(newChannel.type === "stage") {
          try {
            setTimeout(async () => {
                await checkstage.guild.me.voice.setSuppressed(false)
            }, 3000);
          } catch {/* */}
        }
        setTimeout(() => player.pause(false), 3000);
      }
  })
  .on("trackStart", async (player, track) => {
    try {
      player.set("previoustrack", track);
      //wait 500 ms
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 500);
      });
      // playANewTrack(client,player,track);
      var embed = new MessageEmbed().setColor(ee.color)
      embed.setColor('#2F3136')
      embed.setDescription(`${emoji.msg.playing} [\`${track.title}\`](${track.uri})\n\nDuration: \`❯ ${track.isStream ? `LIVE STREAM` : format(track.duration)}\``)

      const guildData = await findOrCreateGuild(client, { id: player.guild });
      if(guildData.announce) {
        await client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(msg => {
          if(guildData.pruning) {
            if (player.get(`playingsongmsg`) && msg.id !== player.get(`playingsongmsg`).id) {
              player.get(`playingsongmsg`).delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
            }
            player.set(`playingsongmsg`, msg)
          }
        })
      }
    } catch (e) {
      console.log(String(e.stack).yellow) /* */
    }
  })



  .on("trackStuck", (player, track, payload) => {
    player.stop();
    console.log("lavalink error")
  })
  .on("trackError", (player, track, payload) => {
    player.stop();
    console.log("lavalink error")
  })
  .on("queueEnd", async (player) => {
    if (player.get("autoplay")) return autoplay(client, player);
    //DEvar TIME OUT
    const embed = new MessageEmbed()
    .setColor(ee.color)
    .setDescription(`Queue has ended! No more music to play...\n\nEnjoying music with me? Consider voting me on [**__Top.gg__**](${config.links.opmusicvote})\nConsider donating for our bot [**__Patreon__**](https://patreon.com/grooverbot)`);
    try{
      client.channels.cache.get(player.textChannel).send({embeds: [embed]})
    } catch {/* */}
    return ;
  });
};