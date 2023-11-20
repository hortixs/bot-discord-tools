const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Add someone to the ticket")
    .addStringOption((option) =>
      option.setName("message").setDescription("Mon message").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("repeat")
        .addChoice("yes", "yes")
        .addChoice("no", "no")
        .setDescription("repeat infinitely or not")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("repeat_infinite")
        .setDescription(
          "number of times to send this message (-1 for infinite)"
        )
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("time")
        .setDescription("Delay between each message")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time_type")
        .setDescription(
          "The type of delay you want (Day / hours / minutes / seconds)"
        )
        .addChoice("day", "day")
        .addChoice("hours", "hours")
        .addChoice("minutes", "minutes")
        .addChoice("seconds", "seconds")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel where the message will be sent")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const channel = client.channels.cache.get("978746056005267466");
    const executer = client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.user.id);
    const message = interaction.options.getString("message");
    const repeat = interaction.options.getString("repeat");
    const repeat_infinite = interaction.options.getNumber("repeat_infinite");
    const time = interaction.options.getNumber("time");
    const time_type = interaction.options.getString("time_type");
    if (!executer.permissions.has(client.discord.Permissions.FLAGS.ADMINISTRATOR)) {
        return interaction.reply({
            content: "You do not have the required permission to run this command! `ADMINISTRATOR`",
            ephemeral: true,
        });
    }
    await interaction.reply({
        content: `Action successfully completed`,
        ephemeral: true,
    });

    const timeMapping = {
        "day": 86400000,
        "hours": 3600000,
        "minutes": 60000,
        "seconds": 1000
    };

    if (repeat === "yes" && timeMapping[time_type]) {
        if (repeat_infinite !== -1) {
            channel.send({ content: `${repeat_infinite}` });
        }
        setInterval(() => {
            client.guilds.cache
                .get(interaction.guildId)
                .channels.cache.get(interaction.options.getChannel("channel").id)
                .send({ content: message });
        }, time * timeMapping[time_type]);
    } else if (repeat === "no") {
        await client.guilds.cache
            .get(interaction.guildId)
            .channels.cache.get(interaction.options.getChannel("channel").id)
            .send({ content: message });
    }
}