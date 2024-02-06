import {prisma} from './Prisma';
import {bot} from '../../index';
import {TextChannel} from 'discord.js';
import {YouTubeVideo} from 'play-dl';

export function upsertGuild(guildId: string, channelId: string, messageId: string) {
	return prisma.guild.upsert({
		where: {
			id: guildId
		},
		update: {
			channelId: channelId,
			messageId: messageId
		},
		create: {
			id: guildId,
			channelId: channelId,
			messageId: messageId
		}
	});
}

export function getGuild(guildId: string) {
	return prisma.guild.findUnique({
		where: {
			id: guildId
		},
		select: {
			id: true,
			channelId: true,
			messageId: true,
			musics: true
		},
	});
}

export async function getMainMessage(guildId: string) {
	const guild = await getGuild(guildId);
	if (!guild) return null;
	const channel = bot.guilds.cache.get(guildId)?.channels.cache.get(guild.channelId);
	if (!channel) return null;
	if (!(channel instanceof TextChannel)) return null;
	return channel.messages.fetch(guild.messageId);
}

export function getTime(video: YouTubeVideo): string {
	const seconds = video.durationInSec;
	const hour = Math.floor(seconds / 3600) < 10 ? '0' + Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
	const min = Math.floor((seconds % 3600) / 60) < 10 ? '0' + Math.floor((seconds % 3600) / 60) : Math.floor((seconds % 3600) / 60);
	const sec = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;
	return `${hour}:${min}:${sec}`;
}