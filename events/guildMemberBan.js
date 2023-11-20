const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildBanAdd",
  execute(ban, client) {
    const channel = client.channels.cache.get(client.config.logsMod);
    const embed = new MessageEmbed()
      .setColor("#FF0000")
      .setTitle(":lock: Logs | Ban")
      .setDescription(`${ban.user.tag} **was banned** `)
      .setFooter({ text: `ID: ${ban.guild.id}`, iconURL: ban.guild.iconURL })
      .setTimestamp();

    channel.send({ embeds: [embed] });
    client.deleteProfile(ban);
  },
};
