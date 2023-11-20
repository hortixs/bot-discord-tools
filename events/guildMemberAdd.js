const moment = require("moment");
module.exports = {
  name: "guildMemberAdd",
  execute(member, client) {
    client.channels.cache
      .get(client.config.ChannelMemberCountID)
      .setName(
        `${client.config.ChannelNameMemberCounter} ${
          member.guild.members.cache.filter((member) => !member.user.bot).size
        }`
      );
    const channel = client.channels.cache.get(client.config.logsWelcome);
    const dataUser = client.getProfile(member);

    const embed = new client.discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`New member !`)
      .setDescription(
        `<@!${member.id}> joined the server \n\n  ID : **${
          member.id
        }** \n\n**JoinedAt**: ${member.joinedAt.toLocaleString()} \n\n**Created at:** ${moment(
          member.user.createdAt,
          "MMMM Do YYYY"
        ).fromNow()}`
      )
      .setTimestamp()
      .setThumbnail(
        member.displayAvatarURL({ size: 1024, dynamic: true, format: "png" })
      );
    channel.send({ embeds: [embed] });

    if (dataUser) {
    }
    if (!dataUser) {
    }
  },
};
