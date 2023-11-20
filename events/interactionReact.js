module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.customId == "roles") {
      if (interaction.isSelectMenu()) {
        let choice = interaction.values[0];
        const member = interaction.member;
        if (choice == "first_option") {
          //ROLE 1
          if (member.roles.cache.some((role) => role.id == client.config.r1)) {
            interaction.reply({
              content: `The role <@&${client.config.r1}> was successfully removed from you`,
              ephemeral: true,
            });
            member.roles.remove(client.config.r1);
          } else {
            member.roles.add(client.config.r1);
            await interaction.reply({
              content: `The role <@&${client.config.r1}> was successfully added to you`,
              ephemeral: true,
            });
          }
          //ROLE 2
        } else if (choice == "second_option") {
          if (member.roles.cache.some((role) => role.id == client.config.r2)) {
            interaction.reply({
              content: `The role <@&${client.config.r2}> was successfully removed from you`,
              ephemeral: true,
            });
            member.roles.remove(client.config.r2);
          } else {
            member.roles.add(client.config.r2);
            await interaction.reply({
              content: `The role <@&${client.config.r2}> was successfully added to you`,
              ephemeral: true,
            });
          }
          //ROLE 3
        } else if (choice == "third_option") {
          if (member.roles.cache.some((role) => role.id == client.config.r3)) {
            interaction.reply({
              content: `The role <@&${client.config.r3}> was successfully removed from you`,
              ephemeral: true,
            });
            member.roles.remove(client.config.r3);
          } else {
            member.roles.add(client.config.r3);
            await interaction.reply({
              content: `The role <@&${client.config.r3}> was successfully added to you`,
              ephemeral: true,
            });
          }
        } else if (choice == "fourth_option") {
          if (member.roles.cache.some((role) => role.id == client.config.r4)) {
            interaction.reply({
              content: `The role <@&${client.config.r4}> was successfully removed from you`,
              ephemeral: true,
            });
            member.roles.remove(client.config.r4);
          } else {
            member.roles.add(client.config.r4);
            await interaction.reply({
              content: `The role <@&${client.config.r4}> was successfully added to you`,
              ephemeral: true,
            });
          }
        } else if (choice == "fifth_option") {
          if (member.roles.cache.some((role) => role.id == client.config.r5)) {
            interaction.reply({
              content: `The role <@&${client.config.r5}> was successfully removed from you`,
              ephemeral: true,
            });
            member.roles.remove(client.config.r5);
          } else {
            member.roles.add(client.config.r5);
            await interaction.reply({
              content: `The role <@&${client.config.r5}> was successfully added to you`,
              ephemeral: true,
            });
          }
        }
      }
    }
  },
};
