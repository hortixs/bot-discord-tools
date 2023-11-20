let hastebin = require("hastebin");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (
        client.guilds.cache
          .get(interaction.guildId)
          .channels.cache.find((c) => c.topic == interaction.user.id)
      ) {
        return interaction.reply({
          content: "Vous avez déjà créé un ticket.",
          ephemeral: true,
        });
      }

      interaction.guild.channels
        .create(`ticket-${interaction.user.username}`, {
          parent: client.config.parentTicket,
          topic: interaction.user.id,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            {
              id: client.config.roleSupport,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ["VIEW_CHANNEL"],
            },
          ],
          type: "text",
        })
        .then(async (c) => {
          interaction.reply({
            content: `Ticket créé! <#${c.id}>`,
            ephemeral: true,
          });

          const embed = new client.discord.MessageEmbed()
            .setColor("6d6ee8")
            .setDescription("Select the category of your ticket")
            .setFooter(
              "NoIdeaIndustry",
              "https://cdn.discordapp.com/avatars/658681986508128287/b8bb026b2bc83e62b464ec61428d21fc.png?size=1024"
            )
            .setTimestamp();
          const row = new client.discord.MessageActionRow().addComponents(
            new client.discord.MessageSelectMenu()
              .setCustomId("category")
              .setPlaceholder("Select the category of the ticket")
              .addOptions([
                {
                  label: "Test",
                  value: "Test",
                  emoji: "📝",
                },
                {
                  label: "Test1",
                  value: "Test1",
                  emoji: "🎟️",
                },
              ])
          );

          msg = await c.send({
            content: `<@!${interaction.user.id}>`,
            embeds: [embed],
            components: [row],
          });

          const collector = msg.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            time: 20000,
          });

          collector.on("collect", (i) => {
            if (i.user.id === interaction.user.id) {
              if (msg.deletable) {
                msg.delete().then(async () => {
                  const embed = new client.discord.MessageEmbed()
                    .setColor("6d6ee8")
                    .setTitle("Ticket - NoIdeaIndustry")

                    .setDescription(
                      `<@!${interaction.user.id}> created a ticket of the category : **${i.values[0]}**`
                    )
                    .setFooter({
                      text: client.config.footerText,
                      iconURL:
                        "https://cdn.discordapp.com/avatars/658681986508128287/b8bb026b2bc83e62b464ec61428d21fc.png?size=1024",
                    })
                    .setTimestamp();

                  const row =
                    new client.discord.MessageActionRow().addComponents(
                      new client.discord.MessageButton()
                        .setCustomId("close-ticket")
                        .setLabel("Fermer le ticket")
                        .setEmoji("899745362137477181")
                        .setStyle("DANGER")
                    );

                  const opened = await c.send({
                    content: `<@&${client.config.roleSupport}>`,
                    embeds: [embed],
                    components: [row],
                  });

                  opened.pin().then(() => {
                    opened.channel.bulkDelete(1);
                  });
                });
              }
              if (i.values[0] == "📝Test") {
                c.edit({
                  parent: client.config.parentTicket,
                });
              }
              if (i.values[0] == "🎟️Test1") {
                c.edit({
                  parent: client.config.parentTicket,
                });
              }
            }
          });

          collector.on("end", (collected) => {
            if (collected.size < 1) {
              c.send(`No category selected. Closing the ticket...`).then(() => {
                setTimeout(() => {
                  if (c.deletable) {
                    c.delete();
                  }
                }, 10000);
              });
            }
          });
        });
    }

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow().addComponents(
        new client.discord.MessageButton()
          .setCustomId("confirm-close")
          .setLabel("Fermer le ticket")
          .setStyle("DANGER"),
        new client.discord.MessageButton()
          .setCustomId("no")
          .setLabel("Annuler la fermeture")
          .setStyle("SECONDARY")
      );

      const verif = await interaction.reply({
        content: "Are you sure you want to close the ticket?",
        components: [row],
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 10000,
      });

      collector.on("collect", (i) => {
        if (i.customId == "confirm-close") {
          interaction.editReply({
            content: `Ticket closed by <@!${interaction.user.id}>`,
            components: [],
          });

          chan
            .edit({
              name: `closed-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
                },
                {
                  id: client.config.roleSupport,
                  allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ["VIEW_CHANNEL"],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor("6d6ee8")
                .setAuthor("Ticket - Close")
                .setDescription("```Logs ticket```")
                .setFooter({
                  text: client.config.footerText,
                  iconURL:
                    "https://cdn.discordapp.com/avatars/658681986508128287/b8bb026b2bc83e62b464ec61428d21fc.png?size=1024",
                })
                .setTimestamp();

              const row = new client.discord.MessageActionRow().addComponents(
                new client.discord.MessageButton()
                  .setCustomId("delete-ticket")
                  .setLabel("Delete and archive the ticket")
                  .setEmoji("🗑️")
                  .setStyle("DANGER")
              );

              chan.send({
                embeds: [embed],
                components: [row],
              });
            });

          collector.stop();
        }
        if (i.customId == "no") {
          interaction.editReply({
            content: "Closing of the cancelled ticket!",
            components: [],
          });
          collector.stop();
        }
      });

      collector.on("end", (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: "Closing of the cancelled ticket!",
            components: [],
          });
        }
      });
    }

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: "Saving messages...",
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages
          .filter((m) => m.author.bot !== true)
          .map(
            (m) =>
              `${new Date(m.createdTimestamp).toLocaleString("fr-FR")} - ${
                m.author.username
              }#${m.author.discriminator}: ${
                m.attachments.size > 0
                  ? m.attachments.first().proxyURL
                  : m.content
              }`
          )
          .reverse()
          .join("\n");
        if (a.length < 1) a = "Nothing";
        hastebin
          .createPaste(
            a,
            {
              contentType: "text/plain",
              server: "https://hastebin.com",
            },
            {}
          )
          .then(function (urlToPaste) {
            const embed = new client.discord.MessageEmbed()
              .setAuthor(
                "Logs Ticket",
                "https://cdn.discordapp.com/avatars/658681986508128287/b8bb026b2bc83e62b464ec61428d21fc.png?size=1024"
              )
              .setDescription(
                `📰 Ticket logs created by <@!${chan.topic}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`
              )
              .setColor("2f3136")
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor(
                "Logs Ticket",
                "https://cdn.discordapp.com/avatars/658681986508128287/b8bb026b2bc83e62b464ec61428d21fc.png?size=1024"
              )
              .setDescription(
                `📰 Logs of your ticket \`${chan.id}\`: [**Click here to see the logs**](${urlToPaste})`
              )
              .setColor("2f3136")
              .setTimestamp();

            client.channels.cache
              .get(client.config.logsTicket)
              .send({
                embeds: [embed],
              })
              .catch();
            chan.send("Delete the channel..");

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
      });
    }
  },
};
