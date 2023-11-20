const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get someone's avatar")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Member to get the avatar")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let member = interaction.options.getMember("membre") || interaction.member;

    await interaction.reply({
      embeds: [
        {
          author: {
            name: "Avatar of " + member.user.tag,
          },
          image: {
            url: member.user.displayAvatarURL({
              dynamic: true,
              size: 4096,
              format: "png",
            }),
          },
          color: "BLACK",
          timestamp: new Date(),
        },
      ],
      allowedMentions: { repliedUser: false },
    });
  },
};
