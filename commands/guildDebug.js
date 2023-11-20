const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("Commande debug"),
  async execute(interaction, client) {
    const guild = client.guilds.cache.get(interaction.guildId);
    const server_roles = guild.roles.cache.get(client.config.RoleMemberCountID)
      .members.size;

    client.channels.cache
      .get(client.config.ChannelRoleCountID)
      .setName(`${client.config.ChannelNameRoleCounter} ${server_roles}`);
  },
};
