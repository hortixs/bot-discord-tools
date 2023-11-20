const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Save message"),
  async execute(message, client) {
    const msg = client.snipes.get(message.channel.id);
    const executer = client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.user.id);

    if (
      !executer.permissions.has(client.discord.Permissions.FLAGS.ADMINISTRATOR)
    )
      return interaction.reply({
        content:
          "You do not have the required permission to run this command! `MUTE`",
        ephemeral: true,
      });

    if (!msg)
      return message.reply({
        content: "No message found!",
        ephemeral: true,
      });

    const saveMessage = client.channels.cache.get(
      client.config.logsSaveMessage
    );

    const embed = new MessageEmbed()
      .setDescription(
        `Save message in **<#${message.channel.id}>**\n\n` +
          "Message: by: " +
          `<@${msg.author}>` +
          `\nContent  : **${msg.content}**`
      )
      .setTimestamp();

    if (msg.image) embed.setImage(msg.image);
    saveMessage.send({ embeds: [embed] });
    message.reply({
      content: "Your message has been recorded",
      ephemeral: true,
    });
  },
};
