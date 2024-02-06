import {EmbedBuilder} from 'discord.js';
import {YouTubeVideo} from 'play-dl';
import {getTime} from './Util';

export const getColorEmbed = () => new EmbedBuilder()
	.setColor('#cf85ff');

export const getDefaultEmbed = () => getColorEmbed()
	.setTitle('🎤 나랑 노래 부를 사람!')
	.setDescription('원하는 곡의 이름이나 유튜브 링크를 주면 내가 노래를 불러줄게!' +
		'\n또는 s만 입력하면 현재 노래를 스킵할 수 있고' +
		'\ns [원하는 노래 번호] 를 입력하면 해당 노래를 삭제 할 수 있어!')
	.setImage('attachment://mari.jpg');

export const getFailEmbed = () => getColorEmbed()
	.setTitle('미안! 그런 노래는 들어본적이 없어 ㅠㅠ')
	.setDescription('노래 이름을 다시 확인해줄래?')
	.setImage('attachment://sadmari.jpg');

export const getMusicEmbed = (info: YouTubeVideo) => getColorEmbed()
	.setTitle(`🎤 노래 부르는중!`)
	.setDescription(`**현재 재생중**\n[${info.title}](${info.url})`)
	.setThumbnail(info.thumbnails[0].url)
	.setFields([
		{name: '길이', value: getTime(info), inline: true},
		{name: '채널명', value: info.channel?.name || '', inline: true}
	]);