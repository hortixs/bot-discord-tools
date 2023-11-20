module.exports = {
  execute(client) {
    const guild = client.guilds.cache.get(client.config.guildID);
    setInterval(() => {
      const memberCount = guild.memberCount;
      const channel = guild.channels.cache.get(
        client.config.ChannelRoleCountID
      );
      channel.setName(`test`);
    }, 5000);
  },
};
