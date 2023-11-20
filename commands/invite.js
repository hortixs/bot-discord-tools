const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Obtenir votre code d'authentifaction")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Le membre qui va recevoir une invitation.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Code d'authentification")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const member =
      interaction.options.getMember("member") || interaction.member;
    const code = interaction.options.getString("code");
    const dataUser = await client.getProfile(member);
    const data = await client.getProfile(interaction);

    const embed = new client.discord.MessageEmbed()
      .setAuthor("Invitation | Successful")
      .setDescription(`You have given **1** invitation to @${member.user.tag}`)
      .setColor("RANDOM")
      .setTimestamp();

    if (member === interaction.member) {
      await client.updateProfile(interaction, {
        usedCode: 0,
      });
      await interaction.reply({
        content: `You can't give yourself an invitation`,
        ephemeral: true,
      });
    }
    if (
      code === dataUser.code &&
      data.usedCode != 1 &&
      Date.now() - interaction.user.createdAt >
        1000 * 60 * 60 * 24 * client.config.daysVerified
    ) {
      await client.updateProfile(member, {
        verified: (dataUser.verified += 1),
      });
      await client.updateProfile(interaction, {
        linkAccount: member.id,
        usedCode: 1,
      });
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    } else if (
      code === dataUser.code &&
      Date.now() - interaction.user.createdAt <
        1000 * 60 * 60 * 24 * client.config.daysVerified
    ) {
      await client.updateProfile(member, {
        fake: (dataUser.fake += 1),
      });
      await interaction.reply({
        content: `Your account is too young, you can't give a real invitation`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Erreur: You have already used your order or this code does not exist`,
        ephemeral: true,
      });
    }
  },
};
