const Discord = require("discord.js");
const {
  MessageEmbed,
  Collection
} = require("discord.js");
const emoji = require("../botconfig/emojis.json");
const ee = require("../botconfig/embed.json");
const wait = require('util').promisify(setTimeout);

module.exports.getMember = getMember 
module.exports.shuffle = shuffle;
module.exports.formatDate = formatDate;
module.exports.duration = duration;
module.exports.promptMessage = promptMessage;
module.exports.delay = delay;
module.exports.getRandomInt = getRandomInt;
module.exports.getRandomNum = getRandomNum;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.escapeRegex = escapeRegex;
module.exports.autoplay = autoplay;
module.exports.arrayMove = arrayMove;
module.exports.swap_pages2 = swap_pages2;
module.exports.swap_pages1 = swap_pages1;
module.exports.findOrCreateGuild = findOrCreateGuild;
module.exports.replacemsg = replacedefaultmessages;
module.exports.onCoolDown = onCoolDown;
// This function is used to find a guild data or create it
async function findOrCreateGuild(client, { id: guildID }, isLean){
  if(client.databaseCache.guilds.get(guildID)){
    return isLean ? client.databaseCache.guilds.get(guildID).toJSON() : client.databaseCache.guilds.get(guildID);
  } else {
    let guildData = (isLean ? await client.guildsData.findOne({ id: guildID }) : await client.guildsData.findOne({ id: guildID }));
    if(guildData){
      if(!isLean) client.databaseCache.guilds.set(guildID, guildData);
      return guildData;
    } else {
      guildData = new client.guildsData({ id: guildID });
      await guildData.save();
      client.databaseCache.guilds.set(guildID, guildData);
      return isLean ? guildData.toJSON() : guildData;
    }
  }
}


function getMember(message, toFind = "") {
  try {
    toFind = toFind.toLowerCase();
    let target = message.guild.members.get(toFind);
    if (!target && message.mentions.members) target = message.mentions.members.first();
    if (!target && toFind) {
      target = message.guild.members.find((member) => {
        return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
      });
    }
    if (!target) target = message.member;
    return target;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US").format(date);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function duration(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString();
  const min = Math.floor((ms / (60 * 1000)) % 60).toString();
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
  const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
  return `${days}Days,${hrs}Hours,${min}Minutes,${sec}Seconds`;
}



function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

//randomnumber between 0 and x
function getRandomInt(max) {
  try {
    return Math.floor(Math.random() * Math.floor(max));
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}
//random number between y and x
function getRandomNum(min, max) {
  try {
    return Math.floor(Math.random() * Math.floor((max - min) + min));
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function onCoolDown(message, command) {
    if(!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if(!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    const client = message.client;
    if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
      client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now(); //get the current time
    const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown || settings.default_cooldown_in_sec) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.member.id)) { //if the user is on cooldown
      const expirationTime = timestamps.get(message.member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
      if (now < expirationTime) { //if he is still on cooldonw
        const timeLeft = (expirationTime - now) / 1000; //get the lefttime
        //return true
        return timeLeft
      }
      else {
        //if he is not on cooldown, set it to the cooldown
        timestamps.set(message.member.id, now); 
        //set a timeout function with the cooldown, so it gets deleted later on again
        setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
        //return false aka not on cooldown
        return false;
      }
    }
    else {
      //if he is not on cooldown, set it to the cooldown
      timestamps.set(message.member.id, now); 
      //set a timeout function with the cooldown, so it gets deleted later on again
      setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
      //return false aka not on cooldown
      return false;
    }
}

function createBar(player) {
  try{
    let size = 15;
    if (!player.queue.current) return `**${emoji.msg.progress_bar.emptybeginning}${emoji.msg.progress_bar.filledframe}${emoji.msg.progress_bar.emptyframe.repeat(size - 1)}${emoji.msg.progress_bar.emptyend}**\n**00:00:00 / 00:00:00**`;
    let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
    let total = player.queue.current.duration;
    let rightside = size - Math.round(size * (current / total));
    let leftside = Math.round(size * (current / total));
    let bar;
    if (leftside < 1) bar = String(emoji.msg.progress_bar.emptybeginning) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(emoji.msg.progress_bar.emptyend);
    else bar = String(emoji.msg.progress_bar.leftindicator) + String(emoji.msg.progress_bar.filledframe).repeat(leftside) + String(emoji.msg.progress_bar.emptyframe).repeat(rightside) + String(size - rightside !== 1 ? emoji.msg.progress_bar.emptyend : emoji.msg.progress_bar.rightindicator);
    return `**${bar}**\n**${!player.queue.current.isStream ? `**${new Date(player.position).toISOString().substr(11, 8)} / ${new Date(player.queue.current.duration).toISOString().slice(11, 19)}**` : '`◉ LIVE`'}**`;
  }catch (e){
    console.log(String(e.stack).bgRed)
  }
}
function format(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

function replacedefaultmessages(text, o = {}){
  if(!text || text == undefined || text == null) throw "No Text for the replacedefault message added as First Parameter";
  const options = Object(o)
  if(!options || options == undefined || options == null) return String(text)
  return String(text)
    .replace(/%{timeleft}%/gi, options && options.timeLeft ? options.timeLeft.toFixed(1) : "%{timeleft}%")
    .replace(/%{commandname}%/gi, options && options.command && options.command.name ? options.command.name : "%{commandname}%")
    .replace(/%{commandaliases}%/gi, options && options.command && options.command.aliases ? options.command.aliases.map(v => `\`${v}\``).join(",") : "%{commandaliases}%")
    .replace(/%{prefix}%/gi, options && options.prefix ? options.prefix : "%{prefix}%")
    .replace(/%{commandmemberpermissions}%/gi, options && options.command && options.command.memberpermissions ? options.command.memberpermissions.map(v => `\`${v}\``).join(",") : "%{commandmemberpermissions}%")
    .replace(/%{commandalloweduserids}%/gi, options && options.command &&options.command.alloweduserids ? options.command.alloweduserids.map(v => `<@${v}>`).join(",") : "%{commandalloweduserids}%")
    .replace(/%{commandrequiredroles}%/gi, options && options.command &&options.command.requiredroles ? options.command.requiredroles.map(v => `<@&${v}>`).join(",") : "%{commandrequiredroles}%")
    .replace(/%{errormessage}%/gi, options && options.error && options.error.message ? options.error.message : options && options.error ? options.error : "%{errormessage}%")
    .replace(/%{errorstack}%/gi, options && options.error && options.error.stack ? options.error.stack : options && options.error && options.error.message ? options.error.message : options && options.error ? options.error : "%{errorstack}%")
    .replace(/%{error}%/gi, options && options.error ? options.error : "%{error}%")

}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

async function promptMessage(message, author, time, validReactions) {
  try {
    time *= 1000;
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
    return message.awaitReactions(filter, {
      max: 1,
      time: time
    }).then((collected) => collected.first() && collected.first().emoji.name);
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}

async function autoplay (client, player, type) {
  try {
    if (player.queue.size > 0) return;
    let previoustrack = player.get("previoustrack");
    if (!previoustrack) return;

    const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
    const res = await client.manager.search(mixURL, previoustrack.requester);
    //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
    if (!res || res.loadType === 'LOAD_FAILED' || res.loadType !== 'PLAYLIST_LOADED') {
      let embed = new MessageEmbed()
      .setDescription(`${emoji.msg.ERROR} Found nothing related for the latest Song!`)
      .setColor(ee.wrongcolor)
      try {
        client.channels.cache.get(player.textChannel).send({embeds: [embed]})
      } catch (e) { console.log(e) }
    }
    player.queue.add(res.tracks[2]);
    if(type === "skip") {
      player.stop()
    } else {
      player.play()
    }
    return;
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
}


async function swap_pages2(client, interaction, embeds) {
  let currentPage = 0;
  const { MessageButton, MessageActionRow } = require("discord.js");
  let button1 = new MessageButton()
  .setCustomId('first')
  .setLabel('⏪')
  .setStyle('PRIMARY')
  .setDisabled(true);
  let button2 = new MessageButton()
  .setCustomId('back')
  .setLabel('⬅️')
  .setStyle('PRIMARY')
  .setDisabled(true);
  let button3 = new MessageButton()
  .setCustomId('home')
  .setLabel('❌')
  .setStyle('SUCCESS')
  .setDisabled(true);
  let button4 = new MessageButton()
  .setCustomId('next')
  .setLabel('➡️')
  .setStyle('PRIMARY')
  .setDisabled(true);
  let button5 = new MessageButton()
  .setCustomId('last')
  .setLabel('⏩')
  .setStyle('PRIMARY')
  .setDisabled(true);
  let jumpbutton = new MessageButton()
  .setCustomId("jump")
  .setLabel("↗️")
  .setStyle("SUCCESS")
  .setDisabled(true);
  let empty = new MessageButton()
  .setCustomId("empty")
  .setStyle("SECONDARY")
  .setLabel('\u200b')
  .setDisabled(true);
  let empty1 = new MessageButton()
  .setCustomId("empty1")
  .setStyle("SECONDARY")
  .setLabel('\u200b')
  .setDisabled(true);

  let buttonrow1 = new MessageActionRow()
  .addComponents(
    button1,
    button2,
    button4,
    button5
  )

  let buttonrow2 = new MessageActionRow()
  .addComponents(empty,
    button3,
    jumpbutton,
    empty1
  )

  if (embeds.length === 1) return interaction.reply({embeds: [embeds[0]]})
  const queueEmbed = await interaction.reply(
    {
      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      components: [buttonrow1, buttonrow2],
      embeds: [embeds[currentPage]],
      ephemeral: true
    }
  );
  const filter = (button) => button.clicker.user.id === interaction.author.id;
  const collector = queueEmbed.createMessageComponentCollector(filter, { time: 60000 }); //collector for 5 seconds

  collector.on("collect", async (b) => {
    try {
      b.deferUpdate();
      if (b.customId == "next") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
        } else {
          currentPage = 0
          queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
        }
      } else if (b.customId == "back") {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
        } else {
          currentPage = embeds.length - 1
          queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
        }
      } else if(b.customId == "first") {
        currentPage = 0;
        queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
      } else if(b.customId == "last") {
        currentPage = embeds.length - 1;
        queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
      } else if(b.customId == "jump") {
        const emem = new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`⌛ Please send the page number`)
        const idk = await interaction.reply({embeds: [emem]})
        const collector = interaction.channel.createMessageCollector(m => m.author.id === interaction.author.id, { time: 10000 });
        collector.on("collect", async msg => {
          if(isNaN(msg.content) || Number(msg.content) > embeds.length) {
            try { setTimeout(() => { msg.delete() }, client.ws.ping) } catch {/** */}
            try { setTimeout(() => { idk.delete() }, client.ws.ping) } catch {/** */}
            const eoe = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Provided page number wasn't valid`)
            interaction.reply({embeds: [eoe]})
            await wait(3000)
            interaction.delteReply()
            collector.stop()
          } else {
            try { setTimeout(() => { msg.delete() }, client.ws.ping) } catch {/** */}
            try { setTimeout(() => { idk.delete() }, client.ws.ping) } catch {/** */}
            currentPage = Number(msg.content) - 1;
            queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true}); 
            collector.stop()
          }
        })
        collector.on("end", async(_, reason) => {
          if (reason === "time") {
            const embed = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Time's up! Please press the button again`)
            await interaction.reply({embeds: [embed]})
            await wait(3000)
            await interaction.deleteReply()
            return
          }
        });
      } else {
        button1 = new MessageButton()
        .setCustomId('first33')
        .setLabel('⏪')
        .setStyle('PRIMARY')
        .setDisabled(true);
        button2 = new MessageButton()
        .setCustomId('back33')
        .setLabel('⬅️')
        .setStyle('PRIMARY')
        .setDisabled(true);
        button3 = new MessageButton()
        .setCustomId('home33')
        .setLabel('❌')
        .setStyle('SUCCESS')
        .setDisabled(true)
        button4 = new MessageButton()
        .setCustomId('next33')
        .setLabel('➡️')
        .setStyle('PRIMARY')
        .setDisabled(true);
        button5 = new MessageButton()
        .setCustomId('last3')
        .setLabel('⏩')
        .setStyle('PRIMARY')
        .setDisabled(true);
        jumpbutton = new MessageButton()
        .setCustomId("jump33")
        .setLabel("↗️")
        .setStyle("SUCCESS")
        .setDisabled(true);
        empty = new MessageButton()
        .setCustomId("empty33")
        .setLabel('\u200b')
        .setStyle("SECONDARY")
        .setDisabled(true);
        empty1 = new MessageButton()
        .setCustomId("empty44")
        .setLabel('\u200b')
        .setStyle("SECONDARY")
        .setDisabled(true);      
        buttonrow1 = new MessageActionRow()
         .addComponents(
          button1,
          button2,
          button4,
          button5
        )
      
        buttonrow2 = new MessageActionRow()
        .addComponents(
          empty,
          button3,
          jumpbutton,
          empty1
        )
                      
        currentPage = 0
        queueEmbed.editReply({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], components: [buttonrow1, buttonrow2], ephemeral: true});
      }
    } catch {}
  });
}

async function swap_pages1(client, message, embeds, seconds) {
  let currentPage = 0;
  const { MessageButton, MessageActionRow } = require("discord.js");
  let button1 = new MessageButton()
  .setStyle('green')
  .setLabel('First')
  .setCustomId('first11');
  let button2 = new MessageButton()
  .setStyle('blurple')
  .setLabel('Back')
  .setCustomId('back11');
  let button3 = new MessageButton()
  .setStyle('gray')
  .setLabel('Cancel')
  .setCustomId('home11');
  let button4 = new MessageButton()
  .setStyle('blurple')
  .setLabel('Next')
  .setCustomId('next11');
  let button5 = new MessageButton()
  .setStyle('green')
  .setLabel('Last')
  .setCustomId('last11');

  let buttonrow = new MessageActionRow()
  .addComponents(button1,
  button2,
  button3,
  button4,
  button5)

  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]})
  const queueEmbed = await message.channel.send(
    {
      content: `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      component: buttonrow,
      embeds: [embeds[currentPage]]
    }
  );

  const collector = queueEmbed.createButtonCollector((button)=> button.clicker.user.id === message.author.id, {time: seconds * 1000})

  collector.on("collect", async (b) => {
    try {
      b.defer();
      if (b.id == "next") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        } else {
          currentPage = 0
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        }
      } else if (b.id == "back") {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        } else {
          currentPage = embeds.length - 1
          queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
        }
      } else if(b.id == "first") {
        currentPage = 0;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      } else if(b.id == "last") {
        currentPage = embeds.length - 1;
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      }
      else {
        button1 = new MessageButton()
        .setStyle('green')
        .setDisabled(true)
        .setLabel('First')
        .setCustomId('first22');
        button2 = new MessageButton()
        .setStyle('blurple')
        .setDisabled(true)
        .setLabel('Back')
        .setCustomId('back22');
        button3 = new MessageButton()
        .setStyle('gray')
        .setDisabled(true)
        .setLabel('Cancel')
        .setCustomId('home22');
        button4 = new MessageButton()
        .setStyle('blurple')
        .setLabel('Next')
        .setDisabled(true)
        .setCustomId('next22');
        button5 = new MessageButton()
        .setStyle('green')
        .setLabel('Last')
        .setDisabled(true)
        .setCustomId('last22');
      
        buttonrow = new MessageActionRow()
        .addComponents(button1,
        button2,
        button3,
        button4,
        button5)
      
        currentPage = 0
        queueEmbed.edit({content: `**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds: [embeds[currentPage]], component: buttonrow});
      }
    } catch {}
  });
}