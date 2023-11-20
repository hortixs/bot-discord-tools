const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin_invitations")
    .setDescription("Command to manage the invitations of others.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Member to whom we will modify these invitations")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("All options")
        .addChoice("set", "set")
        .addChoice("add", "add")
        .addChoice("clear", "clear")
        .addChoice("remove", "remove")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of invitation")
        .addChoice("fake", "fake")
        .addChoice("verified", "verified")
        .addChoice("left", "left")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("number")
        .setDescription("Number of invitations to delete")
        .setRequired(false)
    ),

async execute(interaction, client) {
    const member = interaction.options.getMember("member") || interaction.member;
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);
    const dataUser = await client.getProfile(member);
    const type = interaction.options.getString("type");
    const options = interaction.options.getString("options");
    const number = interaction.options.getString("number");

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) {
        return interaction.reply({
            content: "You do not have the required permission to run this command! (`BAN_MEMBERS`)",
            ephemeral: true,
        });
    }

    const typeMapping = {
        "fake": "fake",
        "verified": "verified",
        "left": "left"
    };

    const optionActions = {
        "set": (num) => num,
        "clear": () => 0,
        "add": (num, data) => data + num,
        "remove": (num, data) => data - num
    };

    if (typeMapping[type] && optionActions[options]) {
        await client.updateProfile(member, {
            [typeMapping[type]]: optionActionsoptions
        });
    }
}

