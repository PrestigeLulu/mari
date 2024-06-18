import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../Structures/SlashCommand";
import { prisma } from "../../Util/Prisma";

const slash = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Reset the queue")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const command = new SlashCommand(slash, async (bot, interaction) => {
  await prisma.music.deleteMany();
  await interaction.reply({ content: "Resetted the queue", ephemeral: true });
});

export default command;
