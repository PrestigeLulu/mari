import {EmbedBuilder} from 'discord.js';

export const getColorEmbed = () => new EmbedBuilder()
	.setColor('#cf85ff');

export const getDefaultEmbed = () => getColorEmbed()
	.setTitle('🎤 나랑 노래 부를 사람!')
	.setDescription('원하는 곡의 이름이나 유튜브 링크를 주면 내가 노래를 불러줄게!')
	.setImage('attachment://mari.jpg');