const PREFIX = require("../envDoesntWork.json").PREFIX;

//responding to actions taken in discord, ie. delete a message, sending a message, reactions
module.exports = (client, aliases, callback) => {
  if (typeof aliases === "string") {
    aliases = [aliases];
  }

  //registering an event

  client.on("message", async (message) => {
    const { content } = message;

    aliases.forEach((alias) => {
      const command = `${PREFIX}${alias}`;

      if (content.startsWith(`${command} `) || content === command) {
        callback(message);
      }
    });

    if (message.author.bot) return; //preventing a bot to reply to itself

    if (
      content === "hello" &&
      message.channel.name === "tenshi_experimentation"
    ) {
      message.reply("hello there!"); // if this was "hello", it would infinitely send hello without line 9
    }

    if (
      content === "what is the prefix" &&
      message.channel.name === "tenshi_experimentation"
    ) {
      message.reply(`It's ${PREFIX}.`);
    }

    if (
      message.author.tag === "guardian_angel#0205" &&
      message.channel.name === "tenshi-experimentation"
    ) {
      let tenshiSayings = [
        "Sorry I don't speak, pleb.",
        "Get back to work.",
        "Don't you have anything better to do?",
        "This is embarrassing but ... I don't care.",
        "Creator, you have broken my heart </3.",
      ];
      let randomPhrase = Math.floor(Math.random() * tenshiSayings.length);
      message.channel.send(tenshiSayings[randomPhrase]);
    }

    if (content.startsWith(PREFIX)) {
      /*=============================================
    =            About array destructuring            =
    =============================================*/

      //array destructuring to make first element of the array is going to be put into the variable CMD_NAME then everything after will be inside the args variable which will be an arg
      // ie. $greet user => cmdname = greet and user is ['user']
      // ie. $greet u s e r => cmdname = greet and user is ['u','s','e','r']

      /*=====  End of About array destructuring  ======*/

      const [CMD_NAME, ...args] = message.content
        .trim() //Trim is for taking away the white space at the start and ends
        .substring(PREFIX.length) //sub string to get part of the start namely the string after the prefix.
        .split(/\s+/); //split to make an array at the white space
      if (CMD_NAME === "kick") {
        //you'll need to give the bot permissions for this
        if (!message.member.hasPermission("KICK_MEMBERS"))
          return message.reply("You don't have permissions to kick users.");
        if (args.length === 0) return message.reply("Please provide a user");
        const member = message.guild.members.cache.get(args[0]); //cache is basically a Collection, contains the
        //snowflakes and GuildMember
        //get is a method for a Map because the methods a Collection has
        // will store the GuildMember object inside of member
        if (member) {
          member
            .kick()
            .then((member) => message.channel.send(member, "was kicked.")) // is a promise, will return GuildMember
            .catch((error) => message.channel.send("I can't kick ", member));
        } else {
          message.channel.send(`That member was not found`);
        }
      } else if (CMD_NAME === "ban") {
        //user doesn't have to be in the server. Just has to exist. Errors on non-existing users.
        if (!message.member.hasPermission("BAN_MEMBERS"))
          return message.reply("You don't have permissions to kick users.");
        if (args.length === 0) return message.reply("Please provide a user");

        try {
          const user = await message.guild.members.ban(args[0]); //gives a user resolvable => user object, snowflake(id),
          //message, GuildMember
          message.channel.send("User was banned successfully.");
        } catch (error) {
          message.channel.send(
            `I couldn't do that. Either I don't have permissions or that user doesn't exists.`
          );
        }
      }     
    }

    client.on("messageReactionAdd", (reaction, user) => {
      //the reaction param is being field the Client object
      // console.log("A reaction was done");
      const { name } = reaction.emoji;
      const member = reaction.message.guild.members.cache.get(user.id);
      let role = reaction.message.guild.roles.cache.find(
        (role) => role.name === "test-role"
      );
      if (reaction.message.id === "774115551127011338") {
        switch (name) {
          case "🐱":
            member.roles.add("774114942349475850");
            reaction.message.reply(`${member} was given the role ${role}.`);
            break;
          case "774379818434297858":
            member.roles.add("774381041828757534");
            reaction.message.reply(`${member} was given the role ${role}.`);
            break;
        }
      }
    });

    client.on("messageReactionRemove", (reaction, user) => {
      // console.log("shoulda remove");
      const { name } = reaction.emoji;
      const member = reaction.message.guild.members.cache.get(user.id);
      let role = reaction.message.guild.roles.cache.find(
        (role) => role.name === "test-role"
      );
      if (reaction.message.id === "774115551127011338") {
        switch (name) {
          case "🐱":
            member.roles.remove("774114942349475850");
            reaction.message.reply(
              `The role, ${role}, was removed from ${member}.`
            );
            break;
          case "774379818434297858" :
            member.roles.remove("774381041828757534");
            reaction.message.reply(
              `The role, ${role}, was removed from ${member}.`
            );
            break;
        }
      }
    });
  });
};

// const webhookClient = new WebhookClient(webhookId, webhookToken); //three params 3rd is optional => id, token, options