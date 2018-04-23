const Discord = require("discord.js");
const client = new Discord.Client();
var rbx = require('roblox-js');
const randomLorem = require('random-lorem');
const uuid = require('uuid');
const fs = require('fs');
let activeverifies = new Map()
let ids = new Map()
client.on('ready', () => {
  console.log('I am ready!');
  client.guilds.array().forEach(function(element) {
    activeverifies.set(element.id, new Map())
}, this);
});
client.on('ready', () => {
  console.log('Bot is up and running!');
  client.user.setPresence({
    game: {
      name :(``),
      type: 0
    }
  });

});

const prefix = ':'
client.on('message', message => {
  // Return if it is a bot
  if (message.author.bot) return;
  // Return if it is a DM
  if (!message.guild) {
    message.channel.send("You cannot do any of the bot's commands in DM")
    return;
  }

  // Saving memory, if there is no prefix it quits.
  if (!message.content.slice(1) === prefix) return;


  //Function for command checking
  function commandIs(command) {
    if (message.content.startsWith(prefix + command)) {
      return true;
    }
  }

  // Whois Command
  if (commandIs("userinfo")) {
   try {
      if (message.mentions.members.first()) {
        let member = message.mentions.members.first().user
        let guildMember = message.mentions.members.first()
        const embed = new Discord.RichEmbed()
          .setDescription("Description and information about " + member.tag)
          .setAuthor(member.username, member.displayAvatarURL)
          .setColor(0x70b080)
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp(new Date())
          .setFooter("Alpha", client.user.avatarURL)
          .addField("ID", member.id)
          .addField("Discriminator", member.discriminator)
          .addField("Status", member.presence.status)

          .addField("Nickname", guildMember.nickname)
          .addField("Moderator", guildMember.hasPermission("BAN_MEMBERS"))
          .addField("Joined at", guildMember.joinedAt)
          .addField("Role(s)", guildMember.roles.array().join(", "))
        message.channel.send(embed)
      } else {
        let member = message.author
        let guildMember = message.guild.member(member)
        const embed = new Discord.RichEmbed()
          .setDescription("Description and information about " + member.tag)
          .setAuthor(member.username, member.displayAvatarURL)
          .setColor(0x70b080)
          .setThumbnail(member.displayAvatarURL)
          .setTimestamp(new Date())
          .setFooter("Alpha", client.user.avatarURL)
          .addField("ID", member.id)
          .addField("Discriminator", member.discriminator)
          .addField("Status", member.presence.status)

          .addField("Nickname", guildMember.nickname)
          .addField("Moderator", guildMember.hasPermission("BAN_MEMBERS"))
          .addField("Joined at", guildMember.joinedAt)
          .addField("Role(s)", guildMember.roles.array().join(", "))
        message.channel.send(embed)
      }
      return;
    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }


  if (commandIs("help")) {
    const embed = new Discord.RichEmbed()
      .setTitle("Commands List for Alpha")
      .setDescription(`All the commands provided for the release version of Alpha. Default prefix is ${prefix}`)
      .setColor(0x70b080)
      .addField("help", "This help panel")
    	.addField("membercount","Counts member")
      .addField("serverinfo", "Information about the server")
      .addField("botping", "Shows ping (message round trip) of the bot")
      .addField("userinfo", "Information about user in the server")
      .addField("purge", "Delete a bulk load of messages (100 max)")
      .addField("kick", "Kicks a member from the server")
      .addField("warn", "It will warn the people who you tagged")

      .setFooter("Alpha", client.user.avatarURL)
      .setThumbnail(client.user.avatarURL)

    message.channel.send(embed);
  }
if(commandIs("membercount")){
	try {
      let guild = message.guild

      const embed = new Discord.RichEmbed()
        .setDescription("Membercount")
        .setColor(0x70b080)
        .setThumbnail(guild.iconURL)
        .setTimestamp(new Date())
        .addField("Name", guild.name, true)
        .addField("ID", guild.id, true)
        .addField("Owner", guild.owner.user.tag, true)
        .addField("Members", guild.memberCount, true)

      message.channel.send(embed)
      return;
    } catch (err) {
      console.log(err);
      message.channel.send(ess.errorHandle(err));
    }
}


    if(commandIs("mute")) {
	   if(message.member.hasPermission("MANAGE_MESSAGES")){
	   try {
      let role = message.guild.roles.find("name", "Muted");
      let member = message.mentions.members.first();
      let bot = message.guild.member(client.user);

      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }
      if (!role) {
        message.guild.createRole({
          name: 'Muted',
          color: 'BLACK',
        }).catch(err => message.channel.send(ess.errorHandle(err)))
        message.channel.send("There was no Muted role so I created it. Try the mute command again.")
        return;
      }

      member.setMute(true)
      message.channel.overwritePermissions(member, {
        "SEND_MESSAGES": false
      })
      member.addRole(role)
      message.channel.send("Muted!")
    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
	   }

    }
    if(commandIs("unmute")){
	     if(message.member.hasPermission("MANAGE_MESSAGES")){

	        try {
      let role = message.guild.roles.find("name", "Muted");
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }

      member.removeRole(role).catch(e => e)
      member.setMute(false)
      message.channel.permissionOverwrites.get(member.id).delete()
      message.channel.send("Unmuted User!")
      return;
    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
	     }

    }



  if (commandIs("purge")) {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
     try {
      if (!Number(message.content.split(" ")[1])) {
        message.channel.send("Please provide a number for amount of messages to be deleted.")
        return;
      }
      let deleteCount = parseInt(message.content.split(" ")[1])
      if (deleteCount > 99) {
        message.channel.send("Please try lower number than 100.");
        return;
      }

      message.channel.fetchMessages({
        limit: deleteCount + 1
      }).then(messages => message.channel.bulkDelete(messages));
      message.channel.send("Purged and cleared!").then(msg => msg.delete())


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
    }
  }
  if(commandIs("warn")){

    try {
      let member = message.mentions.members.first();
      if (!member) {
        message.channel.send("Please mention a valid member in this guild.");
        return;
      }
      if (!member.kickable) {
        message.channel.send("I cannot warn this user. Please check permissions.");
        return;
      }

      let reason = message.content.split(" ").slice(2).join(" ")
      if (!reason) {
        message.channel.send("Please indicate a reason for the warn!");
        return;
      }

      member.send(`You have been warned for ${reason}`)
      message.channel.send(`${member.user.tag} has been warned by ${message.author.tag} of the reason that ${reason}`);
      return;


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
  }



})
client.on('message', message => {
  if (message.content === ':verify') {
      if (message.member.roles.has(config.role)) {
          message.reply("You are already verified!")
      } else {
          message.channel.send({embed: {
              title: "Verification instructions",
              description: "To verify your account with roblox, please type your username.",
          }})
          activeverifies.get(message.guild.id).set(message.author.id, 1)
      }
  }  else if (activeverifies.get(message.guild.id).get(message.author.id) == 1) {
      rbx.getIdFromUsername(message.content).then((id) => {
          console.log("https://www.roblox.com/users/"+id+"/profile");
           let theid = randomLorem() + "-" + randomLorem() + "-" + randomLorem();
              message.channel.send({embed: {
              title: "Verification",
              description: "Add the following code `"+theid+"` to your roblox profile status and send anything when done."
           }});
          ids.set(message.author.id, [id, theid, message.content]);
          activeverifies.get(message.guild.id).set(message.author.id, 2);
      }).catch( (reason) => {
          message.reply("Mission failed with: " + reason.toString())
          console.log("Mission failed with: " + reason.toString())
          activeverifies.get(message.guild.id).delete(message.author.id);
      })
  } else if (activeverifies.get(message.guild.id).get(message.author.id) == 2) {
      let id = ids.get(message.author.id)
      rbx.getStatus(id[0]).then((status) => {
          if (status.includes(id[1])) {
              message.channel.send({embed: {
                  title: "Verification complete!",
                  description: "You did it!"
              }})
              console.log("Following user:'"+id[2]+"' have been verified" )
              message.member.addRole(config.role)
              message.member.setNickname(id[2])
              //name section

          } else {
              message.reply("I couldn't find that in your description...\n Try again? `:verify`")
          }
          activeverifies.get(message.guild.id).delete(message.author.id)
      }).catch( (reason) => {
          message.reply("Errored with: " + reason.toString())
          activeverifies.get(message.guild.id).delete(message.author.id);
      })
  }
//update




});

client.login(process.env.BOT_TOKEN);
