const { SlashCommandBuilder } = require("@discordjs/builders");
const { Profile } = require("../model/index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Verifiy an user."),

  async execute(interaction, client) {
    const dataUser = await Profile.findOne({ userID: interaction.user.id });

    if (dataUser) {
      await interaction.reply({
        content:
          `Here is your authentication code: **` +
          dataUser.code +
          `** \n\nInvitation link: ${client.config.discordLink}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "You do not have an authentication code, please retry the order in 5 seconds",
        ephemeral: true,
      });
    }
  },
};
