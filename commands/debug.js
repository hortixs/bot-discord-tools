const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("Commande debug")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Member to create your profile")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("create")
        .setDescription("Create a member's profile")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("delete")
        .setDescription("Deleted a member's profile")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const executer = client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(interaction.user.id);
    const member =
      interaction.options.getMember("membre") || interaction.member;
    const dataUser = await client.getProfile(member);

    if (
      !executer.permissions.has(client.discord.Permissions.FLAGS.ADMINISTRATOR)
    )
      return interaction.reply({
        content:
          "You do not have the required permission to run this command! (`ADMINISTRATOR`)",
        ephemeral: true,
      });

    if (member.user.id == client.user.id) {
      return interaction.reply({
        content: `The bot cannot have a profile, impossible action !`,
        ephemeral: true,
      });
    }

    if (dataUser) {
      if (interaction.options.getMember("membre")) {
        console.log(`(DEBUG) ` + dataUser.username + " | " + dataUser.userID);
        interaction.reply({
          content: `Profile found with success!`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `Profile not found!`,
          ephemeral: true,
        });
      }

      if (interaction.options.getString("create")) {
        await client.createProfile(newProfile);
        interaction.reply({
          content: `Profile create successfully!`,
          ephemeral: true,
        });
      } else if (interaction.options.getString("delete")) {
        await client.deleteProfile(member.user.id);
        interaction.reply({
          content: `Profile successfully deleted!`,
          ephemeral: true,
        });
      }
    } else {
      if (member.user.id == executer.user.id) {
        return interaction.reply({
          content: `You don't have a profile, I do.`,
          ephemeral: true,
        });
      } else {
        return interaction.reply({
          content:
            member.user.username +
            ` does not have a profile, I will take care of it.`,
          ephemeral: true,
        });
      }
    }
  },
};
