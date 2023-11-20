module.exports = {
  name: "ready",
  execute(client) {
    console.log("Starting service ...");
    console.log("Developed with ❤️ by Hortis");
    const oniChan = client.channels.cache.get(client.config.ticketChannel);
    const verify = client.channels.cache.get(client.config.verifyChannel);
    const react = client.channels.cache.get(client.config.reactChannel);

    const guild = client.guilds.cache.get(client.config.guildID);
    client.channels.cache
      .get(client.config.ChannelMemberCountID)
      .setName(
        `${client.config.ChannelNameMemberCounter} ${
          guild.members.cache.filter((member) => !member.user.bot).size
        }`
      );

    const server_roles = guild.roles.cache.get(client.config.RoleMemberCountID)
      .members.size;

    client.channels.cache
      .get(client.config.ChannelRoleCountID)
      .setName(`${client.config.ChannelNameRoleCounter} ${server_roles}`);

    //Verification

    function sendVerifMSG() {
      const row = new client.discord.MessageActionRow().addComponents(
        new client.discord.MessageButton()
          .setCustomId("verify")
          .setLabel("Verify")
          .setStyle("SUCCESS")
          .setEmoji("✅"),

        new client.discord.MessageButton()
          .setCustomId("no-verify")
          .setLabel("Do not verify")
          .setStyle("DANGER")
          .setEmoji("❌"),

        new client.discord.MessageButton()
          .setCustomId("help")
          .setLabel("Help")
          .setStyle("SECONDARY")
      );

      const embed = new client.discord.MessageEmbed()
        .setColor("#2c2f33")
        .setTitle("Verification Required!")
        .setDescription(
          ` **To access \`Project\`, you need to pass the verification first.** \n Press on the Verify button below.`
        )
        .setTimestamp()
        .setFooter({ text: client.config.footerText });

      verify.send({
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });
    }

    verify.bulkDelete(100).then(() => {
      sendVerifMSG();
    });

    //Reaction role

    function sendReactMSG() {
      const row = new client.discord.MessageActionRow().addComponents(
        new client.discord.MessageSelectMenu()
          .setCustomId("roles")
          .setPlaceholder("Select a reaction role")
          .addOptions([
            {
              label: "Reaction Role 1",
              description: "Take this role by clicking me ",
              value: "first_option",
            },
            {
              label: "Reaction Role 2",
              description: "Take this role by clicking me ",
              value: "second_option",
            },
            {
              label: "Reaction Role 3",
              description: "Take this role by clicking me ",
              value: "third_option",
            },
            {
              label: "Reaction Role 4",
              description: "Take this role by clicking me ",
              value: "fourth_option",
            },
            {
              label: "Reaction Role 5",
              description: "Take this role by clicking me s",
              value: "fifth_option",
            },
          ])
      );

      const embed = new client.discord.MessageEmbed()
        .setColor(client.color)
        .setTitle("Rôles de notifications")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          "Veuillez choisir les rôles de notifications que vous voulez dans le menu déroulant ci-dessous."
        )
        .setTimestamp()
        .setFooter({
          text: `${client.user.username}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });

      react.send({
        embeds: [embed],
        components: [row],
      });
    }

    react.bulkDelete(100).then(() => {
      sendReactMSG();
    });

    //Ticket

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor("3F4197")
        .setTitle("Support - Project")
        .setDescription("To open a ticket, please click on the button below")
        .setTimestamp()
        .setFooter({
          text: client.config.footerText,
          iconURL: client.user.avatarURL(),
        });

      const row = new client.discord.MessageActionRow().addComponents(
        new client.discord.MessageButton()
          .setCustomId("open-ticket")
          .setLabel("Open a ticket")
          .setEmoji("✉️")
          .setStyle("PRIMARY")
      );

      oniChan.send({
        embeds: [embed],
        components: [row],
      });
    }

    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG();
    });
  },
};
