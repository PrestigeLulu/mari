import Event from '../../Structures/Event';
import {Message} from 'discord.js';
import play from 'play-dl';
import {getFailEmbed} from '../../Util/EmbedUtil';
import {addMusic, skipMusic} from '../../Util/Queue';
import {joinVoiceChannel} from '@discordjs/voice';
import {getGuild} from '../../Util/Util';

const Ready = new Event('messageCreate', async function (bot, message: Message) {
	// 채널 확인
	if (!message.guildId || !message.guild) return;
	if (message.author.bot) return;
	const guildData = await getGuild(message.guildId);
	if (!guildData) return;
	if (message.channelId !== guildData.channelId) return;
	// 메세지 지우기
	await message.delete();
	// 음성 채널 확인
	const voiceChannel = message.member?.voice.channel;
	if (!voiceChannel) return;
	const song = message.content;
	// 스킵
	if(song.startsWith('s')) {
		const number = song.split(' ')[1] || '1';
		console.log(number);
		if(isNaN(Number(number))) return;
		await skipMusic(message.guildId, Number(number));
		return;
	}
	// 제목으로 찾기
	const yt_info = (await play.search(song, {limit: 1}))[0];
	if (!yt_info) {
		const res = await message.channel.send({
			content: message.author.toString(),
			embeds: [getFailEmbed()],
			files: [`${__dirname}/../../Image/sadmari.jpg`]
		});
		setTimeout(() => {
			res.delete();
		}, 1000 * 10);
		return;
	}
	// 연결
	joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: message.guildId,
		adapterCreator: message.guild.voiceAdapterCreator
	});
	await addMusic(message.guildId, yt_info.url);
});

export default Ready;