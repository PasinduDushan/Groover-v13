module.exports = async client => {

  try{
      
    // const discordbotsorg = require("../../handlers/discordbots.org.js");
    // discordbotsorg.init(client);

    try{
      console.log("\n")
      console.log(`[CLIENT] => [READY] ${client.user.tag} IS READY...`.bold.bgWhite.brightMagenta)
    } catch{ /* */ }
      
  }catch (e){
    console.log(String(e.stack).bgRed)
  }
}