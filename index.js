const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
//Config
const config = require("./config.json");
const configTwitter = require("./configTwitter.json");
//Twitter
const Discord = require("discord.js");
const moment = require("moment-timezone");
const { FilteredStream } = require("twitv2-stream");
const twitter = new FilteredStream({
  token: configTwitter.BearerToken,
});
moment.suppressDeprecationWarnings = true;

//Permission
const client = new Client({
  intents: [
    32767,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

//Configuration discord
client.discord = Discord;
client.config = config;

//Find commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
  console.log(`Events > ${event.name} | ${file}`);
}

console.log(`Commands > ${commandFiles.length} successfully loaded`);
console.log(`Events > ${eventFiles.length} successfully loaded`);
//Connect database (MongoDB)

require("./database/mongo")();
require("./utils/functions")(client);

//Function Save Message
client.snipes = new Map();
client.on("messageCreate", function (message, channel) {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author.id,
    image: message.attachments.first()
      ? message.attachments.first().proxyURL
      : null,
  });
});

client.on("guildMemberRemove", async (member) => {
  client.deleteProfile(member);
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK",
  });
  const kickLog = fetchedLogs.entries.first();

  if (!kickLog) {
    console.log("(ERROR) > No users detected");
  }
  const { executor, target } = kickLog;
  const embed = new MessageEmbed()
    .setColor("#FF0000")
    .setTitle(":lock: Logs | Kick")
    .setDescription(`${member.user.tag} has been kicked by ${executor.tag} `)
    .setTimestamp();

  const channel = client.channels.cache.get(config.logsMod);

  if (target.id === member.id) {
    channel.send({ embeds: [embed] });
  } else {
  }
});

client.on("guildMemberUpdate", async (member) => {
  const guild = client.guilds.cache.get(client.config.guildID);

  setInterval(() => {
    const server_roles = guild.roles.cache.get(client.config.RoleMemberCountID)
      .members.size;
    client.channels.cache
      .get(client.config.ChannelRoleCountID)
      .setName(`${client.config.ChannelNameRoleCounter} ${server_roles}`);
  }, 2500);
});

//Function Twitter
let DISCORD_TOKEN = require("./data.json").token;
const axios = require("axios");
function createMessage(channelID, content) {
  return axios.post(
    `https://discord.com/api/v8/channels/${channelID}/messages`,
    content,
    {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}
twitter.addRule([
  { value: `from:${configTwitter.idTwitter}`, tag: configTwitter.nameTwitter },
]);
twitter.on("tweet", (tweet) => {
  console.log(tweet);
  createMessage(configTwitter.channelTwitter, {
    content: `https://twitter.com/${configTwitter.nameTwitter}/status/${tweet.data.id}`,
  });
});
twitter.on(configTwitter.nameTwitter, () => {
  og("(TWITTER) > New Tweet");
});

twitter.on("connected", () => {
  console.log("Connect to the Twitter API ...");
});

twitter.on("api-errors", (err) => {
  console.log("(ERROR) > API Error");
  console.error(err);
});

twitter.on("stream-error", (err) => {
  console.log("(ERROR) > Stream Error");
  console.error(err);
});

//Function interaction event
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "An error occurred while executing this command!",
      ephemeral: true,
    });
  }
});
//Connexion in API
twitter.connect();
client.login(require("./data.json").token);
