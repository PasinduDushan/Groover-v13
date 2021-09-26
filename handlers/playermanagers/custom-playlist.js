var config = require("../../botconfig/config.json")
const { TrackUtils } = require("erela.js")

async function customplaylist(client, interaction, songs) {

    var player = client.manager.players.get(interaction.guild.id);
    if(!player) {
        player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: config.settings.selfDeaf,
        });
    }

    try {
        for (const track of songs) {
            const unresolvedTrack = TrackUtils.buildUnresolved({
                title: track.title,
                author: track.author,
                duration: track.duration
            }, interaction.member);
            player.queue.add(unresolvedTrack);
        }
    } catch (e) {
        console.log(String(e.stack).red)
    }

    let state = player.state;
    if (state !== "CONNECTED") { 
        //set the variables
        player.connect();
        setTimeout(async () => {
            if(interaction.member.voice.channel.type === "stage") {
                try { await interaction.guild.me.voice.setSuppressed(false) } catch {/* */}
            }                
        }, client.ws.ping);
        player.play();
    } else if(!player.queue || !player.queue.current) {
        setTimeout(async () => {
            if(interaction.member.voice.channel.type === "stage") {
                try { await interaction.guild.me.voice.setSuppressed(false) } catch {/* */}
            }                
        }, client.ws.ping);
        player.play()
    }
}
module.exports = customplaylist;
  