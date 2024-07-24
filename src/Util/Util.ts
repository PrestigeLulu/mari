import { prisma } from "./Prisma";
import { bot } from "../../index";
import { TextChannel } from "discord.js";

export function upsertGuild(
  guildId: string,
  channelId: string,
  messageId: string
) {
  return prisma.guild.upsert({
    where: {
      id: guildId,
    },
    update: {
      channelId: channelId,
      messageId: messageId,
    },
    create: {
      id: guildId,
      channelId: channelId,
      messageId: messageId,
    },
  });
}

export function getGuild(guildId: string) {
  return prisma.guild.findUnique({
    where: {
      id: guildId,
    },
    select: {
      id: true,
      channelId: true,
      messageId: true,
      musics: true,
    },
  });
}

export async function getMainMessage(guildId: string) {
  const guild = await getGuild(guildId);
  if (!guild) return null;
  const channel = bot.guilds.cache
    .get(guildId)
    ?.channels.cache.get(guild.channelId);
  if (!channel) return null;
  if (!(channel instanceof TextChannel)) return null;
  return channel.messages.fetch(guild.messageId);
}
