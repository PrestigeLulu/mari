import {prisma} from './Prisma';
import {getMainMessage} from './Util';
import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	VoiceConnectionConnectingState
} from '@discordjs/voice';
import play from 'play-dl';
import {getDefaultEmbed, getMusicEmbed} from './EmbedUtil';

export async function getMusics(guildId: string) {
	return prisma.music.findMany({
		where: {
			guildId: guildId
		},
		orderBy: {
			createdAt: 'asc'
		}
	});
}

export async function addMusic(guildId: string, url: string) {
	const guild = await prisma.guild.update({
		where: {
			id: guildId
		},
		data: {
			musics: {
				create: {
					url: url
				}
			}
		},
		select: {
			musics: true
		}
	});
	if (!guild) return;
	if (guild.musics.length === 1) {
		await playMusic(guildId);
	}
}

export async function removeMusic(guildId: string, id: string, noPlay: boolean = false) {
	await prisma.music.delete({
		where: {
			id: id
		}
	});
	if (noPlay) return;
	if ((await getMusics(guildId)).length > 0) {
		await playMusic(guildId);
	} else {
		const message = await getMainMessage(guildId);
		if (!message) return;
		await message.edit({
			embeds: [getDefaultEmbed()],
			files: [`${__dirname}/../Image/mari.jpg`]
		});
	}
}

export async function skipMusic(guildId: string, id: number = 1) {
	const musics = (await getMusics(guildId));
	if (musics.length === 0) return;
	if (id === 1) {
		await stopMusic(guildId);
		return;
	}
	if(id < 1 || id > musics.length) return;
	await removeMusic(guildId, musics[id - 1].id, true);
}

export async function stopMusic(guildId: string) {
	const connection = getVoiceConnection(guildId);
	if (!connection) return;
	const state = connection.state as VoiceConnectionConnectingState;
	if (!state.subscription) return;
	state.subscription.player.stop();
}

export async function playMusic(guildId: string) {
	const musics = (await getMusics(guildId))[0];
	if (!musics) return;
	const player = createAudioPlayer();
	const connection = getVoiceConnection(guildId);
	if (!connection) return;
	const yt_info = await play.video_info(musics.url);
	if (!yt_info) return;
	const stream = await play.stream_from_info(yt_info);
	const resource = createAudioResource(stream.stream, {inputType: stream.type});
	connection.subscribe(player);
	player.play(resource);
	player.on(AudioPlayerStatus.Idle, async () => {
		try {
			await removeMusic(guildId, musics.id);
		}catch (e) {
			console.log(e);
		}
	});
	const message = await getMainMessage(guildId);
	if (!message) return;
	await message.edit({embeds: [getMusicEmbed(yt_info.video_details)], files: []});
}