import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  InteractionContextType,
} from "discord.js";
import SlashCommand from "../../Structures/SlashCommand";
import { prisma } from "../../Util/Prisma";

const slash = new SlashCommandBuilder()
  .setName("reset")
  .setDescription("Reset the queue");
// .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const command = new SlashCommand(slash, async (bot, interaction) => {
  const guild = interaction.guild;
  if (!guild) return;
  try {
    await prisma.music.deleteMany({
      where: {
        guildId: guild.id,
      },
    });
    await interaction.reply({
      content: "Resetted the queue",
      flags: "Ephemeral",
    });
  } catch (e: any) {
    console.error(e);
    await interaction.reply({
      content: "Failed to reset the queue",
      flags: "Ephemeral",
    });
  }
});

export default command;
