const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Retrive the information of a server member.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member whose details you want.")
    ),
  async execute(interaction, client) {
    const member =
      interaction.options.getMember("member") || interaction.member;
    const activities = member.presence?.activities || [];

    const focusActivity = activities.find((x) => x.assets);

    const dataUser = await client.getProfile(member);

    if (!dataUser) {
      await interaction.reply({
        content: `This user does not have an account yet, we will create one for him`,
      });
    } else if (dataUser) {
      const embed = new MessageEmbed()
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.displayAvatarURL(),
        })
        .setColor(
          member.displayHexColor === "#000000"
            ? "#ffffff"
            : member.displayHexColor
        )
        .setThumbnail(
          focusActivity
            ? `https://cdn.discordapp.com/app-assets/${focusActivity.applicationId}/${focusActivity.assets.largeImage}`
            : member.user.displayAvatarURL()
        )
        .setDescription(
          activities
            .map(
              (x, i) =>
                `**${x.type}**: \`${x.name || "None"} : ${
                  x.details || "None"
                } : ${x.state || "None"}\``
            )
            .join("\n")
        )

        .addField("JoinedAt", member.joinedAt.toLocaleString(), true)
        .addField(
          "Account Created At",
          member.user.createdAt.toLocaleString(),
          true
        )

        .addField(
          "Information",
          [
            `Invitation Verified: \`${dataUser.verified}\``,
            `Invitation fake: \`${dataUser.fake}\``,
            `Invitation left: \`${dataUser.left}\``,
            `Code: \`${dataUser.code}\``,
            `Roles: ${member.roles.cache
              .map((r) => r)
              .join(" ")
              .replace("@everyone", " ")}`,
            `Display Name: \`${member.displayName}\``,
            `Pending Member: \`${member.pending ? "Yes" : "No"}\``,
            `Booster: \`${
              member.premiumSince
                ? "since " + member.premiumSince.toLocaleString()
                : "Nope"
            }\``,
          ].join("\n")
        );

      console.log(Date.now() - member.user.createdAt / 1000 / 60 / 60 / 24);

      return interaction.reply({ embeds: [embed] });
    }
  },
};
