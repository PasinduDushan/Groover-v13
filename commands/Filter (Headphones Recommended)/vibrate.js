const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const DBL = require('@top-gg/sdk');
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `vibrato`,
  category: `Filter`,
  aliases: [ ],
  description: `Applies a Vibrato Filter`,
  usage: `vibrato`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {

    try {
      player.node.send({
        op: "filters",
        guildId: message.guild.id,
        equalizer: player.bands.map((gain, index) => {
            var Obj = {
              "band": 0,
              "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
          }),
          vibrato: {
            "frequency": 4.0, // 0 < x
            "depth": 0.75      // 0 < x ≤ 1
          },
          tremolo: {
            "frequency": 4.0, // 0 < x
            "depth": 0.75      // 0 < x ≤ 1
          },
      });
      const ooo = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(`${emoji.msg.SUCCESS} Applying the \`VIBRATO\` Filter(*It might take up to 5 seconds until you hear the Filter*)`)
      return message.channel.send({embeds: [ooo]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]});
    }
  }
};