module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const dataUser = await client.getProfile(interaction);
    const channel = client.channels.cache.get(client.config.logsVerification);
    if (interaction.isButton()) {
      if (interaction.customId === "help") {
        await interaction.reply({
          content: `🔔Click on the green button to access the server. \n🔔Click on the red button to leave the server.`,
          ephemeral: true,
        });
      }

      if (interaction.customId === "no-verify") {
        await interaction.member.kick("He did not want to check himself");
      } else if (
        interaction.customId === "verify" &&
        dataUser.verifiedAccount != 1
      ) {
        //IMAGE
        const { Captcha } = require("captcha-canvas");
        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha();

        const captchaAttachment = new client.discord.MessageAttachment(
          await captcha.png,
          "captcha.png"
        );

        const embed = new client.discord.MessageEmbed()
          .setTitle("Please complete this captcha :")
          .setAuthor({
            name: "Hello! Are you human?",
          })
          .setDescription(
            `\`Please type the captcha below to be able to access this server!\` \n\n Additional Notes: 
            \n <:1_:973286317486116984> Type out the traced colored characters from left to right.
            \n <:2_:973286317473554533> Ignore the decoy characters spread-around.
            \n <:3_:973286317062512721> You don't have to respect characters cases (upper/lower case)!`
          )
          .setImage("attachment://captcha.png")
          .setFooter({ text: "Time: 2 minutes" });

        //PERMISSION
        interaction.channel.permissionOverwrites.edit(interaction.user, {
          SEND_MESSAGES: true,
        });

        console.log(
          `Start captcha pour ${interaction.user.tag} | Time: 2 minutes`
        );
        //MESSAGE CAPTCHA
        interaction.reply({
          files: [captchaAttachment],
          embeds: [embed],
          ephemeral: true,
        });
        await client.updateProfile(interaction, {
          verifiedAccount: 1,
        });

        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          time: 120000,
          max: 1,
        });

        collector.on("collect", (m) => {
          setTimeout(() => {
            m.delete();
          }, 2500);
          if (m.content === captcha.text) {
            interaction.member.roles.add(client.config.roleVerif);
            interaction.followUp({
              content: `Well done, you have passed the verification`,
              ephemeral: true,
            });
            client.updateProfile(interaction, {
              verifiedAccount: 0,
            });
            channel.send({
              embeds: [
                new client.discord.MessageEmbed()
                  .setColor("GREEN")
                  .setTitle(`Logs | Verification`)
                  .setDescription(
                    `<@!${interaction.user.id}> passed the verification with the code: **${captcha.text}**`
                  ),
              ],
            });
            collector.stop();
          }
          if (m.content !== captcha.text) {
            interaction.followUp({
              content: `Last try, before you get kicked`,
              ephemeral: true,
            });
            collector.stop();
          }
          collector.stop();
          //CHECK NO ERROR IN INTERACTION
          const nVerify = interaction.channel.createMessageCollector({
            filter,
            time: 120000,
            max: 2,
          });

          const NotVerify = new client.discord.MessageEmbed()
            .setTitle(`Captcha failed`)
            .setDescription(
              `You did not pass the captcha \n\n You can try again`
            )
            .setTimestamp();
          nVerify.on("collect", (m) => {
            setTimeout(() => {
              m.delete();
            }, 2500);
            if (m.content !== captcha.text) {
              interaction.followUp({
                embeds: [NotVerify],
                ephemeral: true,
              });
              client.updateProfile(interaction, {
                verifiedAccount: 0,
              });
              interaction.member.kick("Don't verify");
              nVerify.stop();
            }
          });
        });
      }
    }
  },
};
