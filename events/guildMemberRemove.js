const moment = require("moment");
module.exports = {
  name: "guildMemberRemove",
  execute(member, client) {
    const dataUser = client.getProfile(member);
    const channel = client.channels.cache.get(client.config.logsLeaveChannel);
    client.channels.cache
      .get(client.config.ChannelMemberCountID)
      .setName(
        `${client.config.ChannelNameMemberCounter} ${
          member.guild.members.cache.filter((member) => !member.user.bot).size
        }`
      );

    console.log(dataUser.linkAccount);

    const embed = new client.discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Leave member !`)
      .setDescription(
        `<@!${member.id}> leave the server \n\n  ID : **${
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
  },
};
