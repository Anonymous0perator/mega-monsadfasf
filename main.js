const fs = require('fs');
const config = require('./config.json');
const roblox = require('roblox-js');
const Discord = require('discord.js');
const randomLorem = require('random-lorem');
const client = new Discord.Client();
const uuid = require('uuid');
if (config.token == "") {
    console.error("You need to provide a token!")
    process.exit(2)
}
let activeverifies = new Map()
let ids = new Map()
client.on('ready', () => {
  console.log('I am ready!');
  client.guilds.array().forEach(function(element) {
    activeverifies.set(element.id, new Map())
}, this);
});
let guildArray = client.guilds.array();

//joined a server
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    //Your other stuff like adding to guildArray
})
client.on('message', message => {
    if (message.channel.id) {
    if (message.content === '!verify') {
        if (message.member.roles.has(config.role)) {
            message.reply("You are already verified!")
        } else {
            message.channel.send({embed: {
                title: "Verification instructions",
                description: "To verify your account with roblox, please type your username.",
            }})
            activeverifies.get(message.guild.id).set(message.author.id, 1)
        }
    } else if (message.content == "!cancel") {
        activeverifies.get(guild.id).delete(message.author.id)
    } else if (message.content === '!die' && message.author.id == config.owner) {
        client.destroy;
        process.exit(0);
    } else if (activeverifies.get(message.guild.id).get(message.author.id) == 1) {
        roblox.getIdFromUsername(message.content).then((id) => {
            console.log("1. https://www.roblox.com/users/"+id+"/profile");
             let theid = randomLorem() + "-" + randomLorem() + "-" + randomLorem();
                message.channel.send({embed: {
                title: "Verification",
                description: "Add the code`"+theid+"` to your roblox profile description and send anything when done."
             }});
            ids.set(message.author.id, [id, theid, message.content]);
            activeverifies.get(message.guild.id).set(message.author.id, 2);
        }).catch( (reason) => {
            message.reply("Mission failed with: " + reason.toString())
            activeverifies.get(message.guild.id).delete(message.author.id);
        })
    } else if (activeverifies.get(message.guild.id).get(message.author.id) == 2) {
        let id = ids.get(message.author.id)
        roblox.getBlurb(id[0]).then((blurb) => {
            if (blurb.includes(id[1])) {
                message.channel.send({embed: {
                    title: "Verification complete!",
                    description: "Verification success"
                }})
                message.member.addRole("Verified")
                message.member.setNickname(id[2])
                console.log("User: `"+id[2]+"` has been successfully verified")
            } else {
                message.reply("I couldnt find that in your description...\n Try again? `!verify`")
            }
            activeverifies.get(message.guild.id).delete(message.author.id)
        }).catch( (reason) => {
            message.reply("Errored with: " + reason.toString())
            activeverifies.get(message.guild.id).delete(message.author.id);
        })
    }}
})
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
client.login(process.env.BOT_TOKEN);
